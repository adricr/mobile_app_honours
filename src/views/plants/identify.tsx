import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { inferImage, loadLocalModel } from "@/src/logic/plants/id_system/id_plant";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Classification, Classifier } from "react-native-executorch";

type IdentifyViewProps = {
    uri: string
    onBack: () => void
    setSpecies: (species: string | null) => void
}

// Loads the identification model while it's shown and frees it when it's removed
export default function IdentifyView({ uri, onBack, setSpecies}: IdentifyViewProps) {
    const [classifier, setClassifier] = useState<Classifier<string> | null>(null)
    const [identification, setIdentification] = useState<Classification<string>[] | null>(null)
    useEffect(() => {
        let loaded: Classifier<string> | null = null
        let cancelled = false

        loadLocalModel()
            .then(model => {
                // the view was closed while the model was loading: free it straight away
                if (cancelled) {
                    model.dispose()
                    return
                }
                loaded = model
                setClassifier(model)
            })
            .catch(console.error)

        return () => {
            cancelled = true
            loaded?.dispose()
        }
    }, [])

    useEffect(()=>{
        if(classifier){
            
             inferImage(uri, classifier).then(result=> setIdentification(result)).catch(console.error)
        }
           
    },[classifier,uri])
    return (
        <View className="flex flex-col h-fit">
            {identification ? (
                            identification[0].confidence >= 0.87 ?
            (
                <Card className="flex flex-col mb-5 ">
                    <Text className="mx-5">I think it is a {identification[0].label} with {Math.fround(identification[0].confidence * 100).toFixed(2)}% confidence</Text>
                    <ButtonGroup>
                        <Button onPress={()=>{
                            setSpecies(identification[0].label)
                            onBack()
                            }}>
                            <ButtonText>I think so too!</ButtonText>
                        </Button>
                        <Button onPress={onBack}>
                            <ButtonText>Not sure about that!</ButtonText>
                        </Button>
                    </ButtonGroup>
                </Card>
                
            ):(
                identification && identification[0].confidence >= 0.75 ? (
                    <Card className="flex flex-col mb-5 ">
                        <Text className="mx-5">I think it is a {identification[0].label} with {Math.fround(identification[0].confidence * 100).toFixed(2)}% confidence, so please review that this might be the actual species before proceeding.</Text>
                        <ButtonGroup>
                        <Button onPress={()=>{
                            setSpecies(identification[0].label)
                            onBack()}}>
                            <ButtonText>I think so too!</ButtonText>
                        </Button>
                        <Button onPress={onBack}>
                            <ButtonText>Not sure about that!</ButtonText>
                        </Button>
                    </ButtonGroup>
                    </Card>
                ):(               
                     <Card className="flex flex-col mb-5 ">
                        <Text size="xl" className="mx-5">I'm not sure about what's in this picture, please try again, or input your species manually.</Text>
                        <ButtonGroup>
                            <Button onPress={onBack}>
                                <ButtonText>Oh ok!</ButtonText>
                            </Button>
                        </ButtonGroup>
                    </Card>
                )
            )
            ) : (<View><Text>Wait while we identify your plant</Text></View>)}
        </View>
    );
}
