import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Title
} from "chart.js";
import { Chart } from "react-chartjs-2";

import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Title,
  ChartDataLabels
);
  
  const labels = ["February", "March", "April", "May", "June", "July"];
  
  const data = {
    labels,
    datasets: [ 
      {
        type: "line",
        label: "体脂肪",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        fill: false,
        data: [10.2, 15.2, 15.4, 15.9, 16.2, 16.0],
        yAxisID: "y"
      },
      {
        type: "bar",
        label: "体重",
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "white",
        borderWidth: 2,
        data: [80.4, 80.2, 80.1, 79.3, 78.2, 80.1],
        yAxisID: "y1"
      },
      {
        type: "bar",
        label: "筋肉",
        backgroundColor: "rgb(53, 162, 235)",
        data: [70.3, 72.3, 71.3, 70.5, 70.2, 69.3],
        yAxisID: "y1"
      }
    ]
  };
  
  const options = {
    plugins: {
      ChartDataLabels,
      datalabels: {
        color: "black",
        align: 'top',
        offset: 4,
      },
      legend: {
        position: "bottom"
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: false
      },
      y: {
        stacked: false,
        max: 20,
        min: 0
      },
      y1: {
        stacked: false,
        position: "right",
        max: 100,
        min: 0
      }
    }
  };
  
export default function BodyGraph() {
    return (
      <div className="w-[500px]">
        <Chart type={"bar"} data={data} options={options} />
      </div>
    );
  }
  
