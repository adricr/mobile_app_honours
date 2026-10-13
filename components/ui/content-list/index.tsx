import { Collection } from "@/data/repositories/collections";
import { Plant } from "@/data/repositories/plants";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, ButtonGroup, ButtonText } from "../button";
import { Card } from "../card";
import { Heading } from "../heading";
import { Text } from "../text";
type ContentType =  "collection" | 'plant'
type ContentListType = {
    contentArray : Collection[] | Plant[] | null,
    contentType : ContentType
}
export default function ContentList({contentArray, contentType}:ContentListType){
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
                        <Button variant="destructive" className="basis-1/4"><Ionicons size={16} name="trash-sharp"></Ionicons></Button>
                    </ButtonGroup>
                );

            })

        } else{
            listItems = contentArray.map( item => {
                return(
                    <ButtonGroup className="flex flex-row justify-center" key={item.id}>
                        <Button
                            variant="ghost"
                            className="basis-3/4 justify-start bg-accent"
                            onPress={() => router.push({ pathname: '/collections/[id]', params: { id: String(item.id) } })}
                        >
                            <ButtonText>{item.species}</ButtonText>
                            <ButtonText>{item.name}</ButtonText>
                        </Button>
                        <Button variant="destructive" className="basis-1/4"><Ionicons size={16} name="trash-sharp"></Ionicons></Button>
                    </ButtonGroup>
                );
            })
        }
    }
    return(
    <View style={styles.container} className="size-full">
        {contentArray && contentArray.length > 0 ?
        (
            <Card className="w-full">
                <Heading className="">
                    {heading}
                </Heading>
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