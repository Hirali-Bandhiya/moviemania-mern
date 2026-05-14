import { useState, useEffect } from "react";
import api from "../services/api";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import AdminModal from "./components/AdminModal";
import AdminForm from "./components/AdminForm";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subscription: ""
  });
  const [errors, setErrors] = useState({});

  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email format is invalid.";
    
    // Ignore subscription validation if not present
    if (formData.subscription === undefined) formData.subscription = "Basic";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "password123", // default password
      subscription: "Basic",
      role: "User"
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      subscription: user.subscriptionPlan || "Basic",
      role: user.role || "User"
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        loadUsers();
      } catch(err) {
        alert("Delete failed");
      }
    }
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        if (editingUser) {
          await api.put(`/users/${editingUser._id}`, formData);
        } else {
          await api.post("/auth/register", formData);
        }
        setIsModalOpen(false);
        loadUsers();
      } catch(err) {
        alert("Failed to save user");
      }
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const userFormFields = [
    { name: "name", label: "Name", type: "text", required: true, placeholder: "Enter user name" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "Enter email address" },
    {
      name: "subscription",
      label: "Subscription",
      type: "select",
      required: true,
      options: [
        { value: "Basic", label: "Basic" },
        { value: "Premium", label: "Premium" },
        { value: "Family", label: "Family" }
      ]
    }
  ];

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-gray-200 font-sans selection:bg-red-500/30">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <AdminNavbar />
        <div className="p-8 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Users Management</h2>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 w-full bg-[#1e293b]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-white backdrop-blur-md transition-all placeholder-gray-500 shadow-inner shadow-black/20"
            />
          </div>

          <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Subscription</th>
                  <th className="p-4 font-semibold">Referral Code</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-medium text-white">
                      {user.name}
                    </td>
                    <td className="p-4 text-gray-400">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        user.subscriptionPlan === 'Premium' ? 'bg-amber-500/20 text-amber-300 border-amber-500/20' :
                        user.subscriptionPlan === 'Family' ? 'bg-purple-500/20 text-purple-300 border-purple-500/20' :
                        'bg-gray-500/20 text-gray-300 border-gray-500/20'
                      }`}>
                        {user.subscriptionPlan || "Basic"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 font-mono">
                      {user.referralCode || "N/A"}
                    </td>
                    <td className="p-4 text-right space-x-4">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-red-300 transition-colors font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === page
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User" : "Add New User"}
      >
        <AdminForm
          fields={userFormFields}
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitLabel={editingUser ? "Update" : "Add"}
          onCancel={() => setIsModalOpen(false)}
        />
      </AdminModal>
    </div>
  );
}

export default AdminUsers;