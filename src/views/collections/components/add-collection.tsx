import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { handleCollectionCreation } from "@/src/logic/collection_system/management";
import { useState } from "react";


type AddCollectionProps ={
    setSubmitted: (submitted: boolean) => void
    onCreated: () => void
};

export default function AddCollection({setSubmitted, onCreated}:AddCollectionProps){
    const [inputValue, setInputValue] = useState("");
    const [isInvalid, setisInvalid] = useState(false);
    const [errorText,setErrorText] = useState("")
    return(
        <VStack>
            <FormControl isInvalid={isInvalid}>
                <FormControlLabel>
                    <FormControlLabelText>Collection's Name</FormControlLabelText>
                </FormControlLabel>
                <Input>
                    <InputField type="text" placeholder="Living Room" value={inputValue} onChangeText={(text)=>{setInputValue(text)}}/>
                </Input>
                <FormControlError>
                    <FormControlErrorText className="text-destructive">
                        {errorText}
                    </FormControlErrorText>
                </FormControlError>
                <ButtonGroup className="py-5 mx-5 items-center ">
                    <Button className="p-4 w-1/2 rounded-full" onPress={()=>{submitRequest(inputValue, setisInvalid, setErrorText, setSubmitted, onCreated)}}>
                        <ButtonText>Create!</ButtonText>
                    </Button>
                </ButtonGroup>


            </FormControl>
        </VStack>
    );
}

async function submitRequest(
    name: string,
    setInvalid: (invalid: boolean) => void,
    setErrorText: (text: string) => void,
    setSubmitted: (submitted: boolean) => void,
    onCreated: () => void
){
    const result = await handleCollectionCreation(name)
    setInvalid(!result.status)
    setErrorText(result.description)
    if(result.status){
        onCreated()
        setSubmitted(true)
        setTimeout(()=>{setSubmitted(false)},3000)
    }
}