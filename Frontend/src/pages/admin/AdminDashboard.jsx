import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  StatusDonut,
  MonthlyBarChart,
  CategoryPieChart
} from "../../components/charts/DashboardCharts";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {

  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get dashboard data
  useEffect(() => {
    api.get("/requests/stats")
      .then((response) => {
        setStats(response.data);
      })
      .catch(() => {
        setError("Failed to load dashboard statistics");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Show loading while API is running
  if (loading) {
    return (
      <AdminLayout pageTitle="Dashboard">
        <div>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      pageTitle="Dashboard"
      pageSubtitle={`Welcome back, ${user?.name}`}
    >

      {/* Error message */}
      {error && <div>{error}</div>}

      {/* Statistics */}
      <div className="grid-4">

        <div className="stat-card">
          <h3>Total Requests</h3>
          <p>{stats?.total || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{stats?.pending || 0}</p>
        </div>

        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{stats?.inProgress || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{stats?.completed || 0}</p>
        </div>

      </div>

      {/* Other statistics */}
      <div className="grid-2">

        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats?.totalUsers || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Technicians</h3>
          <p>{stats?.totalTechnicians || 0}</p>
        </div>

      </div>

      {/* Charts */}
      <div className="grid-3">

        <div className="card">
          <h3>Requests by Status</h3>
          {stats && <StatusDonut data={stats} />}
        </div>

        <div className="card">
          <h3>Requests by Category</h3>
          {stats && (
            <CategoryPieChart
              byCategory={stats.byCategory}
            />
          )}
        </div>

      </div>

      {/* Monthly chart */}
      <div className="card">
        <h3>Monthly Requests</h3>

        {stats && (
          <MonthlyBarChart
            monthlyData={stats.monthlyData}
          />
        )}
      </div>

    </AdminLayout>
  );
}