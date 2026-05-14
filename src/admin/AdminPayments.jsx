import { useEffect, useState } from "react";
import api from "../services/api";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";

function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get("/payments/records/all");
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setPayments([]);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    const paymentId = String(payment.paymentId || "").toLowerCase();
    const userName = String(payment.user?.name || payment.guestName || "").toLowerCase();
    const email = String(payment.user?.email || payment.guestEmail || "").toLowerCase();
    const plan = String(payment.plan || "").toLowerCase();
    const status = String(payment.status || "").toLowerCase();

    return (
      paymentId.includes(query) ||
      userName.includes(query) ||
      email.includes(query) ||
      plan.includes(query) ||
      status.includes(query)
    );
  });

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-gray-200 font-sans selection:bg-red-500/30">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <AdminNavbar />
        <div className="p-8 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Payments History</h2>
          </div>

          <div className="mb-8">
            <input
              type="text"
              placeholder="Search payments by id, user, email, plan or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 w-full bg-[#1e293b]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-white backdrop-blur-md transition-all placeholder-gray-500 shadow-inner shadow-black/20"
            />
          </div>

          <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Payment ID</th>
                  <th className="p-4 font-semibold">User Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Plan</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500 font-medium">
                      No payments recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-xs font-mono text-gray-500">
                        {String(payment.paymentId).slice(-8)}
                      </td>
                      <td className="p-4 font-medium text-white">
                        {payment.user?.name || payment.guestName || "Guest Checkout"}
                      </td>
                      <td className="p-4 text-gray-400">
                        {payment.user?.email || payment.guestEmail || "—"}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          payment.plan === 'Premium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/20' :
                          payment.plan === 'Family' ? 'bg-purple-500/20 text-purple-300 border-purple-500/20' :
                          payment.plan === 'Standard' ? 'bg-teal-500/20 text-teal-300 border-teal-500/20' :
                          'bg-blue-500/20 text-blue-300 border-blue-500/20'
                        }`}>
                          {payment.plan}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-300">
                        ₹{payment.amount}
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(payment.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'Success' ? 'bg-green-500/20 text-green-300 border border-green-500/20' :
                          payment.status === 'Failed' ? 'bg-red-500/20 text-red-300 border border-red-500/20' :
                          'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPayments;
