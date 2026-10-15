import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { usePlantDraft } from "@/src/logic/plants/plant-draft-context";
import IdentifyView from "@/src/views/plants/identify";
import Ionicons from "@react-native-vector-icons/ionicons/static";
import {
  CameraView,
  useCameraPermissions
} from "expo-camera";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Classifier } from "react-native-executorch";


export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [classifier, setClassifier] = useState<Classifier<string> | null>(null)
  const [identifyPicture, setIdentifyPicture] = useState<boolean>(false)
  const plantDraft = usePlantDraft()
  
  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission}>
            <ButtonText>Grant Permission</ButtonText>
        </Button>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri){
      setUri(photo.uri);
    } 
  };

  const renderPicture = (uri: string) => {
    return (
      <View className=" size-full flex flex-col justify-center items-center">
        <Image
          className=""
          source={{ uri }}
          contentFit="contain"
          style={{ width: "150%", aspectRatio: 1 }}
        />
       { identifyPicture ? (
        <IdentifyView uri={uri} onBack={()=>{setIdentifyPicture(false)}} setSpecies={plantDraft.setIdentifiedSpecies} />
        ):(
          <ButtonGroup className="flex my-5  w-2/3">
            <Button className="bg-green-600 rounded-3xl flex flex-row" onPress={()=>{
              setIdentifyPicture(true)
            }}>
                <ButtonText>
                    Identify
                </ButtonText>
                <Ionicons name="search-sharp" size={16}/>
            </Button>
            <Button className=" rounded-3xl" onPress={() => setIdentifyPicture(false)}>
                <ButtonText>Save Picture</ButtonText>
                <Ionicons name="file-tray-sharp" size={16}/>
            </Button>
            <Button className=" rounded-3xl" onPress={() => {
              setIdentifyPicture(false)
              setUri(null)
              }}>
                <ButtonText>Retry</ButtonText>
                <Ionicons name="refresh-sharp" size={16}/>
            </Button>
            <Button className=" rounded-3xl" onPress={() => {
              setIdentifyPicture(false)
              setUri(null)
              if (plantDraft.draft && plantDraft.identifiedSpecies) {
                plantDraft.setDraft({ ...plantDraft.draft, species: plantDraft.identifiedSpecies })
              }
              router.back()
              }}>
                <ButtonText>Exit</ButtonText>
                <Ionicons name="exit-sharp" size={16}/>
            </Button>
        </ButtonGroup>
        )
      }
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        {/* defaults to the back camera taking pictures */}
        <CameraView
          style={styles.camera}
          ref={ref}
          responsiveOrientationWhenOrientationLocked
        />
        <View style={styles.shutterContainer}>
          
            <Button variant={'ghost'} onPress={()=>{router.back()}} hitSlop={12}>
              <Ionicons name="arrow-undo-sharp" size={32} color="white" />
            </Button>

          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View style={styles.shutterBtnInner} />
              </View>
            )}
          </Pressable>
          {/* keeps the shutter centred */}
          <View style={styles.sideSpacer} />
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      {uri ? renderPicture(uri) : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: "#032601",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: StyleSheet.absoluteFill,
  camera: StyleSheet.absoluteFill,
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
  sideSpacer: {
    width: 32,
  },
});