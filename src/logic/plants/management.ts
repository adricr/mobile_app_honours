import { CareReq, createSpecies, getAllCareReq, getCatalogueEntry, getSpeciesName } from "@/src/data/repositories/plant-knowledge";
import { createPlant, CurrentCare, deletePlant, getAllPlants, getPlant, PlantContext } from "@/src/data/repositories/plants";
import { Coordinates } from "../location/location_system";

export type SubmissionStatus = {
    status: boolean;
    description: string;
}
export type DeleteOutput ={
    result: boolean
    status: string
}

const MAX_NAME_LENGTH = 30

export type NewPlantInfo = {
    name: string;
    species: string | null;         // a catalogue species, or one typed by the user
    photo_uri: string | null;
    last_watered: number | null;    // days ago
    location: Coordinates | null;
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
    if(plantInfo.last_watered === null)
        result.description = result.description.concat("Please tell us how many days since you watered the plant. \n\n")
    if(!plantInfo.position)
        result.description = result.description.concat("Please tell us how much light your plant is receiving.\n\n")
    if(!plantInfo.species)
        result.description = result.description.concat("Please tell us what species your plant is.\n\n")
    if(result.description.length===0 && plantInfo.species && plantInfo.last_watered!=null){
        try {
            let current_status = <CurrentCare>{
            position: plantInfo.position,
            last_watered: (Date.now() - (plantInfo.last_watered*24*60*60*1000)),
            context: null
            }
            let context: PlantContext | null = null
            if(plantInfo.location){
               context = await handleGetPlantContext(plantInfo.location.latitude,plantInfo.location.longitude)
               if(context){
                current_status = {...current_status, context: context}
               }
            }
            catalogueEntry = await getCatalogueEntry(plantInfo.species)
            const careReqs = <CareReq>{
                position: catalogueEntry?.position,
                water_schedule: catalogueEntry?.water_schedule,
                hardiness: catalogueEntry?.hardiness,
            }
            if(catalogueEntry)
               creationOk = await createPlant(name, catalogueEntry.id, plantInfo.photo_uri,careReqs, null,current_status, plantInfo.location, plantInfo.collection)
            else{
                // If the species is custom
                const newSpeciesId = await createSpecies(plantInfo.species)
                creationOk = await createPlant(name, newSpeciesId, plantInfo.photo_uri,careReqs, null,current_status, plantInfo.location, plantInfo.collection)
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

export async function handlePlantGet(plantId:number){
   try{
    const result = await getPlant(plantId)
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

export async function handlePlantDeletion(id:number):Promise<DeleteOutput> {

    try {
        const result = await deletePlant(id)
        if(result){
            return {result: true,
                    status: `${result.name ? result.name : result.species} deleted succesfully.`
            }
        }else{
            return{
                result:false,
                status: `No plant with id ${id}`
            }
        }
    } catch (error) {
        return {
            result: false,
            status: "Something went wrong!"
        }
    }
}

export async function handleGetPlantSpeciesName(speciesId: number): Promise<string | null> {
    try {
        return await getSpeciesName(speciesId)
    } catch (e) {
        console.error(e)
        return null
    }
}

export async function handleGetPlantContext(latitude: number, longitude:number):Promise<PlantContext | null>{
const weatherAPIurl = "https://api.open-meteo.com/v1/forecast?"
const params = {
    latitude: `latitude=${latitude}`,
    longitude: `longitude=${longitude}`,
    rest: `apparent_temperature,cloud_cover,relative_humidity_2m`
}
const fullUrl = `${weatherAPIurl}${params.latitude}&${params.longitude}&current=${params.rest}`
try {
    console.log("llamadita a api")
    const res = await fetch(fullUrl)
    if(!res.ok)
        throw new Error(`Response status: ${res.status}`);
    const context = await res.json()
    return{
    temperature: context.current.apparent_temperature ,
    humidity: context.current.relative_humidity_2m,
    cloud_cover: context.current.cloud_cover,
    gathered_on: Date.now()
}

} catch (error:any) {
    console.error(error.message)
    return null
}
// Response from the api!
// {
//   "current": {
//     "apparent_temperature": 19.9,
//     "cloud_cover": 0,
//     "interval": 900,
//     "relative_humidity_2m": 55,
//     "time": "2026-10-21T16:45"
//   },
//   "current_units": {
//     "apparent_temperature": "°C",
//     "cloud_cover": "%",
//     "interval": "seconds",
//     "relative_humidity_2m": "%",
//     "time": "iso8601"
//   },
//   "elevation": 6,
//   "generationtime_ms": 0.09226799011230469,
//   "latitude": 36.58447,
//   "longitude": -6.208122,
//   "timezone": "GMT",
//   "timezone_abbreviation": "GMT",
//   "utc_offset_seconds": 0
// }
}