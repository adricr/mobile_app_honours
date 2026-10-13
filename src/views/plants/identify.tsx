import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { loadLocalModel } from "@/src/logic/plants/id_system/id_plant";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Classifier } from "react-native-executorch";

type IdentifyViewProps = {
    uri: string
    onBack: () => void
}

// Loads the identification model while it's shown and frees it when it's removed
export default function IdentifyView({ uri, onBack }: IdentifyViewProps) {
    const [classifier, setClassifier] = useState<Classifier<string> | null>(null)

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

    return (
        <View>
            {classifier ? <Text>Model ready</Text> : <Text>Loading model…</Text>}
            <Button onPress={onBack}>
                <ButtonText>Back to normal</ButtonText>
            </Button>
        </View>
    );
}
