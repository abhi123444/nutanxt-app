import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Platform, PermissionsAndroid, StyleSheet, Switch } from 'react-native';
import {
  useBluetoothState,
  BluetoothStateManager,
} from "react-native-bluetooth-state-manager";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // ✅ Import icons

const BluetoothToggle = () => {
  const [btState, setBtState] = useState('Unknown');

  useEffect(() => {
    requestBluetoothPermissions();
    fetchBluetoothState();

    // Subscribe to Bluetooth state changes
    const subscription = BluetoothStateManager.addListener((newState) => {
      setBtState(newState);
    }, true); // `true` triggers callback with current state immediately

    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  const fetchBluetoothState = async () => {
    try {
      const state = await BluetoothStateManager.getState();
      setBtState(state);
    } catch (error) {
      console.warn('Error fetching Bluetooth state:', error);
    }
  };

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ]);

        if (
          granted['android.permission.BLUETOOTH_CONNECT'] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.BLUETOOTH_SCAN'] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert('Permissions denied', 'Bluetooth permissions are required for this app.');
        }
      } catch (err) {
        console.warn('Permission error:', err);
      }
    }
  };

  const toggleBluetooth = async (value) => {
    try {
      const state = await BluetoothStateManager.getState();

      if (value) {
        if (state === 'PoweredOff') {
          await BluetoothStateManager.requestToEnable();
          // No need to call fetchBluetoothState here because listener will update state
        } else {
          Alert.alert('Bluetooth is already ON');
        }
      } else {
        if (state === 'PoweredOn') {
          await BluetoothStateManager.requestToDisable();
          // No need to call fetchBluetoothState here because listener will update state
        } else {
          Alert.alert('Bluetooth is already OFF');
        }
      }
    } catch (err) {
      console.warn('Error toggling Bluetooth:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsWrapper}>
        <Text style={styles.label}>
            Bluetooth is {btState === 'PoweredOn' ? 'Enabled' : 'Disabled'}
        </Text>
        <Switch
            value={btState === 'PoweredOn'}
            onValueChange={toggleBluetooth}
            thumbColor={btState === 'PoweredOn' ? '#0f0' : '#f00'}
        />
      </View>
     
      <View style={styles.iconWrapper}>
        <MaterialIcons
          name={btState === 'PoweredOn' ? 'bluetooth' : 'bluetooth-disabled'}
          size={100}
          color={btState === 'PoweredOn' ? 'blue' : 'gray'}
        />
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
    controlsWrapper: {
        flex: 1,
        justifyContent: 'center',  // vertically center
        alignItems: 'center',      // horizontally center
    },
  container: {
    flex: 1, // Full screen height
    padding: 20,
  },
  iconWrapper: {
    flex: 1, // Takes all available space
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  label: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
});


export default BluetoothToggle;
