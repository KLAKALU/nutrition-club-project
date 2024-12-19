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

import ChartDataLabels from 'chartjs-plugin-datalabels';

import { BodyComposition } from "@/types/types";

import dayjs from "dayjs";
interface BodyGraphProps {
  bodyComposition: BodyComposition[];
}

export default function BodyCompositionGraph({ bodyComposition }: BodyGraphProps) {
  bodyComposition = bodyComposition.reverse();
  if (!bodyComposition.length) {
    console.log("データがありません");
    return <div>データがありません</div>;
  }
  console.log(bodyComposition);
  const labels = bodyComposition.map((data) => dayjs(data.year_month).format("MMM"));
  //const labels = ["February", "March", "April", "May", "June", "July"];
  const bodyFatList = ([bodyComposition.map((data) => data.body_fat)])
  const bodyWeightList = ([bodyComposition.map((data) => data.weight)])
  const muscleMassList = ([bodyComposition.map((data) => data.muscle_mass)])

  const data = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "体脂肪",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        fill: false,
        data: bodyFatList[0],
        yAxisID: "y"
      },
      {
        type: "bar" as const,
        label: "体重",
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "white",
        borderWidth: 2,
        data: bodyWeightList[0],
        yAxisID: "y1"
      },
      {
        type: "bar" as const,
        label: "筋肉",
        backgroundColor: "rgb(53, 162, 235)",
        data: muscleMassList[0],
        yAxisID: "y1"
      }
    ]
  };

  const options = {
    plugins: {
      ChartDataLabels,
      datalabels: {
        color: "black" as const,
        align: 'top' as const,
        offset: 4,
      },
      legend: {
        position: "bottom" as const,
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
        position: "right" as const,
        max: 100,
        min: 0
      }
    }
  };
  return (
    <div className="w-[500px]">
      <Chart type={"bar"} data={data} options={options} />
    </div>
  );
}

