// app/screens/CarLotScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type RootStackParamList = {
  CarDetail: { carId: string };
  CarLot: { carId: string };
  // other routes...
};

export default function CarLotScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'CarLot'>>();
  const { carId } = route.params;
  const [carLotStatus, setCarLotStatus] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCarData = async () => {
      const docRef = doc(db, 'cars', carId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCarLotStatus(data.carLotStatus || '');
      }
    };
    fetchCarData();
  }, [carId]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'cars', carId);
      await updateDoc(docRef, {
        carLotStatus,
      });
      navigation.navigate('CarDetail', { carId });
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Car Lot Status"
        value={carLotStatus}
        onChangeText={setCarLotStatus}
      />
      <Button title="Save Changes" onPress={handleSave} />
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
// app/screens/CarLotScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function CarLotScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Car Lot</Text>
      <Text>Take pictures of vehicle behind car lot for block wall background:</Text>
      <TextInput style={styles.input} />
      <Text>Put pictures into Lot Wizard and upload to website:</Text>
      <TextInput style={styles.input} />
      <Text>Put FTC notice and vehicle info page on rear driver side window:</Text>
      <TextInput style={styles.input} />
      <Text>Park vehicle and place windshield banner in place:</Text>
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