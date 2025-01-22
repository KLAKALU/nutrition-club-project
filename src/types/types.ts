export interface NutritionGraphProps {
    graphprops: Nutrition[];
}

export interface PlayerProfile {
    id: string;
    first_name: string;
    last_name: string;
    age: number;
    club: string;
    non_training_load?: number;
    training_load?: number;
}

export interface BodyComposition {
    year_month: Date;
    weight: number;
    muscle_mass: number;
    body_fat: number;
}

type MealType = "breakfast" | "lunch" | "dinner";

export interface Nutrition {
    is_training_day?: boolean;
    meal_type?: MealType;
    energy: number;
    protein: number;
    fat: number;
    carbohydrate: number;
    calcium: number;
    iron: number;
    zinc: number;
    vitaminA: number;
    vitaminD: number;
    vitaminE: number;
    vitaminK: number;
    vitaminB1: number;
    vitaminB2: number;
    vitaminC: number;
}

export interface Comment {
    comment: string;
    date: Date;
    player_id: string;
}