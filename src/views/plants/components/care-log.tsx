import { Text } from "@/components/ui/text"
import { Plant } from "@/src/data/repositories/plants"

type CareLogProps = {
    plant: Plant,
    onRefetch: () => void
}
export default function CareLog({plant}:CareLogProps){
    const entries = plant.care_log
    if(entries.length === 0){
        return <Text>Nothing has been logged for this plant yet</Text>
    }
    // entries are appended as they happen, so reversing shows the newest first
    return(
        <>
            {[...entries].reverse().map((entry, i) => <Text key={`${entry.created_at}-${i}`}>{entry.description}</Text>)}
        </>
    )
}
