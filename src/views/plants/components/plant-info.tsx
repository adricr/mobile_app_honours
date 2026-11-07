import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Plant } from "@/src/data/repositories/plants";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import { Image } from "expo-image";
import PlantPosition from "./plant-position";
import PlantRequirements from "./plant-requirements";
import PlantRecommendations from "./recommendations";

type PlantInfoProps = {
    plant: Plant,
    plantSpecies: string,
    onRefetch: () => void
}

export default function PlantInfo({plant, plantSpecies, onRefetch}:PlantInfoProps){

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
                    <Heading italic={true}>Current Status</Heading>
                    <Text>
                        Last Watered: {plant?.current_status ? new Date(plant.current_status.last_watered).toLocaleDateString() : ''}
                    </Text>
                    <PlantPosition position={plant.current_status.position} />
                </Card>
                <Card>
                    <Heading>Care for your {plantSpecies}</Heading>
                    <PlantRequirements plantReqs={plant.care_requirements} />
                    <PlantRecommendations plant={plant} onRefetch={onRefetch} />
                </Card>
                <Card>
                    <Heading>Care Log</Heading>
                    
                </Card>
        </Card>
    );
}