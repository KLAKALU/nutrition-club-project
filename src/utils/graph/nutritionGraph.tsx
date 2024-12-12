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

import { Nutrition, NutritionGraphProps } from '@/types/types';

function NutritionObjectToList(nutrition: Nutrition) {
  const nutritionList = [];
  nutritionList.push(nutrition.energy);
  nutritionList.push(nutrition.protein);
  nutritionList.push(nutrition.fat);
  nutritionList.push(nutrition.carbohydrate);
  nutritionList.push(nutrition.calcium);
  nutritionList.push(nutrition.iron);
  nutritionList.push(nutrition.zinc);
  nutritionList.push(nutrition.vitaminA);
  nutritionList.push(nutrition.vitaminD);
  nutritionList.push(nutrition.vitaminE);
  nutritionList.push(nutrition.vitaminK);
  nutritionList.push(nutrition.vitaminB1);
  nutritionList.push(nutrition.vitaminB2);
  nutritionList.push(nutrition.vitaminC);
  return nutritionList;
}
  
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
    
  export default function NutritionGraph(graphprops: NutritionGraphProps) {
      console.log(graphprops.graphprops);
      if (!graphprops.graphprops.length) {
        console.log("データがありません");
        return <div>データがありません</div>
      }
      const breakfastNutrition = graphprops.graphprops.find(data => data.meal_type === "breakfast");
      const breakfastNutritionList = breakfastNutrition ? NutritionObjectToList(breakfastNutrition) : [];
      const lunchNutrition = graphprops.graphprops.find(data => data.meal_type === "lunch");
      const lunchNutritionList = lunchNutrition ? NutritionObjectToList(lunchNutrition) : [];
      const dinnerNutrition = graphprops.graphprops.find(data => data.meal_type === "dinner");
      const dinnerNutritionList = dinnerNutrition ? NutritionObjectToList(dinnerNutrition) : [];
      console.log(breakfastNutritionList);
    const data = {
        labels,
        datasets: [ 
          {
            label: "朝食",
            borderColor: "rgb(255, 99, 132)",
            data: breakfastNutritionList
          },
          {
            label: "昼食",
            backgroundColor: "rgb(75, 192, 192)",
            data: lunchNutritionList
          },
          {
            label: "夕食",
            backgroundColor: "rgb(53, 162, 235)",
            data: dinnerNutritionList
          }
        ]
      };
      return (
        <div className="">
          <Chart type={"bar"} data={data} options={options} />
        </div>
      );
    }
    
  