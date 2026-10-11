import { CareReq, createSpecies, getAllCareReq, getCatalogueEntry } from "@/src/data/repositories/plant-knowledge";
import { createPlant, getAllPlants } from "@/src/data/repositories/plants";

export type SubmissionStatus = {
    status: boolean;
    description: string;
}

const MAX_NAME_LENGTH = 30

export type NewPlantInfo = {
    name: string;
    species: string | null;         // a catalogue species, or one typed by the user
    photo_uri: string | null;
    last_watered: number | null;    // days ago
    position: string | null;        // "full sun" | "partial shade" | "shade"
    collection: number;
}

export async function handlePlantCreation(plantInfo: NewPlantInfo): Promise<SubmissionStatus>{
    const name = plantInfo.name.trim()
    let catalogueEntry
    let creationOk
    let result = <SubmissionStatus>{
        status: false,
        description: ""
    }
    if(!plantInfo.collection)
        result.description = result.description.concat("No collection available.\n\n")
    if(!plantInfo.last_watered)
        result.description = result.description.concat("Please tell us how many days since you watered the plant. \n\n")
    if(!plantInfo.position)
        result.description = result.description.concat("Please tell us how much light your plant is receiving.\n\n")
    if(!plantInfo.species)
        result.description = result.description.concat("Please tell us what species your plant is.\n\n")
    if(result.description.length===0 && plantInfo.species){
        const current_status = <CareReq>{
            position: plantInfo.position,
            water_schedule: plantInfo.last_watered,
        }
        try {
            catalogueEntry = await getCatalogueEntry(plantInfo.species)
            const careReqs = <CareReq>{
                position: catalogueEntry?.position,
                water_schedule: catalogueEntry?.water_schedule,
            }
            if(catalogueEntry)
               creationOk = await createPlant(name, catalogueEntry.id, plantInfo.photo_uri,careReqs, null,current_status,plantInfo.collection)
            else{
                // If the species is custom
                const newSpeciesId = await createSpecies(plantInfo.species)
                creationOk = await createPlant(name, newSpeciesId, plantInfo.photo_uri,careReqs, null,current_status,plantInfo.collection)
            }
            if(creationOk){
                result.status = true
                result.description = "Plant succesfully created!"
            }

        } catch (error) {
            console.error(error)
            
        }
    }

        
    return result
    

}

export async function handlePlantGetAll(collectionId:number){
   try{
    const result = await getAllPlants(collectionId)
    return result
   } catch(e){
    console.error(e)
    return null
   }
}

export async function handlePlantCatalogueGetAll(){
   try{
    const result = await getAllCareReq()
    return result
   } catch(e){
    console.error(e)
    return null
   }
}