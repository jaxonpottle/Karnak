// app/screens/BodyShopScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type RootStackParamList = {
  CarDetail: { carId: string };
  BodyShop: { carId: string };
  // other routes...
};

export default function BodyShopScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'BodyShop'>>();
  const { carId } = route.params;
  const [bodyRepairStatus, setBodyRepairStatus] = useState('');
  const [repairCost, setRepairCost] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCarData = async () => {
      const docRef = doc(db, 'cars', carId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBodyRepairStatus(data.bodyRepairStatus || '');
        setRepairCost(data.repairCost || '');
      }
    };
    fetchCarData();
  }, [carId]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'cars', carId);
      await updateDoc(docRef, {
        bodyRepairStatus,
        repairCost,
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
        placeholder="Body Repair Status"
        value={bodyRepairStatus}
        onChangeText={setBodyRepairStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Repair Cost"
        value={repairCost}
        onChangeText={setRepairCost}
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
// app/screens/BodyShopScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function BodyShopScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Body Shop/Detail</Text>
      <Text>Perform any minor body repair, any parts need over $250 contact Jason:</Text>
      <TextInput style={styles.input} />
      <Text>Detail Interior (put floor mats down):</Text>
      <TextInput style={styles.input} />
      <Text>Detail Exterior:</Text>
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