function LoadingSpinner({ message, className = "py-20" }) {
  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      {message && <p className="mt-4 text-gray-400 text-lg">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
