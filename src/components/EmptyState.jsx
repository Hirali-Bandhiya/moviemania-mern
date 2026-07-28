function EmptyState({ message, error = false, className = "py-20" }) {
  if (!message) return null;

  return (
    <div className={`text-center ${className}`}>
      <p className={`text-lg ${error ? "text-red-400" : "text-gray-400"}`}>
        {message}
      </p>
    </div>
  );
}

export default EmptyState;
