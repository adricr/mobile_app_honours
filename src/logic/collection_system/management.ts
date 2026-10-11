import { createCollection, getAllCollections } from "@/src/data/repositories/collections";

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