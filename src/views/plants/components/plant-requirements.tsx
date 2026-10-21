import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { CareReq } from "@/src/data/repositories/plant-knowledge"
import PlantPosition from "./plant-position"

type PlantRequirementsProps = {
    plantReqs: CareReq
}
export default function PlantRequirements({plantReqs}:PlantRequirementsProps){
    return(
        <Card className="border-0" >
            <Heading size="md" >Care Requirements</Heading>
            <PlantPosition position={plantReqs.position} />
            {plantReqs.water_schedule ? <Text className="self-center">Water every {plantReqs.water_schedule} days</Text> : <Text> We don't have information about this plant's watering schedule</Text>}
            {plantReqs.hardiness != null ? <Text className="self-center">Keep above {plantReqs.hardiness} °C</Text> : <Text> We don't have information about this plant's hardiness</Text>}
        </Card>
    );
}