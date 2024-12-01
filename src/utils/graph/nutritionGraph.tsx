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

import { graphProps } from '@/types/types';
  
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
    Title
);
    
    const labels = ["エネルギー", "タンパク質", "脂質", "炭水化物", "カルシウム", "鉄","亜鉛", "ビタミンA", "ビタミンD", "ビタミンE", "ビタミンK", "ビタミンB1", "ビタミンB2", "ビタミンC"];
    
    const options = {
      plugins: {
        legend: {
          position: "bottom"
        }
      },
      responsive: true,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      }
    };
    
  export default function NutritionGraph({graphprops}: {graphprops: graphProps}) {
    const data = {
        labels,
        datasets: [ 
          {
            label: "朝食",
            borderColor: "rgb(255, 99, 132)",
            data: graphprops.list1
          },
          {
            label: "昼食",
            backgroundColor: "rgb(75, 192, 192)",
            data: graphprops.list2
          },
          {
            label: "夕食",
            backgroundColor: "rgb(53, 162, 235)",
            data: graphprops.list3
          }
        ]
      };
      return (
        <div className="">
          <Chart type={"bar"} data={data} options={options} />
        </div>
      );
    }
    
  