import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
export default function TabLayout() {
  return (
    <Tabs       screenOptions={{
        tabBarActiveTintColor: '#219f0b',
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
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
        ),
       }} />
    </Tabs>
  );
}
