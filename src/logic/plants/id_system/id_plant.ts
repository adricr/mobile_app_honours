import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { ImageManipulator } from 'expo-image-manipulator';
import * as jpeg_js from 'jpeg-js';
import { Classification, Classifier, ClassifierModel, ClassifierOptions, createClassifier } from 'react-native-executorch';
import { ImageBuffer } from 'react-native-executorch/cv';
import labelsArray from './labels.json';
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];

export async function loadLocalModel(): Promise<Classifier<string>>{
  const [modelAsset] = await Asset.loadAsync(require('./model_large.pte'));
  if (!modelAsset.localUri) {
      throw new Error("Couldn't load the identification model");
  }

  const opts = <ClassifierOptions<string>>{
    labels: labelsArray.map(plant => plant.species),
    resizeMode: 'stretch',
    interpolation: 'area',
    normalizeOpts: {
        alpha: STD.map(s => 1 / (255 * s)),
        beta: MEAN.map((m, i) => -m / STD[i]),
    },
  }
  const  modelAsClassifier =<ClassifierModel<string>>{
    modelPath: modelAsset.localUri.replace('file://',''),
    modelOpts: opts
  }
  const classifier = createClassifier(modelAsClassifier)
  return classifier
}


export async function inferImage(imagePath: string, model: Classifier<string>):Promise<Classification<string>[]>{

const image = await loadImage(imagePath)
  return model.classify(image,{
    topk: 1
  });
}

export async function loadImage(imagePath: string): Promise<ImageBuffer> {
    const photo = await ImageManipulator.manipulate(imagePath).renderAsync()

    // 1. CenterCrop
    const side = Math.round(Math.min(photo.width, photo.height) * 224 / 256)
    const square = await ImageManipulator.manipulate(photo)
        .crop({
            originX: Math.round((photo.width - side) / 2),
            originY: Math.round((photo.height - side) / 2),
            width: side,
            height: side,
        })
        .renderAsync()

    // 2. decode to RGB pixels at full size; the classifier resizes to 224
    const saved = await square.saveAsync({ compress: 1 })
    const { data, width, height } = jpeg_js.decode(await new File(saved.uri).bytes(), { useTArray: true, formatAsRGBA: false })
    return { data, width, height, format: 'rgb', layout: 'hwc' }
}