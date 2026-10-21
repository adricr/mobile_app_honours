import { Text } from "@/components/ui/text"
import { Position } from "@/src/data/repositories/plant-knowledge"
import Ionicons from "@react-native-vector-icons/ionicons/static"
import { View } from "react-native"


type PlantPositionProps = {
    position: Position | null
}
export default function PlantPosition({position}:PlantPositionProps){
switch (position){
    case "full sun":
        return (
        <View className="items-center">
            <Ionicons size={32} color="white" name="sunny-sharp"></Ionicons>
            <Text>Full Sun</Text>
        </View> )
    case "partial shade":
        return (
        <View className="items-center">
            <Ionicons size={32} color="white" name="partly-sunny-sharp"></Ionicons>
            <Text>Partial Shade</Text>
        </View> )
    case "shade":
        return (
        <View className="items-center">
            <Ionicons size={32} color="white" name="cloud-sharp"></Ionicons>
            <Text>Shade</Text>
        </View> )
    case null:
        return(
            <View>
                <Text>We don't have information about this plant's position</Text>
            </View>
        )
    

}
}