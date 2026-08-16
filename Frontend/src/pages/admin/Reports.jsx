import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

import {
  MonthlyBarChart,
  CategoryPieChart,
  StatusDonut
} from '../../components/charts/DashboardCharts';

import api from '../../api/axios';


export default function Reports() {

  const [stats, setStats] = useState(null);


  // Get report data
  useEffect(() => {
    getStats();
  }, []);


  const getStats = async () => {

    try {

      const response = await api.get(
        '/requests/stats'
      );

      setStats(response.data);

    } catch (error) {

      console.log(error);

    }
  };


  // Show loading message
  if (!stats) {
    return (
      <AdminLayout
        pageTitle="Reports & Analytics"
        pageSubtitle="Service efficiency overview"
      >
        <p>Loading reports...</p>
      </AdminLayout>
    );
  }


  return (

    <AdminLayout
      pageTitle="Reports & Analytics"
      pageSubtitle="Service efficiency overview"
    >

      {/* Charts */}

      <div className="reports-container">

        <div className="reports-row">

          <div className="card">

            <h3>Requests by Status</h3>

            <StatusDonut data={stats} />

          </div>


          <div className="card">

            <h3>By Category</h3>

            <CategoryPieChart
              byCategory={stats.byCategory}
            />

          </div>

        </div>


        {/* Monthly chart */}

        <div className="card">

          <h3>Monthly Trend</h3>

          <MonthlyBarChart
            monthlyData={stats.monthlyData}
          />

        </div>


        {/* Summary table */}

        <div className="card">

          <h3>Summary</h3>

          <table className="data-table">

            <thead>

              <tr>
                <th>Metric</th>
                <th>Count</th>
              </tr>

            </thead>


            <tbody>

              <tr>
                <td>Total Requests</td>
                <td>{stats.total}</td>
              </tr>

              <tr>
                <td>Pending</td>
                <td>{stats.pending}</td>
              </tr>

              <tr>
                <td>Assigned</td>
                <td>{stats.assigned}</td>
              </tr>

              <tr>
                <td>In Progress</td>
                <td>{stats.inProgress}</td>
              </tr>

              <tr>
                <td>Completed</td>
                <td>{stats.completed}</td>
              </tr>

              <tr>
                <td>Rejected</td>
                <td>{stats.rejected}</td>
              </tr>

              <tr>
                <td>Total Users</td>
                <td>{stats.totalUsers}</td>
              </tr>

              <tr>
                <td>Total Technicians</td>
                <td>{stats.totalTechnicians}</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </AdminLayout>
  );
}