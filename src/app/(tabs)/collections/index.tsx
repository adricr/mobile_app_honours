import { Button, ButtonGroup } from "@/components/ui/button";
import ContentList from "@/components/ui/content-list";
import CreateModal from "@/components/ui/create-modal";
import { Collection } from "@/src/data/repositories/collections";
import { handleCollectionGetAll } from "@/src/logic/collection_system/management";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";


export default function Index() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [createCollection, setCreateCollection] = useState(false)
  const loadCollections = useCallback(() => {
      handleCollectionGetAll().then(setCollections).catch(console.error)
  }, [])

  useEffect(() => { loadCollections() }, [loadCollections])
  return(
    <View style={styles.container}>
      <CreateModal itemType="collection" modalOn={createCollection} setModalOn={setCreateCollection} onCreated={loadCollections} />
      <ContentList contentArray={collections} contentType="collection"></ContentList>
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
    text: {
    color: '#fff',
  },
});
