import { Asset } from 'expo-asset';
import { Classifier, ClassifierModel, ClassifierOptions, createClassifier } from 'react-native-executorch';
import labelsArray from './labels.json';
export type InferOutput = {
  label: number,
  confidence: number
}

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
    interpolation: 'linear',
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


// export function inferImage(imagePath: string, model: Classifier<string>):InferOutput{
// const tInput = tensor('float32', [1, 3, 224, 224]);
// const tOutput = tensor('float32', [1, 11]);
// image
// try {
//   tInput.setData(image);

//   const outputs = model.execute('forward', [tInput], [tOutput]);
//   // outputs[0] is tOutput, now filled with logits.
//   // Any non-tensor return values (numbers, booleans, strings) appear here too.

//   const logits = tOutput.getData(new Float32Array(tOutput.numel));
// } finally {
//   tInput.dispose();
//   tOutput.dispose();
// }

// }