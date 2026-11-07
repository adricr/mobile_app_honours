import { Plant } from "@/src/data/repositories/plants";
import { handleGetPlantSpeciesName, handlePlantGet } from "@/src/logic/plants/management";
import PlantInfo from "@/src/views/plants/components/plant-info";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
export default function PlantScreen(){
    const { id } = useLocalSearchParams<{ id: string }>()
    const [plant, setPlant] = useState<Plant | null>(null)
    const [plantSpecies,setPlantSpecies] = useState<string | null>(null)
    const plantId = Number(id)
    // we need to trigger re-reads for when things change
    async function refetchPlant(){
        const res = await handlePlantGet(plantId)
        if (res){
            setPlant(res)
        }
        return res
    }
    useEffect(()=>{
        handlePlantGet(plantId).then((res)=>{
            if(res){
                setPlant(res)
                if(res.species)
                    handleGetPlantSpeciesName(res.species).then(sp=>setPlantSpecies(sp))
            }
        })
    },[plantId])
    return (
        <>
            <Stack.Header style={{backgroundColor: '#1ea11c',
                color: '#e3e6e3'
            }} />
            <Stack.Screen options={{ title: plant?.name }} />
            <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
                {plant && plantSpecies && <PlantInfo plant={plant} plantSpecies={plantSpecies} onRefetch={refetchPlant}></PlantInfo>}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,                      // the scroll view fills the screen
        backgroundColor: "#032601",
    },
    content: {
        alignItems: "center",         // layout of the content inside
        padding: 16,
    },
})
