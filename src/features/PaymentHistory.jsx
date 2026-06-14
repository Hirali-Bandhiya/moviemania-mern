import { useEffect, useState } from "react";
import api from "../services/api";

function PaymentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        // Prefer the server record so payment history survives refreshes and new devices.
        const { data } = await api.get("/payments/me");
        if (active) {
          setHistory(Array.isArray(data) ? data : []);
        }
      } catch {
        const stored = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
        if (active) {
          setHistory(Array.isArray(stored) ? stored : []);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-black min-h-[200px] rounded-2xl p-8 text-center text-gray-300">
        Loading payment history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-black min-h-[200px] rounded-2xl p-8 text-center text-gray-300">
        No payment history yet.
      </div>
    );
  }

  return (
    <div className="bg-black rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6">Payment History</h2>
      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item._id || item.paymentId || item.orderId || item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/10 p-4 rounded-xl border border-white/10"
          >
            <div>
              <p className="text-white font-semibold">{item.subscriptionPlan || item.plan} Plan</p>
              <p className="text-gray-300 text-sm">
                Paid on {new Date(item.paymentDate || item.transactionDate || item.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <p className="text-white font-semibold">₹{item.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentHistory;
