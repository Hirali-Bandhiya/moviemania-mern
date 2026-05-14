import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";
import AdminStatsCard from "./AdminStatsCard";
import movies from "../../data/movies";
import offers from "../../data/offers";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    totalUsers: 0,
    totalOffers: 0
  });

  useEffect(() => {
    const movieCount = movies.filter((m) => m.type === "movie").length;
    const seriesCount = movies.filter((m) => m.type === "series").length;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userCount = users.length;

    setStats({
      totalMovies: movieCount,
      totalSeries: seriesCount,
      totalUsers: userCount,
      totalOffers: offers.length
    });
  }, []);

  const chartData = {
    labels: ["Movies", "Series", "Users", "Offers"],
    datasets: [
      {
        label: "Count",
        data: [stats.totalMovies, stats.totalSeries, stats.totalUsers, stats.totalOffers],
        backgroundColor: ["#dc2626", "#2563eb", "#16a34a", "#f59e0b"],
        borderColor: ["#dc2626", "#2563eb", "#16a34a", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminStatsCard title="Total Movies" value={stats.totalMovies} />
        <AdminStatsCard title="Total Series" value={stats.totalSeries} />
        <AdminStatsCard title="Total Users" value={stats.totalUsers} />
        <AdminStatsCard title="Total Offers" value={stats.totalOffers} />
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Overview Chart</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default AdminAnalytics;