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
  Title
);

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

const labels = ["エネルギー", "タンパク質", "脂質", "炭水化物", "カルシウム", "鉄", "亜鉛", "ビタミンA", "ビタミンD", "ビタミンE", "ビタミンK", "ビタミンB1", "ビタミンB2", "ビタミンC"];

const nutritionExplainTexts = {
  "エネルギー": "体を動かし、生命を維持するために必要な基本的なエネルギー源です。",
  "タンパク質": "筋肉、臓器、皮膚などの体の組織を作り、修復するために不可欠な栄養素です。",
  "脂質": "エネルギー源として、また細胞膜の構成成分として重要な役割を果たします。",
  "炭水化物": "脳や筋肉のエネルギー源として、また血糖値の維持に重要な栄養素です。",
  "カルシウム": "骨や歯の形成に必要で、筋肉の収縮や神経伝達にも関与する重要なミネラルです。",
  "鉄": "赤血球のヘモグロビンの成分として酸素運搬に不可欠なミネラルです。",
  "亜鉛": "味覚の維持や傷の治癒、免疫機能の維持に重要な役割を果たすミネラルです。",
  "ビタミンA": "視覚機能の維持や皮膚、粘膜の健康維持に必要な栄養素です。",
  "ビタミンD": "カルシウムの吸収を促進し、骨の形成に重要な役割を果たすビタミンです。",
  "ビタミンE": "抗酸化作用があり、細胞の酸化を防ぎ、免疫機能を支援します。",
  "ビタミンK": "血液凝固に不可欠で、骨の形成にも関与する重要なビタミンです。",
  "ビタミンB1": "糖質からのエネルギー産生に必要で、神経機能の維持に重要です。",
  "ビタミンB2": "エネルギー代謝や皮膚、粘膜の健康維持に関与する栄養素です。",
  "ビタミンC": "抗酸化作用があり、コラーゲンの生成や鉄の吸収を促進する重要なビタミンです。"
}

export default function NutritionGraph(graphprops: NutritionGraphProps) {
  console.log(graphprops.graphprops);
  const breakfastNutrition = graphprops.graphprops.find(data => data.meal_type === "breakfast");
  const breakfastNutritionList = breakfastNutrition ? NutritionObjectToList(breakfastNutrition) : [];
  const lunchNutrition = graphprops.graphprops.find(data => data.meal_type === "lunch");
  const lunchNutritionList = lunchNutrition ? NutritionObjectToList(lunchNutrition) : [];
  const dinnerNutrition = graphprops.graphprops.find(data => data.meal_type === "dinner");
  const dinnerNutritionList = dinnerNutrition ? NutritionObjectToList(dinnerNutrition) : [];
  console.log(breakfastNutritionList);

  const explainfotter = (tooltipItems: { label: keyof typeof nutritionExplainTexts }[]) => {
    const nutritionExplainText = nutritionExplainTexts[tooltipItems[0].label];
    const explainText = nutritionExplainText.match(/.{1,10}/g);
    return explainText;
  }


  const options = {
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          footer: explainfotter
        }
      },
      legend: {
        position: 'bottom' as const,
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true
      },
      y: {
        max: 100,
        stacked: true,
        grid: {
          color: function (context: { tick: { value: number; }; }) {
            if (context.tick.value === 100) {
              return "red";
            }
            return "gray";
          }
        }
      }
    }
  };

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

