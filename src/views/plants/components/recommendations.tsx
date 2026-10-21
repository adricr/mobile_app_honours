import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { CareReq, CurrentCare } from "@/src/data/repositories/plant-knowledge"

type PlantRecommendationsProps = {
    plantReqs: CareReq
    currentStatus: CurrentCare
}
export default function PlantRecommendations({plantReqs, currentStatus}:PlantRecommendationsProps){

    return(
    <Card>
        <Heading size="md" >Care Recommendations</Heading>
        
    </Card>)
}