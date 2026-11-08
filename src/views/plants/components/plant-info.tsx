import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Plant } from "@/src/data/repositories/plants";
import { handlePlantWatering } from "@/src/logic/plants/management";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import { Image } from "expo-image";
import { useState } from "react";
import CareLog from "./care-log";
import PlantPosition from "./plant-position";
import PlantRequirements from "./plant-requirements";
import PlantRecommendations from "./recommendations";

type PlantInfoProps = {
    plant: Plant,
    plantSpecies: string,
    onRefetch: () => void
}

export default function PlantInfo({plant, plantSpecies, onRefetch}:PlantInfoProps){
    const [wateringMessage, setWateringMessage] = useState("")
    return(
        <Card className="w-full flex">
                <Card>
                    {plant?.photo_uri ? <Image className="rounded-md border-4 p-2 self-center" source={plant.photo_uri}></Image> : <Ionicons className="rounded-md border-4 p-2 self-center" color={"gray"} size={128} name="leaf-sharp"></Ionicons> }
                </Card>
                <Card>
                    <Heading size="2xl">{plant.name}</Heading>
                    <Heading  className="text-green-100" italic={true} size="xl">{plantSpecies}</Heading>
                </Card>
                <Card>
                    <Heading italic={true}>Current Status:</Heading>
                    <PlantPosition position={plant.current_status.position} />
                    <Text className="text-center">
                        Last Watered: {plant?.current_status ? new Date(plant.current_status.last_watered).toLocaleDateString() : ''}
                    </Text>
                    {plant?.current_status.context?.temperature ? <Text className="text-center"><Text>Temperature outside: {plant?.current_status.context?.temperature}°C</Text></Text> : <></>}
                    <Button onPress={()=>{
                        handlePlantWatering(plant.id).then(res=>{
                            if(res.status){
                                onRefetch()
                                setWateringMessage("Watering Recorded correctly!")
                                setTimeout(()=>{setWateringMessage("")},5000)
                            }else{
                                setWateringMessage("Something went wrong with watering")
                            }
                        }).catch(()=>{
                            setWateringMessage("Something went wrong with watering")
                        })
                    }}>
                        {plant.name ? <ButtonText>I just watered {plant.name}</ButtonText>:<ButtonText>I just watered {plantSpecies}</ButtonText> }
                    </Button>
                    {wateringMessage && <Text className="">{wateringMessage}</Text>}
                </Card>
                <Card>
                    <Heading>Care for your {plantSpecies}</Heading>
                    <PlantRequirements plantReqs={plant.care_requirements} />
                    <PlantRecommendations plant={plant} onRefetch={onRefetch} />
                </Card>
                <Card>
                    <Heading>Care Log</Heading>
                    <CareLog plant={plant} onRefetch={onRefetch} />
                </Card>
        </Card>
    );
}