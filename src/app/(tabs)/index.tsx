import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { getAllRecommendations, PlantRecommendationRow } from "@/src/data/repositories/recommendations";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// The regex for the watering messages
const NEEDS_WATER = /^It's been/

export default function Index() {
  const [plants, setPlants] = useState<PlantRecommendationRow[]>([])
  useFocusEffect(useCallback(()=>{
     getAllRecommendations().then((rows)=>{
        setPlants(rows.filter((row)=> row.recommendation?.messages.some((m)=> NEEDS_WATER.test(m))))
     })
  }, []))

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
      <Heading>Tasks</Heading>
      {plants.length > 0 ?
        plants.map((plant)=>(
          <Card className="" key={plant.id}>
            <Text>{plant.name}{plant.species ? ` (${plant.species})` : ""}, located in {plant.collection_name}, needs watering</Text>
          </Card>
        ))
        :
        <Card>
          <Text>No Actions to be Taken!</Text>
        </Card>
      }
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#032601",
    justifyContent: "center",
  },
    text: {
    color: '#fff',
  },
});
