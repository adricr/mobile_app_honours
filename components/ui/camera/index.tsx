import Ionicons from "@react-native-vector-icons/ionicons/static";
import {
  CameraCapturedPicture,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Button, ButtonText } from "../button";
import { Text } from "../text";

type CameraProps = {
  onClose?: () => void;
};

export default function Camera({ onClose }: CameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [picture, setPicture] = useState<CameraCapturedPicture | null>(null);
  const [uri, setUri] = useState<string | null>(null);

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
      setPicture(photo);
      setUri(photo.uri);
    }
  };

  const renderPicture = (uri: string) => {
    return (
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 300, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)}>
            <ButtonText>Take another picture</ButtonText>
        </Button>
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
          {onClose ? (
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={32} color="white" />
            </Pressable>
          ) : (
            <View style={styles.sideSpacer} />
          )}
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
    flex: 1,
    backgroundColor: "#fff",
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