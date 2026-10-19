import { createCollection, deleteCollection, getAllCollections, getCollection } from "@/src/data/repositories/collections";
import { DeleteOutput, handlePlantGetAll } from "../plants/management";

export type SubmissionStatus = {
    status: boolean;
    description: string;
}

const MAX_NAME_LENGTH = 30

export async function handleCollectionCreation(rawName:string): Promise<SubmissionStatus>{
    const name = rawName.trim()

    if(!name)
        return {status: false, description: "Please name your collection"}

    if (name.length > MAX_NAME_LENGTH)
        return { status: false, description: `Names can be at most ${MAX_NAME_LENGTH} characters` }
    try {
        await createCollection(name)
        return { status: true, description: "" }
    } catch (e) {
        console.error(e)
        return { status: false, description: "Couldn't create the collection, please try again" }
    }

}

export async function handleCollectionGetAll(){
   try{
    const result = await getAllCollections()
    return result
   } catch(e){
    console.error(e)
    return null
   }
}

export async function handleCollectionGet(id:number){
   try{
    const result = await getCollection(id)
    return result
   } catch(e){
    console.error(e)
    return null
   }
}

export async function handleCollectionDeletion(id:number):Promise<DeleteOutput> {
    try {
        const allPlants = await handlePlantGetAll(id)
        
        if(allPlants && allPlants?.length>0){
            return {
                result: false,
                status: "There's plants inside of this collection!\n Delete them first."
            }
        }else{
            const result = await deleteCollection(id)
            if(result){
                return {result: true,
                        status: `${result.name} deleted succesfully.`
                }
            }else{
                return{
                    result:false,
                    status: `No Collection with id ${id}`
                }
            }}
    } catch (error) {
        return {
            result: false,
            status: "Something went wrong"
        }
    }  
}