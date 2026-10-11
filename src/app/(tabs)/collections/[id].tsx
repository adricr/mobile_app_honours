import { Button, ButtonGroup } from "@/components/ui/button";
import ContentList from "@/components/ui/content-list";
import CreateModal from "@/components/ui/create-modal";
import { Collection } from "@/src/data/repositories/collections";
import { Plant } from "@/src/data/repositories/plants";
import { handleCollectionGet } from "@/src/logic/collection_system/management";
import { handlePlantGetAll } from "@/src/logic/plants/management";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function CollectionScreen() {
  // route params always arrive as strings
  const { id } = useLocalSearchParams<{ id: string }>()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [plants, setPlants] = useState<Plant[]>([])
  const [createCollection, setCreateCollection] = useState(false)

  const loadCollections = useCallback(() => {
    const collectionId = Number(id)
    handleCollectionGet(collectionId).then(setCollection).catch(console.error)
    handlePlantGetAll(collectionId).then(rows => setPlants(rows ?? [])).catch(console.error)
  }, [])

  useEffect(() => { loadCollections() }, [loadCollections])
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: collection?.name ?? 'Collection' }} />
      <CreateModal itemType="plant" modalOn={createCollection} setModalOn={setCreateCollection} onCreated={loadCollections} collectionId={Number(id)} />
      <ContentList contentArray={plants} contentType="plant" />
      <ButtonGroup className="m-5 size-max">
        <Button onPressOut={()=>{setCreateCollection(!createCollection)}} size="lg" className="rounded-full p-3.5">
          <Ionicons size={32} name="add-outline"></Ionicons>
        </Button>
      </ButtonGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#032601",
    justifyContent: "center",
  },
});
