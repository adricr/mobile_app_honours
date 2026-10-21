import * as Geolocation from 'expo-location';

export type Coordinates = {
    longitude: number
    latitude: number
}

export async function getLocation(): Promise<Coordinates | null>{
    const granted = await Geolocation.requestForegroundPermissionsAsync()
    if(!granted.granted){
        return null
    }
    const position = await Geolocation.getLastKnownPositionAsync()
    if(position){
        console.log("perfe")
            return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    }
    return null

}