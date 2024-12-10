export interface graphProps {
    list1: number[];
    list2: number[];
    list3: number[];
}

export interface User {
    id: string;
    name: string;
    age: number;
    club: string;
}

export interface BodyComposition {
    year_month: Date;
    weight: number;
    muscle_mass: number;
    body_fat: number;
}

export type daytime = "breakfast" | "lunch" | "dinner";

export interface nutrition {
    daytime: daytime;
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