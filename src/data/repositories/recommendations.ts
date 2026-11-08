import { db } from "../database";
import { CareReq, Position } from "./plant-knowledge";
import { CurrentCare } from "./plants";

export type Recommendation = "needs_new_position" | "needs_watering" | "needs_higher_temps" | "needs_temporary_sun" | "needs_context"| "needs_care_reqs"
export type PlantRecommendation = {
    messages: string[]
    created_on: number
}

export type Facts = {
    recommended_position: Position,
    watering_interval: number,
    hardiness: number,
    temp: number | null,
    last_watered: number
    cloud_cover: number | null, 
    position: Position,
}

export type Rule = {
    name: string,
    condition: (f:Facts)=>boolean,
    result: (f:Facts)=> Facts | Recommendation,
}


export async function updateRecommendation(id: number, care_recommendation: PlantRecommendation) : Promise<number|null> {
    return (await db.runAsync(`UPDATE plants SET care_recommendations = ? WHERE id = ?`,JSON.stringify(care_recommendation), id)).changes
}


export async function getRecommendation(id : number) : Promise<PlantRecommendation | null>{
    const row = await db.getFirstAsync<{ care_recommendations: string | null }>(
        `SELECT care_recommendations FROM plants WHERE id = ?`, id)
    return row?.care_recommendations ? JSON.parse(row.care_recommendations) : null
}



export function isRecommendation(x: Facts | Recommendation): x is Recommendation {
    return "needs_new_position" == x || "needs_watering" == x || "needs_higher_temps" == x || "needs_temporary_sun" == x
}
// Returns facts or if there's some issue a string with the problem
export function getFacts(currentStatus:CurrentCare, careRequirements:CareReq | null):Facts | string{
    // every care requirement is needed!
    if(!careRequirements || careRequirements.position == null || careRequirements.water_schedule == null || careRequirements.hardiness == null)
        return "We do not have enough information on this plant species to offer information"
    if(!currentStatus?.context)
        return {
        recommended_position: careRequirements.position,
        watering_interval: careRequirements.water_schedule,
        hardiness: careRequirements.hardiness,
        temp: null,
        last_watered: currentStatus.last_watered,
        cloud_cover: null,
        position: currentStatus.position
        }
    return {
        recommended_position: careRequirements.position,
        watering_interval: careRequirements.water_schedule,
        hardiness: careRequirements.hardiness,
        temp: currentStatus.context.temperature,
        last_watered: currentStatus.last_watered,
        cloud_cover: currentStatus.context.cloud_cover,
        position: currentStatus.position
    }           
}
