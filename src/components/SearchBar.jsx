import { useState } from "react";

function SearchBar({
  value,
  onChange,
  placeholder = "Search movies...",
  className = "w-full md:w-1/3",
}) {
  const [internalSearch, setInternalSearch] = useState("");
  const [error, setError] = useState("");

  const isControlled = value !== undefined;
  const searchValue = isControlled ? value : internalSearch;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    } else {
      setInternalSearch(e.target.value);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim() === "") {
      setError("Search cannot be empty");
    } else if (searchValue.length < 3) {
      setError("Minimum 3 characters required");
    } else {
      setError("");
      alert("Searching for: " + searchValue);
    }
  };

  if (isControlled) {
    return (
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        className={`${className} px-5 py-3 rounded-xl bg-white/10 text-white border border-white/10 focus:ring-2 focus:ring-red-600 outline-none`}
      />
    );
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        style={{ padding: "8px", width: "300px" }}
      />

      <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
        Search
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SearchBar;