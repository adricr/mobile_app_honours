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

    // 1. CenterCrop: the centred square Resize(256) + CenterCrop(224) keeps (87.5% of the shorter side)
    const side = Math.round(Math.min(photo.width, photo.height) * 224 / 256)
    const square = await ImageManipulator.manipulate(photo)
        .crop({
            originX: Math.round((photo.width - side) / 2),
            originY: Math.round((photo.height - side) / 2),
            width: side,
            height: side,
        })
        .renderAsync()

    // 2. decode to RGB pixels at full size; the classifier resizes to 224 ('area', antialiased) and normalises natively
    const saved = await square.saveAsync({ compress: 1 })
    const { data, width, height } = jpeg_js.decode(await new File(saved.uri).bytes(), { useTArray: true, formatAsRGBA: false })
    return { data, width, height, format: 'rgb', layout: 'hwc' }
}



// export async function loadImageTest(imagePath:string):Promise<string>{

//     const RESIZE_SIZE = 256;
//     const CROP_SIZE = 224;
    
//     let image = await ImageManipulator.manipulate(imagePath).renderAsync()

//     // shrink by half until within 2x of the target: each 1/2 step averages 2x2 pixels,
//     // so no detail is skipped (Android's bilinear resize doesn't antialias big reductions)
//     while (image.width / 2 >= RESIZE_SIZE) {
//         image = await ImageManipulator.manipulate(image)
//             .resize({ width: Math.round(image.width / 2) })
//             .renderAsync()
//     }

//     // final Resize(256) + CenterCrop(224), now a small (< 2x) reduction
//     const factor = RESIZE_SIZE / image.width
//     const transformed = await ImageManipulator.manipulate(image)
//         .resize({ width: RESIZE_SIZE })
//         .crop({
//             originX: (RESIZE_SIZE - CROP_SIZE) / 2,
//             originY: Math.round((image.height * factor - CROP_SIZE) / 2),
//             width: CROP_SIZE,
//             height: CROP_SIZE,
//         })
//         .renderAsync()

// const saved = await transformed.saveAsync({ compress: 1 })
// const inInt8 = await new File(saved.uri).bytes()
// const rawData = jpeg_js.decode(inInt8,{useTArray: true, formatAsRGBA: false})
// const inImageBuffer:ImageBuffer = {
//   data: rawData.data,
//   width: CROP_SIZE,
//   height: CROP_SIZE,
//   format: 'rgb',
//   layout: 'hwc'
// }

// return saved.uri
// }