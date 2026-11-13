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

export type PlantRecommendationRow = {
    id: number
    name: string
    species: string | null
    collection_name: string
    recommendation: PlantRecommendation | null
}

type RawRecRow = {
    id: number
    name: string
    species: string | null
    collection_name: string
    care_recommendations: string | null
}
export async function updateRecommendation(id: number, care_recommendation: PlantRecommendation) : Promise<number|null> {
    return (await db.runAsync(`UPDATE plants SET care_recommendations = ? WHERE id = ?`,JSON.stringify(care_recommendation), id)).changes
}


export async function getRecommendation(id : number) : Promise<PlantRecommendation | null>{
    const row = await db.getFirstAsync<{ care_recommendations: string | null }>(
        `SELECT care_recommendations FROM plants WHERE id = ?`, id)
    return row?.care_recommendations ? JSON.parse(row.care_recommendations) : null
}

function parseRecommendation(raw: string | null): PlantRecommendation | null {
    if (!raw) return null
    try {
        return JSON.parse(raw) as PlantRecommendation
    } catch {
        return null
    }
}

export async function getAllRecommendations(): Promise<PlantRecommendationRow[]>{
   const rows = await db.getAllAsync<RawRecRow>(
        `SELECT p.id, p.name, k.species, c.name AS collection_name, p.care_recommendations
        FROM plants as p
        LEFT JOIN plant_catalogue as k ON p.species = k.id
        INNER JOIN collections as c ON p.collection = c.id
        WHERE  p.care_recommendations IS NOT NULL`
    )
    return rows.map(({ care_recommendations, ...rest }) => ({
        ...rest,
        recommendation: parseRecommendation(care_recommendations),
    }))
}

export function isRecommendation(x: Facts | Recommendation): x is Recommendation {
    return "needs_new_position" == x || "needs_watering" == x || "needs_higher_temps" == x || "needs_temporary_sun" == x || "needs_context" == x || "needs_care_reqs" == x
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
