import { db } from "../database";

export type CareReq = {
    position: string | null;
    water_schedule: number | null;
};

export type CatalogueEntry = {
    id: number;
    species: string;
    common_name: string | null;
    position: string | null;
    water_schedule: number | null;
};

// exact match on the species name, ignoring case; null if the species isn't in the catalogue
export async function getCatalogueEntry(species: string): Promise<CatalogueEntry | null> {
    return db.getFirstAsync<CatalogueEntry>(
        'SELECT id, species, common_name, position, water_schedule FROM plant_catalogue WHERE species = ? COLLATE NOCASE',
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

    return db.getFirstAsync('SELECT position, water_schedule FROM plant_catalogue WHERE species LIKE ?',species)
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

export async function getAllCareReq(): Promise<Array<CareReq> | null > {
    return db.getAllAsync('SELECT species, position, water_schedule FROM plant_catalogue')
}

export function updateCareReq(species:String){

}

export function deleteCareReq(species:String) {
    
}