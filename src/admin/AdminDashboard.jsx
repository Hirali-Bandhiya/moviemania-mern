import { useState, useEffect } from "react";
import api from "../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import AdminStatsCard from "./components/AdminStatsCard";
import offers from "../data/offers";

import movies from "../data/movies";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    totalUsers: 0,
    totalOffers: offers.length
  });

  const [moviesData, setMoviesData] = useState([]);

  useEffect(() => {
    setMoviesData(movies);
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data: usersData } = await api.get("/users");
        setStats({
          totalMovies: movies.filter((m) => m.type !== "series").length,
          totalSeries: movies.filter((m) => m.type === "series").length,
          totalUsers: Array.isArray(usersData) ? usersData.length : 0,
          totalOffers: offers.length,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
        setStats({
          totalMovies: movies.filter((m) => m.type !== "series").length,
          totalSeries: movies.filter((m) => m.type === "series").length,
          totalUsers: 0,
          totalOffers: offers.length,
        });
      }
    };

    loadStats();
  }, []);

  // Chart data for Movies vs Series
  const chartData = {
    labels: ["Movies", "Series"],
    datasets: [
      {
        data: [stats.totalMovies, stats.totalSeries],
        backgroundColor: ["#dc2626", "#2563eb"],
        borderColor: ["#dc2626", "#2563eb"],
        borderWidth: 1,
      },
    ],
  };

  // Genre distribution chart
  const genreData = moviesData.reduce((acc, item) => {
    const g = item.genre || "Unknown";
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const genreChartData = {
    labels: Object.keys(genreData),
    datasets: [
      {
        label: "Count",
        data: Object.values(genreData),
        backgroundColor: [
          "#dc2626",
          "#2563eb",
          "#16a34a",
          "#9333ea",
          "#ea580c",
          "#0891b2",
          "#ca8a04"
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-gray-200 font-sans selection:bg-red-500/30">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <AdminNavbar />
        <div className="p-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Dashboard Overview</h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminStatsCard
              title="Total Movies"
              value={stats.totalMovies}
              color="red"
              // icon="🎬"
            />
            <AdminStatsCard
              title="Total Series"
              value={stats.totalSeries}
              color="blue"
              // icon="📺"
            />
            <AdminStatsCard
              title="Total Users"
              value={stats.totalUsers}
              color="green"
              // icon="👥"
            />
            <AdminStatsCard
              title="Total Offers"
              value={stats.totalOffers}
              color="purple"
              //  icon="🎯"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Movies vs Series Pie Chart */}
            <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl shadow-xl shadow-black/20 p-8 border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-lg font-bold mb-6 text-gray-200 tracking-wide">Content Distribution</h3>
              <div className="h-72 flex justify-center">
                <Pie data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Genre Distribution Bar Chart */}
            <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-2xl shadow-xl shadow-black/20 p-8 border border-white/5 hover:border-white/10 transition-colors">
              <h3 className="text-lg font-bold mb-6 text-gray-200 tracking-wide">Genre Distribution</h3>
              <div className="h-72">
                <Bar
                  data={genreChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;