import { useEffect, useState } from "react";

function PaymentHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("paymentHistory") || "[]");
    setHistory(stored);
  }, []);

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
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/10 p-4 rounded-xl border border-white/10"
          >
            <div>
              <p className="text-white font-semibold">{item.plan} Plan</p>
              <p className="text-gray-300 text-sm">
                Paid on {new Date(item.paidAt).toLocaleDateString()} at {new Date(item.paidAt).toLocaleTimeString()}
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
