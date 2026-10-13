import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { CatalogueEntry } from "@/src/data/repositories/plant-knowledge";
import { handlePlantCatalogueGetAll, handlePlantCreation, NewPlantInfo } from "@/src/logic/plants/management";
import { usePlantDraft } from "@/src/logic/plants/plant-draft-context";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import CatalogueSelector from "./catalogue-selector";
type AddPlantProps ={
    collectionId: number
    setSubmitted: (submitted: boolean) => void
    onCreated: () => void
    setModalOn: (modalOn: boolean)=> void
};
const POSITIONS = ["full sun", "partial shade", "shade"]
// pages: 0 species, 1 name, 2 last watered, 3 position, 4 summary + submit
const LAST_PAGE = 4

function emptyPlantInfo(collectionId: number): NewPlantInfo {
    return {
        name: "",
        species: null,
        photo_uri: null,
        last_watered: null,
        position: null,
        collection: collectionId,
    }
}

export default function AddPlant({collectionId, setSubmitted, onCreated, setModalOn}:AddPlantProps){
    const [isInvalid, setisInvalid] = useState(false);
    const [errorText,setErrorText] = useState("")
    const [plantCatalogue, setPlantCatalogue] = useState<CatalogueEntry[] | null>([])
    // what's picked in the dropdown; the species itself is kept in plantInfoToSend
    const plantDraft = usePlantDraft()
    const [newPlantSpeciesName, setNewPlantSpeciesName] = useState<string | null>(plantDraft.identifiedSpecies)
    const [identifiedWithCamera,setIdentifiedWithCamera] = useState<boolean>(false)
    const [formPage, setFormPage] = useState<number>(0)
    const [plantInfoToSend, setPlantInfoToSend] = useState<NewPlantInfo>(
    plantDraft.draft
        ? { ...plantDraft.draft, photo_uri: plantDraft.photoUri }
        : emptyPlantInfo(collectionId)
    )
    
    let currentPage: React.ReactNode
    useEffect(()=>{
        handlePlantCatalogueGetAll().then(setPlantCatalogue).catch(console.error)
    },[])

    function nextPage() {
        // a species picked from the dropdown is copied in when leaving the first page; a typed one is already saved
        if (formPage === 0 && newPlantSpeciesName !== "Other") {
            setPlantInfoToSend({ ...plantInfoToSend, species: newPlantSpeciesName })
        }
        setFormPage(page => page + 1)
    }

    async function submit() {
        const created = await submitRequest(plantInfoToSend, setisInvalid, setErrorText, setSubmitted, onCreated)
        if (created) {
            setPlantInfoToSend(emptyPlantInfo(collectionId))
            setNewPlantSpeciesName(null)
            setFormPage(0)
        }
    }

    switch(formPage){
        case 0:
            currentPage = (
                <>
                    <FormControlLabel>
                        <FormControlLabelText>Select the species</FormControlLabelText>
                    </FormControlLabel>
                    <CatalogueSelector setPlantSpeciesName={setNewPlantSpeciesName} plantSpeciesName={newPlantSpeciesName} catalogue={plantCatalogue} />
                    {newPlantSpeciesName === "Other"&&(
                        <Input className="mt-2">
                            <InputField
                            placeholder="Species name"
                            value={plantInfoToSend.species ?? ""}
                            onChangeText={text => setPlantInfoToSend({ ...plantInfoToSend, species: text })}
                            />
                        </Input>)}
                    <Text bold={true} size="xl" className="text-center my-2">OR</Text>
                    <Button onPress={()=>{
                        plantDraft.setFormPage(formPage)
                        plantDraft.setDraft(plantInfoToSend)
                        setModalOn(false);
                        router.push('/camera',)
                        }}>
                        <ButtonText>Take a picture</ButtonText>
                        <Ionicons size={16} name="camera-sharp"></Ionicons>
                    </Button>
                </>
            )
            break
        case 1:
            currentPage = (
            <>
                <FormControlLabel>
                    <FormControlLabelText>Give it a name</FormControlLabelText>
                </FormControlLabel>
                <Input>
                    <InputField
                        placeholder="My Plant"
                        value={plantInfoToSend.name}
                        onChangeText={text => setPlantInfoToSend({ ...plantInfoToSend, name: text })}
                    />
                </Input>

            </>
            )
            break
        case 2:
            currentPage =(
            <>
                <FormControlLabel>
                    <FormControlLabelText>How many days ago did you last water it?</FormControlLabelText>
                </FormControlLabel>
                <Input>
                    <InputField
                        placeholder="e.g. 3"
                        keyboardType="number-pad"
                        value={plantInfoToSend.last_watered?.toString() ?? ""}
                        onChangeText={text => {
                            const days = parseInt(text, 10)
                            setPlantInfoToSend({ ...plantInfoToSend, last_watered: Number.isNaN(days) ? null : days })
                        }}
                    />
                </Input>
            </>
            )
            break
        case 3:
            currentPage = (
            <>
                <FormControlLabel>
                    <FormControlLabelText>Where is it placed?</FormControlLabelText>
                </FormControlLabel>
                <VStack className="gap-2">
                    {POSITIONS.map(position => (
                        <Button
                            key={position}
                            variant={plantInfoToSend.position === position ? "default" : "outline"}
                            onPress={() => setPlantInfoToSend({ ...plantInfoToSend, position: position })}
                        >
                            <ButtonText>{position.charAt(0).toUpperCase() + position.slice(1)}</ButtonText>
                        </Button>
                    ))}
                </VStack>
            </>
            )
            break
        case 4:
            currentPage = (
            <>
                <FormControlLabel>
                    <FormControlLabelText>Check your plant&apos;s details</FormControlLabelText>
                </FormControlLabel>
                <VStack className="gap-1">
                    <Text>Species: {plantInfoToSend.species || "-"}</Text>
                    <Text>Name: {plantInfoToSend.name || "-"}</Text>
                    <Text>Last watered: {plantInfoToSend.last_watered !== null ? `${plantInfoToSend.last_watered} days ago` : "-"}</Text>
                    <Text>Position: {plantInfoToSend.position ?? "-"}</Text>
                </VStack>
            </>
            )
            break
    }

    return(
        <VStack>
        <FormControl className="" isInvalid={isInvalid}>
        {currentPage}
        <FormControlError>
            <FormControlErrorText className="text-destructive">{errorText}</FormControlErrorText>
        </FormControlError>
        </FormControl>
        <ButtonGroup className="flex flex-row justify-around mt-4">
            {formPage > 0 && (
            <Button onPress={() => setFormPage(page => page - 1)}>
                <ButtonText>Previous</ButtonText>
            </Button>)}
            {formPage < LAST_PAGE ? (
            <Button onPress={nextPage}>
                <ButtonText>Next</ButtonText>
            </Button>
            ) : (
            <Button onPress={submit}>
                <ButtonText>Add plant!</ButtonText>
            </Button>
            )}
        </ButtonGroup>


        </VStack>
    );
}

// returns whether the plant was created
async function submitRequest(
    plantInfo: NewPlantInfo,
    setInvalid: (invalid: boolean) => void,
    setErrorText: (text: string) => void,
    setSubmitted: (submitted: boolean) => void,
    onCreated: () => void
){
    const result = await handlePlantCreation(plantInfo)
    setInvalid(!result.status)
    setErrorText(result.description)
    if(result.status){
        onCreated()
        setSubmitted(true)
        setTimeout(()=>{setSubmitted(false)},3000)
    }
    return result.status
}
