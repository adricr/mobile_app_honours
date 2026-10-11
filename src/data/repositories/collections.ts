import { SQLiteRunResult } from "expo-sqlite";
import { db } from "../database";

export type Collection = {
    id: number;
    name: string;
    created_at: string;
};

export async function createCollection(name: string) : Promise<SQLiteRunResult | null> {
    return db.runAsync(`
        INSERT INTO collections (name) VALUES (?)`
        , name
    )
}

export async function getAllCollections() : Promise<Collection[]> {
    return db.getAllAsync<Collection>(`SELECT id, name, created_at FROM collections ORDER BY name`)
}

export async function getCollection(id : number) : Promise<Collection | null>{
    return db.getFirstAsync(`SELECT id, name, created_at FROM collections WHERE id = ?`,id)
}

export async function deleteCollection(id : number) : Promise<Collection | null> {
    // Need to check what happens when theres plants inside them
    return db.getFirstAsync(`DELETE FROM collections WHERE id = ? RETURNING *`,id)
}

export async function updateCollection(id : number ,name : string) : Promise<number|null> {
    return (await db.runAsync(`UPDATE collections SET name = ? WHERE id = ?`,name, id)).changes
}