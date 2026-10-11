import { SQLiteRunResult } from "expo-sqlite";
import { db } from "../database";
import { CareReq } from "./plant-knowledge";

export type CareLog ={
    action: string;
    description: string;
    created_at: Date;
};
export type Plant = {
    id: number;
    name: string;
    species: number;
    photo_uri: string;
    care_requirements: CareReq;
    care_recommendations: CareReq;
    care_log: Array<CareLog>
    collection: number;
    created_at: string;
};

export async function createPlant(name: string, species : number, photo_uri: string | null, care_requirements: CareReq | null, care_recommendations: CareReq | null, current_status:CareReq, collection: number ) : Promise<SQLiteRunResult | null> {
    return db.runAsync(`
        INSERT INTO plants (name, species, photo_uri, care_requirements, care_recommendations, current_status, collection) VALUES (?,?,?,?,?,?,?)`
        , name, species, photo_uri,care_requirements ? JSON.stringify(care_requirements):null, care_recommendations ? JSON.stringify(care_recommendations) : null
, JSON.stringify(current_status), collection
    )
}

export async function getAllPlants(collection: number) : Promise<Array<Plant> | null> {
    return db.getAllAsync<Plant>(`SELECT id, name, species, photo_uri, care_requirements, care_recommendations, care_log, collection, created_at FROM plants WHERE collection = ? ORDER BY name`,collection)
}

export async function getPlant(id : number) : Promise<Plant | null>{
    return db.getFirstAsync(`id, name, species, photo_uri, care_requirements, care_recommendations, care_log, collection, created_at FROM plants WHERE id = ?`,id)
}

export async function deletePlant(id : number) : Promise<Plant | null> {
    return db.getFirstAsync(`DELETE FROM plants WHERE id = ? RETURNING *`,id)
}

export async function updatePlant(id : number ,name : string) : Promise<number|null> {
    return (await db.runAsync(`UPDATE plants SET name = ? WHERE id = ?`,name, id)).changes
}