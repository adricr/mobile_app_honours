import { db } from "../database";

export type CareReq = {
    position: string | null;
    water_schedule: number | null;
    moisture: string | null;
};


export function createCareReq(species:string) {
    
}

export async function getCareReq(species:string): Promise<CareReq | null> {

    return db.getFirstAsync('SELECT position, water_schedule, moisture FROM plant_catalogue WHERE species LIKE ?',species)
    // const statement = await db.prepareAsync(
    // 'SELECT position, water_schedule, moisture FROM plant_catalogue WHERE species LIKE $species'
    // );
    // try {
    //     const result = await statement.executeAsync({$species: `${species}`})
    //     return result.getFirstAsync<CareReq>()
    // } finally {
    // await statement.finalizeAsync();
    // }
}

export async function getAllCareReq(): Promise<Array<CareReq> | null > {
    return db.getAllAsync('SELECT species, position, water_schedule, moisture FROM plant_catalogue')
}

export function updateCareReq(species:String){

}

export function deleteCareReq(species:String) {
    
}