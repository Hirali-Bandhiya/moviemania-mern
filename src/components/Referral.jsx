import { useState } from "react";

function Referral() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleApply = () => {
    if (code.trim() === "") {
      setMessage("Referral code required");
    } else if (code !== "MOVIE20") {
      setMessage("Invalid referral code");
    } else {
      setMessage("Referral applied successfully 🎉");
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Have a Referral Code?</h3>

      <input
        type="text"
        placeholder="Enter code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ padding: "8px" }}
      />

      <button onClick={handleApply} style={{ marginLeft: "10px" }}>
        Apply
      </button>

      <p>{message}</p>
    </div>
  );
}

export default Referral;