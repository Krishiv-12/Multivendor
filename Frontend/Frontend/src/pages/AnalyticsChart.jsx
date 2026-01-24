import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const AnalyticsChart = ({ stats }) => {
  const data = {
    labels: ["Users", "Products", "Orders", "Vendors"],
    datasets: [
      {
        label: "Counts",
        data: [stats.users, stats.products, stats.orders, stats.vendors],
        borderColor: "#4F46E5",
        backgroundColor: "#A5B4FC",
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4">📈 Admin Analytics</h2>
      <Line data={data} />
    </div>
  );
};

export default AnalyticsChart;
