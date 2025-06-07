// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HotspotScanner from './components/HotspotScanner';
import BluetoothToggle from './components/BluetoothToggle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // ✅ Import icons

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'help';
            if (route.name === 'Hotspot Scanner') {
              iconName = focused ? 'wifi' : 'wifi-off';
            } else if (route.name === 'Bluetooth Toggle') {
              iconName = focused ? 'bluetooth' : 'bluetooth-disabled';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Hotspot Scanner"  component={HotspotScanner} />
        <Tab.Screen name="Bluetooth Toggle" component={BluetoothToggle} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
