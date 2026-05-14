function AdminStatsCard({ title, value, color = "blue", icon }) {
  const gradientClasses = {
    red: "from-red-600/20 to-orange-600/20 border-red-500/30 text-red-500",
    blue: "from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-400",
    green: "from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400",
    purple: "from-purple-600/20 to-pink-600/20 border-purple-500/30 text-purple-400",
    yellow: "from-yellow-600/20 to-amber-600/20 border-yellow-500/30 text-yellow-400",
    indigo: "from-indigo-600/20 to-blue-600/20 border-indigo-500/30 text-indigo-400"
  };

  const currentStyle = gradientClasses[color] || gradientClasses.blue;

  return (
    <div className={`bg-gradient-to-br ${currentStyle} bg-[#0f172a]/40 backdrop-blur-md border rounded-2xl p-6 shadow-lg shadow-black/20 hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-default hover:shadow-${color}-500/20 relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/10 transition-colors"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
          <p className="text-4xl font-extrabold text-white">
            {value}
          </p>
        </div>
        {icon && (
          <div className="text-5xl opacity-80 drop-shadow-lg group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStatsCard;