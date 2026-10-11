import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import AddCollection from "@/src/views/collections/components/add-collection";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import { useState } from "react";
import { Text } from "../text";
type CreateType= 'collection'|'plant';

type CreateModalProps = {
    itemType: CreateType;
    modalOn: boolean;
    setModalOn: (open: boolean) => void;
    onCreated: () => void;
};
export default function CreateModal({itemType, modalOn, setModalOn, onCreated}:CreateModalProps){
  const [submitRequest, setSubmitRequest] = useState(false)
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  if(itemType === "collection"){
        return(
        <Modal isOpen={modalOn}>
        <ModalBackdrop/>
          <ModalContent>
            <ModalHeader>
              <Heading size="lg">Add a {itemType}!</Heading>
              <Button className="rounded-full p-2" variant="outline" onPress={()=>{setModalOn(false)}}>
                <Ionicons size={16} color={"white"} name={"close-outline"}></Ionicons>
              </Button>
            </ModalHeader>
            <ModalBody>
              <AddCollection setSubmitted={setRequestSubmitted} onCreated={onCreated}/>
            </ModalBody>
            {requestSubmitted?(
            <ModalFooter>
              <Text>{itemType.charAt(0).toUpperCase().concat(itemType.slice(1))} created succesfully!</Text>
            </ModalFooter>
            ):
            <></>}

          </ModalContent>
      </Modal>
    );
    }
    
    
}