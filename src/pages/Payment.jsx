import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getCurrentUser, logout } from "../utils/auth";
import {
  clearPendingPlanSelection,
  normalizePlanSelection,
  readPendingPlanSelection,
} from "../utils/planSelection";
// icons removed (scan UI removed)

const RAZORPAY_SCRIPT_ID = "razorpay-checkout-script";
const SUCCESS_REDIRECT_DELAY_MS = 2200;

const loadRazorpayScript = () => {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const existingScript = document.getElementById(RAZORPAY_SCRIPT_ID);

    if (existingScript) {
      existingScript.onload = () => {
        // sometimes the script sets window.Razorpay slightly after load
        const start = Date.now();
        const poll = setInterval(() => {
          if (window.Razorpay) {
            clearInterval(poll);
            resolve(true);
          } else if (Date.now() - start > 3000) {
            clearInterval(poll);
            resolve(false);
          }
        }, 100);
      };
      existingScript.onerror = () => resolve(false);
      return;
    }

    const script = document.createElement("script");
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      // poll briefly for window.Razorpay (some browsers may delay execution)
      const start = Date.now();
      const poll = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(poll);
          resolve(true);
        } else if (Date.now() - start > 3000) {
          clearInterval(poll);
          resolve(false);
        }
      }, 100);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [checkoutGlow, setCheckoutGlow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const movieId = location.state?.movieId;
  const redirectAfterPayment = location.state?.redirectAfterPayment;
  const [planSelection, setPlanSelection] = useState(() =>
    readPendingPlanSelection(location.state?.plan || new URLSearchParams(location.search).get("plan"))
  );

  // scan UI removed

  useEffect(() => {
    const resolvedPlan = readPendingPlanSelection(location.state?.plan || new URLSearchParams(location.search).get("plan"));
    setPlanSelection(resolvedPlan);
  }, [location.search, location.state?.plan]);

  const selectedPlan = useMemo(() => {
    return normalizePlanSelection(planSelection) || normalizePlanSelection("Basic");
  }, [planSelection]);

  useEffect(() => {
    if (!selectedPlan) {
      navigate("/plans", { replace: true });
    }
  }, [navigate, selectedPlan]);

  // Note: camera scanning removed — modal shows a simulated QR image only

  const handleClose = () => {
    setLoading(false);
    setCheckoutGlow(false);
    setErrorMessage("Payment was closed. Redirecting back to plans.");
    setTimeout(() => {
      navigate("/plans", { replace: true });
    }, 1000);
  };

  // scan UI removed

  const verifyPayment = async ({ orderId, paymentId, signature, amount, plan }) => {
    const { data } = await api.post("/payment/verify", {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      amount,
      planId: plan.planId,
      planName: plan.name,
      planPrice: plan.amount,
      paymentDate: new Date().toISOString(),
      mockPayment: !signature,
    });

    return data;
  };

  const startPayment = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);
    setCheckoutGlow(true);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay checkout script.");
      }

      const currentUser = getCurrentUser();

      const { data } = await api.post("/payment/create-order", {
        amount: selectedPlan.amount,
        planId: selectedPlan.planId,
        planName: selectedPlan.name,
      });

      // Validate response from backend
      if (!data || !data.keyId || !data.order || !data.order.id) {
        // If running on localhost, allow a safe mock fallback for local testing
        const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
        if (isLocal) {
          console.warn("Invalid payment init response — using local mock fallback.", data);
          const mockPaymentId = `pay_mock_${Date.now()}`;
          await verifyPayment({
            orderId: `order_mock_${Date.now()}`,
            paymentId: mockPaymentId,
            signature: null,
            amount: selectedPlan.amount,
            plan: selectedPlan,
          });

          setSuccessMessage("(Local) Payment successful. Redirecting to login...");
          setLoading(false);
          setTimeout(() => {
            clearPendingPlanSelection();
            logout();
            navigate("/login", { replace: true, state: { movieId, redirectAfterPayment } });
          }, SUCCESS_REDIRECT_DELAY_MS);
          return;
        }

        throw new Error("Payment initialization failed: invalid server response.");
      }

      // proceed to Razorpay checkout only

      const options = {
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "MovieMania",
        description: selectedPlan.name,
        order_id: data.order.id,
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
        },
        theme: {
          color: "#E50914",
        },
        modal: {
          ondismiss: handleClose,
        },
        handler: async (response) => {
          try {
            console.log("Razorpay payment response:", response);
            await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: selectedPlan.amount,
              plan: selectedPlan,
            });

            setSuccessMessage("Payment successful. Redirecting to login...");
            setLoading(false);
            setTimeout(() => {
              clearPendingPlanSelection();
              logout();
              navigate("/login", { replace: true, state: { movieId, redirectAfterPayment } });
            }, SUCCESS_REDIRECT_DELAY_MS);
          } catch (error) {
            console.error("Payment verification failed:", error);
            setErrorMessage(error?.response?.data?.message || error.message || "Payment verification failed. Please try again.");
            setLoading(false);
            setCheckoutGlow(false);
          }
        },
      };

      let razorpay;
      try {
        razorpay = new window.Razorpay(options);
      } catch (err) {
        console.error("Failed to create Razorpay instance:", err);
        throw new Error("Razorpay checkout is unavailable in this browser.");
      }

      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response?.error || response);
        setErrorMessage(response?.error?.description || "Payment failed. Please try again.");
        setLoading(false);
        setCheckoutGlow(false);
      });

      try {
        razorpay.open();
      } catch (err) {
        console.error("Error opening Razorpay checkout:", err);
        throw new Error("Unable to open Razorpay checkout. Please try again.");
      }
    } catch (error) {
      console.error("Failed to start payment:", error);
      const backendMessage = error?.response?.data?.message || error.message || "Unable to start payment.";
      // Do not fallback to non-Razorpay payment methods here.
      setErrorMessage(backendMessage);
      setLoading(false);
      setCheckoutGlow(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-6 text-white"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c')",
      }}
    >
      <div className="absolute inset-0 bg-black/80"></div>
      {checkoutGlow && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-emerald-500/25 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-400/20 blur-[90px] animate-pulse"></div>
        </div>
      )}

      <div className="relative max-w-xl w-full bg-gray-900/95 p-8 md:p-10 rounded-2xl text-center border border-red-500/30 shadow-2xl ring-1 ring-red-500/20">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-white tracking-wide">
          Complete Payment
        </h1>
        <p className="mb-6 text-gray-300">Secure checkout powered by Razorpay test mode.</p>

        {errorMessage && <p className="text-red-400 mb-4">{errorMessage}</p>}
        {!loading && errorMessage && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={startPayment}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Retry Payment
            </button>
          </div>
        )}
        {successMessage && <p className="text-green-400 mb-4">{successMessage}</p>}

        <div className="rounded-xl border border-gray-700 p-4 md:p-5 mb-5 bg-black/40 text-left">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Plan Summary</p>
              <h2 className="text-2xl font-bold text-white mt-1">{selectedPlan.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Price</p>
              <p className="text-2xl font-black text-white mt-1">₹{selectedPlan.amount}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
            <div className="rounded-lg bg-white/5 p-3">
              <span className="block text-gray-500 text-xs uppercase tracking-wider">Plan ID</span>
              <span className="font-semibold text-white">{selectedPlan.planId}</span>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <span className="block text-gray-500 text-xs uppercase tracking-wider">Billing</span>
              <span className="font-semibold text-white capitalize">{selectedPlan.billingCycle}</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400">
            You will be redirected to Razorpay checkout. If the payment modal is closed, you will be sent back to plans.
          </p>
        </div>

        <button
          onClick={startPayment}
          disabled={loading}
          className={`w-full py-3 rounded-lg transition text-white font-bold disabled:opacity-80 border ${
            loading
              ? "bg-gradient-to-r from-emerald-500 to-green-600 border-green-300/40 shadow-[0_0_30px_rgba(34,197,94,0.65)]"
              : "bg-red-600 hover:bg-red-700 border-red-500/40"
          }`}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/90 animate-ping"></span>
              <span>Preparing Secure Checkout...</span>
            </span>
          ) : (
            "Pay with Razorpay"
          )}
        </button>
        {loading && (
          <p className="mt-3 text-sm text-green-300 animate-pulse">
            Encrypting payment session...
          </p>
        )}

        {/* Scan UPI QR Code option removed */}
        <button
          type="button"
          onClick={() => navigate("/plans", { replace: true })}
          className="w-full mt-3 py-3 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition"
        >
          Back to Plans
        </button>

        {/* scanner removed */}
      </div>
    </div>
  );
}

export default Payment;