import { Collection } from "@/src/data/repositories/collections";
import { Plant } from "@/src/data/repositories/plants";
import { handleCollectionDeletion } from "@/src/logic/collection_system/management";
import { handlePlantDeletion } from "@/src/logic/plants/management";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "../alert-dialog";
import { Button, ButtonGroup, ButtonText } from "../button";
import { Card } from "../card";
import { Heading } from "../heading";
import { Text } from "../text";
type ContentType =  "collection" | 'plant'
type ContentListType = {
    refreshCollections: ()=> void
    contentArray : Collection[] | Plant[] | null,
    contentType : ContentType
}
type DeleteType = {
    itemType: ContentType | null
    itemId: number | null
}
export default function ContentList({refreshCollections, contentArray, contentType}:ContentListType){
    const [showAlertDialog,setShowAlertDialog] = useState(false)
    const [deleteType, setDeletetype] = useState<DeleteType>({
        itemType: null,
        itemId: null
    })
    const [deleteError, setDeleteError] = useState<string | null>(null)
    let listItems:any;
    const heading = contentType === 'collection' ? 'Collections' : 'Plants'
    if (contentArray){
        if (contentType === 'collection'){
            listItems = contentArray.map( item => {
                return(
                    <ButtonGroup className="flex flex-row justify-center" key={item.id}>
                        <Button
                            variant="ghost"
                            className="basis-3/4 justify-start bg-accent"
                            onPress={() => router.push({ pathname: '/collections/[id]', params: { id: String(item.id) } })}
                        >
                            <ButtonText>{item.name}</ButtonText>
                        </Button>
                        <Button variant="destructive" className="basis-1/4" onPress={()=>{
                            setDeletetype({
                                itemType: contentType,
                                itemId: item.id
                            })
                            setShowAlertDialog(true)
                            }}>
                            <Ionicons size={16} name="trash-sharp"></Ionicons>
                        </Button>
                    </ButtonGroup>
                );

            })

        } else if(contentType === 'plant'){
            listItems = contentArray.map( item => {
                return(
                    <ButtonGroup className="flex flex-row justify-center" key={item.id}>
                        <Button
                            variant="ghost"
                            className="basis-3/4 justify-start bg-accent"
                            onPress={() => router.push({ pathname: '/plant/[id]', params: { id: String(item.id) } })}
                        >
                            
                            <ButtonText>{item.name? item.name : "Nameless Plant" }</ButtonText>
                        </Button>
                        <Button onPress={()=>{
                            setDeletetype({
                                itemType: contentType,
                                itemId: item.id
                            })
                            setShowAlertDialog(true)
                        }} variant="destructive" className="basis-1/4">
                            <Ionicons size={16} name="trash-sharp"></Ionicons>
                        </Button>
                    </ButtonGroup>
                );
            })
        }
    }
    
    const handleDeletion = async () => {
        const { itemType, itemId } = deleteType
        if (itemType === null || itemId === null) return      // nothing selected

        const outcome = itemType === 'collection'
            ? await handleCollectionDeletion(itemId)
            : await handlePlantDeletion(itemId)

        if (outcome.result) {
            refreshCollections()      // reload the list so the item disappears
            handleClose()
        } else {
            setDeleteError(outcome.status)   // e.g. "Something went wrong!" — keep the dialog open and show why
        }
    }
    const handleClose = () => {
        setDeletetype({ itemType: null, itemId: null })
        setDeleteError(null)
        setShowAlertDialog(false)
    }
    return(
    <ScrollView style={styles.container} contentContainerStyle={styles.content} className="size-full">
        {contentArray && contentArray.length > 0 ?
        (
            <Card className="w-full">
                <Heading className="">
                    {heading}
                </Heading>
                <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
                    <AlertDialogBackdrop />
                    <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading className="text-foreground font-semibold text-lg">
                        Are you sure you want to delete this {`${deleteType.itemType}`}?
                        </Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody className="mt-3 mb-4">
                        <Text className="text-sm text-muted-foreground">
                        Deleting the {`${deleteType.itemType}`} will remove it permanently and cannot be undone.
                        Please confirm if you want to proceed.
                        </Text>
                        {deleteError && <Text className="text-destructive mt-2">{deleteError}</Text>}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button variant="outline" onPress={handleClose}>
                        <ButtonText>Cancel</ButtonText>
                        </Button>
                        <Button onPress={handleDeletion}>
                        <ButtonText>Delete</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {listItems}
            </Card>
        ):(
            <Card className="w-full" >
                <Heading>
                    {heading}
                </Heading>
                <Text>{`There's no ${heading.toLowerCase()}!`}</Text>
                <Text bold={true} underline={true} size="xl">Please add them using the button below</Text>
            </Card>
        )}
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#032601",
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
    text: {
    color: '#fff',
  },
});