import { Button, ButtonText } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Plant, PlantContext, updatePlantContext } from "@/src/data/repositories/plants"
import { Coordinates, getLocation, isLocationAllowed } from "@/src/logic/location/location_system"
import { handleGetPlantContext } from "@/src/logic/plants/management"
import { assignRecommendations } from "@/src/logic/recommendation_system/recommender"
import * as Network from 'expo-network'
import { useEffect, useState } from "react"

type PlantRecommendationsProps = {
    plant: Plant,
    onRefetch: () => void
}
type handleContextFetchType = {
    context: PlantContext | null,
    errorMessage : string
}
const FIVE_HOURS = 5 * 60 * 60 * 1000
export default function PlantRecommendations({plant, onRefetch}:PlantRecommendationsProps){
    const [locationAllowed, setLocationAllowed] = useState(false)
    const networkState = Network.useNetworkState();
    useEffect(()=>{
        isLocationAllowed().then(res=>setLocationAllowed(res))
    },[locationAllowed])
    useEffect(()=>{
        if(networkState.isInternetReachable === undefined)
            return
        handleGetRecommendations()
    },[plant.id, plant.current_status?.last_watered, plant.current_status?.position, plant.current_status?.context?.gathered_on])
    const [loading, setLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")

    // gets fresh context if the stored one is old, evaluates the rules and refetches the plant so the new messages show
    async function handleGetRecommendations(){
        if(loading) return
        setLoading(true)
        setStatusMessage("")
        try{
            let current = plant
            const gatheredOn = plant.current_status?.context?.gathered_on
            const contextIsFresh = gatheredOn != null && Date.now() - gatheredOn < FIVE_HOURS
            if(!contextIsFresh){
                if(!networkState.isInternetReachable && plant.current_status.last_watered && plant.current_status.position){
                    const res = await assignRecommendations(current)
                    if(!res.ok)
                        setStatusMessage(res.message)
                    else{
                        onRefetch()
                    }
                    return
                }
                const fetched = await handleContextFetch(plant.location?.latitude, plant.location?.longitude)
                if(!fetched.context){
                    setStatusMessage(fetched.errorMessage)
                    return
                }
                const updatedStatus = await updatePlantContext(plant.id, fetched.context)
                if(!updatedStatus){
                    setStatusMessage("The new context could not be saved")
                    return
                }
                // evaluate against the new context without waiting for the refetch
                current = {...plant, current_status: updatedStatus}
            }
            const res = await assignRecommendations(current)
            if(!res.ok){
                setStatusMessage(res.message)
            }
            // refetch if anything was written, so the new context and recommendations show up
            if(res.ok || current !== plant){
                onRefetch()
            }
        }catch(e){
            console.error(e)
            setStatusMessage("Something went wrong getting recommendations, please try again")
        }finally{
            setLoading(false)
        }
    }

    const messages = plant.care_recommendations?.messages ?? []
    const recommendations = messages.length > 0
        ? messages.map((rec, i) => <Text key={i}>{rec}</Text>)
        : <Text>No recommendations</Text>
    const messagesGatheredOn = messages.length > 0
    ? 
    <Text>
        Recommendations last updated on: {new Date(plant.care_recommendations.created_on).toLocaleString()}
    </Text>
    :
    <></>
    return(
    <Card className="border-0">
        <Heading size="md" >Care Recommendations</Heading>
            {recommendations}
            {messagesGatheredOn}
        {statusMessage !== "" && <Text className="text-red-600">{statusMessage}</Text>}
        <Button onPress={handleGetRecommendations} isDisabled={loading}>
            <ButtonText>
                {loading ? "Working..." : "Get me some recommendations!"}
            </ButtonText>
        </Button>
    </Card>)

        async function handleContextFetch(latitude: number | undefined, longitude: number| undefined): Promise<handleContextFetchType>{
            // fetch and update a plant's context
            let location:Coordinates | null = null;
            let context: PlantContext| null = null;
            if(typeof latitude == "undefined" || typeof longitude == "undefined"){
                location = await getLocation()
                if(location){
                    context = await handleGetPlantContext(location.latitude,location.longitude)
                    if(context){
                        return {
                            context: context,
                            errorMessage: ""
                        }
                    }
                    return{
                        context: null,
                        errorMessage: "Something went wrong fetching context, could not get device's location"
                    }
                }
            }else{
                context = await handleGetPlantContext(latitude, longitude)
                if(context){
                        return {
                            context: context,
                            errorMessage: ""
                        }
                    }
                    return{
                        context: null,
                        errorMessage: "Something went wrong fetching context, please try again"
                    }
            }
        return{
            context: null,
            errorMessage: "Something went wrong fetching context, please try again"
        }    
        }

// plantCurrentCare.context && (plantCurrentCare.context.gathered_on - (Date.now()-5*60*60*1000)>=0

}