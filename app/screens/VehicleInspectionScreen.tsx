// app/screens/NewCarProcessScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type RootStackParamList = {
  CarDetail: { carId: string };
  // other routes...
};

export default function NewCarProcessScreen() {
  const [vehicleName, setVehicleName] = useState('');
  const [stockNumber, setStockNumber] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleStartProcess = async () => {
    try {
      const docRef = await addDoc(collection(db, 'cars'), {
        vehicleName,
        stockNumber,
        inputVehicle: {},
        vehicleInspection: {},
        bodyShop: {},
        carLot: {},
      });
      navigation.navigate('CarDetail', { carId: docRef.id });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Vehicle Name"
        value={vehicleName}
        onChangeText={setVehicleName}
      />
      <TextInput
        style={styles.input}
        placeholder="Stock Number"
        value={stockNumber}
        onChangeText={setStockNumber}
      />
      <Button title="Start Process" onPress={handleStartProcess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
  },
});




/*
// app/screens/VehicleInspectionScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function VehicleInspectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Mechanical Inspection</Text>
      <Text>Look vehicle over for any major mechanical, structural, body issues:</Text>
      <TextInput style={styles.input} />
      <Text>If found STOP contact Jason:</Text>
      <TextInput style={styles.input} />
      <Text>If none found perform a PA State Inspection and Emission if necessary:</Text>
      <TextInput style={styles.input} />
      <Text>Do functional check of all vehicle accessories not covered under PA Inspection:</Text>
      <TextInput style={styles.input} />
      <Button title="Save" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
*/