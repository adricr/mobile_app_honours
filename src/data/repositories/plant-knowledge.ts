import { db } from "../database";

export type Position = "full sun" | "partial shade" | "shade"
export type CareReq = {
    position: Position | null;
    water_schedule: number | null;
    hardiness: number | null;       // minimum temperature in °C
};

export type CurrentCare = {
    position: Position;
    last_watered: number;
};

export type CatalogueEntry = {
    id: number;
    species: string;
    common_name: string | null;
    position: string | null;
    water_schedule: number | null;
    hardiness: number | null;       // minimum temperature in °C
};

// exact match on the species name, ignoring case; null if the species isn't in the catalogue
export async function getCatalogueEntry(species: string): Promise<CatalogueEntry | null> {
    return db.getFirstAsync<CatalogueEntry>(
        'SELECT id, species, common_name, position, water_schedule, hardiness FROM plant_catalogue WHERE species = ? COLLATE NOCASE',
        species
    )
}

// adds a species with no care info yet; returns its new id. Throws if the species already exists (species is UNIQUE)
export async function createSpecies(species: string): Promise<number> {
    const result = await db.runAsync('INSERT INTO plant_catalogue (species) VALUES (?)', species)
    return result.lastInsertRowId
}

export function createCareReq(species:string) {
    
}

export async function getCareReq(species:string): Promise<CareReq | null> {

    return db.getFirstAsync('SELECT position, water_schedule, hardiness FROM plant_catalogue WHERE species LIKE ?',species)
    // const statement = await db.prepareAsync(
    // 'SELECT position, water_schedule FROM plant_catalogue WHERE species LIKE $species'
    // );
    // try {
    //     const result = await statement.executeAsync({$species: `${species}`})
    //     return result.getFirstAsync<CareReq>()
    // } finally {
    // await statement.finalizeAsync();
    // }
}

export async function getSpeciesName(speciesId: number): Promise<string | null> {
    const row = await db.getFirstAsync<{ species: string }>(
        'SELECT species FROM plant_catalogue WHERE id = ?', speciesId)
    return row?.species ?? null
}

export async function getAllCareReq(): Promise<Array<CatalogueEntry> | null > {
    return db.getAllAsync('SELECT species, position, water_schedule, hardiness FROM plant_catalogue')
}

export function updateCareReq(species:String){

}

export function deleteCareReq(species:String) {
    
}