import { db } from "../database";
import { CareReq } from "./plant-knowledge";

export async function updateRecommendation(id: number, care_recommendations: CareReq) : Promise<number|null> {
    return (await db.runAsync(`UPDATE plants SET care_recommendations = ? WHERE id = ?`,JSON.stringify(care_recommendations), id)).changes
}

export async function getRecommendation(id : number) : Promise<CareReq | null>{
    return db.getFirstAsync(`care_recommendations FROM plants WHERE id = ?`,id)
}