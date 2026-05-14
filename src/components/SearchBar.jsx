import { useState } from "react";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (search.trim() === "") {
      setError("Search cannot be empty");
    } else if (search.length < 3) {
      setError("Minimum 3 characters required");
    } else {
      setError("");
      alert("Searching for: " + search);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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