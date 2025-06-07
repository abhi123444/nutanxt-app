import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeModules } from 'react-native';

const { ArpScanner } = NativeModules;

export default function HotspotScanner() {

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const scanDevices = async () => {
    setLoading(true);
     setDevices([]);
    try {
      const result = await ArpScanner.scanDevices(); // call native Kotlin module
      setDevices(result);
    } catch (error) {
      console.error('Scan failed:', error);
      Alert.alert('Error', 'Failed to scan devices.');
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceIp}>{item.ip}</Text>
      <Text style={styles.deviceMac}>{item.mac}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Hotspot Device Scanner</Text>

      <TouchableOpacity style={styles.button} onPress={scanDevices} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Scanning...' : 'Scan Devices'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginVertical: 16 }} />}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.ip}
        renderItem={renderItem}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No devices found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16 },
  deviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceIp: { fontSize: 16, fontWeight: '600' },
  deviceMac: { fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' },
});
