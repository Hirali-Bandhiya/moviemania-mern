import { useState } from "react";

function AdminSearchInput({ placeholder, onSearch }) {
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={search}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
    />
  );
}

export default AdminSearchInput;