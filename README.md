# 🌿 Plant-Care

A mobile app that helps you keep your houseplants alive. Snap a photo to identify a plant on-device, organise your plants into collections, log waterings, and get care recommendations based on each species' needs and the live weather where you are.

Built with **Expo SDK 57**, **React Native 0.86**, and **Expo Router**. It was developed as an Honours project.

---

## Features

- **📷 On-device plant identification.** A bundled image classifier (ExecuTorch `.pte` model) runs locally on the phone. No photos leave the device.
- **🪴 Collections.** Group plants by room, balcony, or whatever suits you, then add plants manually from the catalogue or via the camera.
- **💧 Care log.** Record waterings and see when each plant was last looked after.
- **🧠 Rule-based recommender.** Compares each plant's care requirements with its current context and suggests actions:
  - water it (overdue for its watering interval)
  - move it (current position ≠ recommended light position)
  - protect it from the cold (outside temperature below its hardiness)
  - add supplemental light (heavy cloud cover for full-sun plants)
- **🌦️ Live weather context.** Uses your location and the free [Open-Meteo](https://open-meteo.com/) API for temperature, humidity, and cloud cover.
- **✅ Tasks tab.** One place that lists every plant that needs watering right now.
- **💾 Offline-first storage.** Everything is stored locally in SQLite via `expo-sqlite`.

### Supported species

The identification model and care database currently cover 11 species:

| Species | Common name |
| --- | --- |
| *Ficus lyrata* | Fiddle-leaf fig |
| *Monstera deliciosa* | Swiss cheese plant |
| *Epipremnum aureum* | Golden pothos |
| *Kalanchoe blossfeldiana* | Flaming Katy |
| *Tradescantia pallida* | Purple heart |
| *Ocimum basilicum* | Basil |
| *Crassula ovata* | Jade plant |
| *Spathiphyllum wallisii* | Peace lily |
| *Haworthiopsis attenuata* | Zebra haworthia |
| *Echeveria elegans* | Mexican snowball |
| *Solanum lycopersicum* | Tomato |

---

## How it works

1. **Identify.** The photo is centre-cropped, decoded to RGB and classified by `model_large.pte` with ImageNet normalisation. See [id_plant.ts](src/logic/plants/id_system/id_plant.ts).
2. **Gather facts.** The plant's care requirements (watering interval, light position, hardiness) come from the seeded catalogue, and the current weather comes from Open-Meteo.
3. **Evaluate.** Each rule in [rules.ts](src/data/rules/rules.ts) is a `condition → result` pair. The [recommender](src/logic/recommendation_system/recommender.ts) fires the matching rules and turns them into readable messages.

---

## Getting started

### Prerequisites

- Node.js (LTS) and npm
- Android Studio (emulator or physical device) and/or Xcode (iOS simulator, macOS only)

> [!IMPORTANT]
> This app uses native modules that are **not** in Expo Go (`react-native-executorch`, `react-native-blob-util`, and others), so you need a **development build**.

### Install and run

```bash
# install dependencies
npm install

# build and launch a development build
npm run android     # or: npm run ios

# afterwards, just start the dev server
npm start
```
---

## Testing

### Unit tests (Jest)

The recommender is covered by unit tests for the happy path, single-ailment cases, missing context or care data, and boundary values (e.g. 0 % cloud cover, 0 °C hardiness).

```bash
npm test                 # watch mode
npx jest                 # single run
```

### End-to-end tests (Maestro)

UI flows live in [.maestro/](.maestro/) and use `testID`s on key components:

| Flow | What it covers |
| --- | --- |
| `create_collection.yaml` | Create a new collection |
| `delete_collection.yaml` | Delete a collection |
| `add_plant.yaml` | Add a plant manually from the catalogue |
| `water_plant.yaml` | Water a plant and log it |
| `delete_plant.yaml` | Remove a plant |

With a development build installed on a running emulator or device:

```bash
maestro test .maestro/                    # run every flow
maestro test .maestro/add_plant.yaml      # run a single flow
```

### Lint and typecheck

```bash
npm run lint
npx tsc --noEmit
```

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Expo SDK 57 |
| UI | gluestack-ui, Uniwind (Tailwind CSS v4), Ionicons |
| Storage | expo-sqlite |
| ML | react-native-executorch, expo-image-manipulator, jpeg-js |
| Testing | Jest (jest-expo), React Native Testing Library, Maestro |

---

## License

See [LICENSE](LICENSE).
