import React, { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import { Camera, FlashMode } from 'expo-camera';
import { CameraType } from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

interface CameraProps {
  photo: any;
  retakePicture: () => void;
  savePhoto: () => void;
//   deletePhoto: () => void;
  toggleCameraType: () => void;
  flashMode: () => void;
}

const CameraScreen = () => {
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type);
  const [flashMode, setFlashMode] = useState('off');
  const [iconColor, setIconColor] = useState('white');

  const cameraRef = useRef<Camera | null>(null);

  const StartCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    console.log(status);
    if (status === 'granted') {
      setStartCamera(true);
      setCameraType(CameraType.back);
    } else {
      Alert.alert('Access denied');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo: any = await cameraRef.current.takePictureAsync();
      console.log(photo);
      setPreviewVisible(true);
      setCapturedImage(photo);
    }
  };

  const savePhoto = async () => {
    if (capturedImage) {
      try {
        const timestamp = new Date().getTime();
        const key = `Pic-Saved-${timestamp}`;
        
        capturedImage.timestamp = timestamp;
  
        await AsyncStorage.setItem(key, JSON.stringify(capturedImage));
        console.log("Photo saved successfully!");
        Alert.alert("Photo saved successfully!");
      } catch (error) {
        console.error("Error saving photo:", error);
        Alert.alert("Failed to save photo.");
      }
    }
  };

//   const deletePhoto = async () => {
//     if (capturedImage) {
//       try {
//         const key = `Pic-Saved-${new Date().getTime()}`;
//         await AsyncStorage.removeItem(key);
//         Alert.alert("Photo deleted successfully!");
//       } catch (error) {
//         console.error("Error deleting photo:", error);
//         Alert.alert("Failed to delete photo.");
//       }
//     }
//   };

  const toggleCameraType = () => {
    setCameraType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    StartCamera();
  };

  const handleFlashMode = () => {
    const newIconColor = iconColor === 'orange' ? 'white' : 'orange';
    setIconColor(newIconColor);

    if (flashMode === 'off') {
      setFlashMode('on');
    } else if (flashMode === 'on') {
      setFlashMode('off');
    } else {
      setFlashMode('auto');
    }
  };

  return (
    <View style={styles.container}>
      {startCamera ? (
        <View style={{ flex: 1, width: '100%' }}>
          {previewVisible && capturedImage ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={savePhoto}
              retakePicture={retakePicture}
            //   deletePhoto={deletePhoto}
              toggleCameraType={toggleCameraType}
              flashMode={handleFlashMode}
            />
          ) : (
            <Camera
              type={cameraType}
              flashMode={flashMode}
              style={{ flex: 1 }}
              ref={(r) => {
                cameraRef.current = r;
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '5%',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <TouchableOpacity onPress={handleFlashMode}>
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      <Entypo name="flash" size={40} color={iconColor} />
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    right: '5%',
                    top: '5%',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <TouchableOpacity onPress={toggleCameraType}>
                    <Text
                      style={{
                        fontSize: 10,
                      }}
                    >
                      <MaterialCommunityIcons name="camera-flip-outline" size={40} color="white" />
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity
                      onPress={takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 35,
                        backgroundColor: '#fff',
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={StartCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Start Camera
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CameraPreview: React.FC<CameraProps> = ({ photo, retakePicture, savePhoto}) => {
  console.log('Photo taken', photo);
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={deletePhoto}
              style={{
                width: 130,
                height: 40,
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}
              >
                Delete photo
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}
              >
                Save photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CameraScreen;