import { Coordinates } from "@/src/logic/location/location_system";
import { SQLiteRunResult } from "expo-sqlite";
import { db } from "../database";
import { CareReq, Position } from "./plant-knowledge";
import { PlantRecommendation } from "./recommendations";

export type Care = "water" | "pruning" | "other"

export type CareLog ={
    action: Care;
    description: string;
    created_at: number;
};

export type CurrentCare = {
    position: Position;
    last_watered: number;
    context: PlantContext | null
};
export type Plant = {
    id: number;
    name: string;
    species: number;
    photo_uri: string;
    care_requirements: CareReq;
    care_recommendations: PlantRecommendation;
    current_status: CurrentCare;
    location: Coordinates | null;
    care_log: Array<CareLog>;
    collection: number;
    created_at: string;
};

export type PlantContext = {
    temperature: number,
    humidity: number,
    cloud_cover: number,
    gathered_on : number
}
export async function createPlant(name: string, species : number, photo_uri: string | null, care_requirements: CareReq | null, care_recommendations: PlantRecommendation | null, current_status:CurrentCare, location: Coordinates|null, collection: number ) : Promise<SQLiteRunResult | null> {
    return db.runAsync(`
        INSERT INTO plants (name, species, photo_uri, care_requirements, care_recommendations, current_status, location, collection, care_log) VALUES (?,?,?,?,?,?,?,?,?)`
        , name, species, photo_uri,care_requirements ? JSON.stringify(care_requirements):null, care_recommendations ? JSON.stringify(care_recommendations) : null
, current_status? JSON.stringify(current_status):null, location?JSON.stringify(location):null, collection, current_status ?
JSON.stringify([{
    action: "water",
    description: `First watering registered on ${new Date(current_status.last_watered).toLocaleDateString()}`,
    created_at: current_status.last_watered
    }]) : JSON.stringify([])
)
}

export async function getAllPlants(collection: number) : Promise<Array<Plant> | null> {
    return db.getAllAsync<Plant>(`SELECT id, name, species, photo_uri, care_requirements, care_recommendations, care_log, collection, created_at FROM plants WHERE collection = ? ORDER BY name`,collection)
}

export async function getPlant(id : number) : Promise<Plant | null>{
    const plant = await db.getFirstAsync(`SELECT id, name, species, photo_uri, care_requirements, care_recommendations, current_status, care_log, location,  collection, created_at FROM plants WHERE id = ?`,id)
    const result = parsePlant(plant)
    return result
}


export async function getPlantCurrentStatus(id: number): Promise<CurrentCare | null> {
    const row = await db.getFirstAsync<{ current_status: string | null }>(
        `SELECT current_status FROM plants WHERE id = ?`, id)
    return row?.current_status ? JSON.parse(row.current_status) : null
}

export async function getPlantLastWatered(id: number): Promise<number | null> {
    const status = await getPlantCurrentStatus(id)
    return status?.last_watered ?? null
}

export async function getCareLog(id: number): Promise<CareLog[] | null> {
    const row = await db.getFirstAsync<{ care_log: string | null }>(
        `SELECT care_log FROM plants WHERE id = ?`, id)
    if (!row) {
        return null
    }
    return row.care_log ? JSON.parse(row.care_log) : []
}


export async function updatePlantCareLog(id: number, careLog: CareLog): Promise<number | null> {
    const careLogArray = await getCareLog(id)
    if (!careLogArray) {
        return null
    }
    careLogArray.push(careLog)
    return (await db.runAsync(`UPDATE plants SET care_log = ? WHERE id = ?`, JSON.stringify(careLogArray), id)).changes
}


// sets current_status.last_watered (now, unless wateredOn is given); returns the number of rows changed, or null if the plant has no status stored
export async function waterPlant(id: number, wateredOn: number = Date.now()): Promise<number | null> {
    const current = await getPlantCurrentStatus(id)
    if (!current) {
        return null
    }
    const updated: CurrentCare = { ...current, last_watered: wateredOn }
    return (await db.runAsync(`UPDATE plants SET current_status = ? WHERE id = ?`, JSON.stringify(updated), id)).changes
}

// replaces the plant's stored current_status; returns the number of rows changed (0 if the plant doesn't exist)
export async function updatePlantCurrentStatus(id: number, currentCare: CurrentCare): Promise<number> {
    return (await db.runAsync(`UPDATE plants SET current_status = ? WHERE id = ?`, JSON.stringify(currentCare), id)).changes
}

export async function updatePlantContext(id: number, context: PlantContext): Promise<CurrentCare | null> {
    const current = await getPlantCurrentStatus(id)
    if (!current) {
        return null
    }
    const updated: CurrentCare = { ...current, context }
    await updatePlantCurrentStatus(id, updated)
    return updated
}


export async function deletePlant(id : number) : Promise<Plant | null> {
    return db.getFirstAsync(`DELETE FROM plants WHERE id = ? RETURNING *`,id)
}

export async function updatePlant(id : number ,name : string) : Promise<number|null> {
    return (await db.runAsync(`UPDATE plants SET name = ? WHERE id = ?`,name, id)).changes
}

function parsePlant(row:any):Plant{
return {
    ...row,
    care_requirements: row.care_requirements ? JSON.parse(row.care_requirements) : null,
    care_recommendations: row.care_recommendations ? JSON.parse(row.care_recommendations) : null,
    current_status: row.current_status ? JSON.parse(row.current_status) : null,
    location: row.location ? JSON.parse(row.location) : null,
    care_log: row.care_log ? JSON.parse(row.care_log) : [],
}
}