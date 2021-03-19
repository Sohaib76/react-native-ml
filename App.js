import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Button} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import Tflite from 'tflite-react-native';

let tflite = new Tflite(); // Instantiate Tflite into memory
var modelFile = 'models/model.tflite';
var labelsFile = 'models/labels.txt';

export default function App() {
  const [recognition, setrecognition] = useState(null);
  const [sourceImage, setsourceImage] = useState(null);

  tflite.loadModel({model: modelFile, labels: labelsFile}, (err, res) => {
    if (err) console.log(err);
    else console.log(res);
  });

  const selectImgFromGallery = () => {
    const options = {};
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User Cancelled');
      } else if (response.error) {
        console.log('Error', response.error);
      } else if (response.customButton) {
        console.log('Custom Button');
      } else {
        setsourceImage(response.uri);
        console.log(response.uri);

        tflite.runModelOnImage(
          {
            path: response.path,
            imageMean: 128,
            imageStd: 128,
            numResults: 2,
            threshold: 0.05,
          },
          (err, resp) => {
            if (err) console.log(err);
            else {
              console.log(resp[0]);
              setrecognition(resp[0]);
            }
          },
        );
      }
    });
  };

  const takeImgFromCamera = () => {
    const options = {};
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User Cancelled');
      } else if (response.error) {
        console.log('Error', response.error);
      } else if (response.customButton) {
        console.log('Custom Button');
      } else {
        setsourceImage(response.uri);
        console.log(response.uri);

        tflite.runModelOnImage(
          {
            path: response.path,
            imageMean: 128,
            imageStd: 128,
            numResults: 2,
            threshold: 0.05,
          },
          (err, resp) => {
            if (err) console.log(err);
            else {
              console.log(resp[0]);
              setrecognition(resp[0]);
            }
          },
        );
      }
    });
  };

  return (
    <LinearGradient
      style={styles.linearGradient}
      colors={['red', 'blue', 'black']}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Not Hot Dog</Text>
      </View>
      <View style={styles.outputContainer}>
        {recognition ? (
          <>
            <Image source={{uri: sourceImage}} style={styles.hotDogImg} />
            <Text style={{color: 'white', fontSize: 20}}>
              {recognition['label'] +
                ' - ' +
                (recognition['confidence'] * 100).toFixed(0) +
                '%'}
            </Text>
          </>
        ) : (
          <Image
            source={require('./assets/hotdog.png')}
            style={styles.hotDogImg}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          titleStyle={{color: 'black', fontSize: 20}}
          containerStyle={{margin: 5}}
          buttonStyle={styles.button}
          title="Camera Roll"
          onPress={selectImgFromGallery}
        />
        <Button
          onPress={takeImgFromCamera}
          titleStyle={{color: 'black', fontSize: 20}}
          buttonStyle={styles.button}
          title="Select Picture"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  titleContainer: {
    marginTop: 70,
    marginLeft: 40,
  },
  title: {
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold',
  },
  outputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotDogImg: {
    height: 240,
    width: 240,
  },
  buttonContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 58,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});
