import Ionicons from "@react-native-vector-icons/ionicons/static";
import { Tabs } from 'expo-router';
export default function TabLayout() {
  return (
    <Tabs       
    screenOptions={{
        tabBarActiveTintColor: '#082408',
        headerStyle: {
        backgroundColor: '#1ea11c',
        },
        headerShadowVisible: false,
        headerTintColor: '#e3e6e3',
        tabBarStyle: {
        backgroundColor: '#1ea11c',
        },
    }}
      >
        <Tabs.Screen 
            name="index" 
            options={{ 
                title: 'Home',
                tabBarIcon: ({color, focused}) => (
                <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />  
                ),
            }} 
            />
        <Tabs.Screen 
            name="search" 
            options={{ 
                title: 'Search',
                tabBarIcon: ({color, focused}) =>(
                    <Ionicons name={focused ? 'search-sharp' : 'search-outline'} color={color} size={24}/>
                ),
       }} 
       />
        <Tabs.Screen 
            name="plants" 
            options={{ 
                title: 'Plants',
                tabBarIcon: ({color, focused}) =>(
                    <Ionicons name={focused ? 'leaf-sharp' : 'leaf-outline'} color={color} size={24}/>
                ),
                }} 
       />
    </Tabs>
  );
}
