// app/screens/InputVehicleScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { useRoute, useNavigation, RouteProp, NavigationProp } from '@react-navigation/native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

type RootStackParamList = {
  CarDetail: { carId: string };
  InputVehicle: { carId: string };
  // other routes...
};

export default function InputVehicleScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'InputVehicle'>>();
  const { carId } = route.params;
  const [stockNumber, setStockNumber] = useState('');
  const [dealerFolder, setDealerFolder] = useState('');
  const [titleStatus, setTitleStatus] = useState('');
  const [keyTag, setKeyTag] = useState('');
  const [pricing, setPricing] = useState('');
  const [websiteUpload, setWebsiteUpload] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCarData = async () => {
      const docRef = doc(db, 'cars', carId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStockNumber(data.stockNumber || '');
        setDealerFolder(data.dealerFolder || '');
        setTitleStatus(data.titleStatus || '');
        setKeyTag(data.keyTag || '');
        setPricing(data.pricing || '');
        setWebsiteUpload(data.websiteUpload || '');
      }
    };
    fetchCarData();
  }, [carId]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'cars', carId);
      await updateDoc(docRef, {
        stockNumber,
        dealerFolder,
        titleStatus,
        keyTag,
        pricing,
        websiteUpload,
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
        placeholder="Stock Number"
        value={stockNumber}
        onChangeText={setStockNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Dealer Folder"
        value={dealerFolder}
        onChangeText={setDealerFolder}
      />
      <TextInput
        style={styles.input}
        placeholder="Title Status"
        value={titleStatus}
        onChangeText={setTitleStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Key Tag"
        value={keyTag}
        onChangeText={setKeyTag}
      />
      <TextInput
        style={styles.input}
        placeholder="Pricing"
        value={pricing}
        onChangeText={setPricing}
      />
      <TextInput
        style={styles.input}
        placeholder="Website Upload"
        value={websiteUpload}
        onChangeText={setWebsiteUpload}
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
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function InputVehicleScreen() {
  const [stockNumber, setStockNumber] = useState('');
  const [dealerFolder, setDealerFolder] = useState('');
  const [titleStatus, setTitleStatus] = useState('');
  const [keyTag, setKeyTag] = useState('');
  const [pricing, setPricing] = useState('');
  const [websiteUpload, setWebsiteUpload] = useState('');

  const handleSave = async () => {
    try {
      const docRef = await addDoc(collection(db, 'cars'), {
        stockNumber,
        dealerFolder,
        titleStatus,
        keyTag,
        pricing,
        websiteUpload,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Input Vehicle into Steubenville Pike Auto</Text>
      <Text>Give vehicle stock number:</Text>
      <TextInput style={styles.input} value={stockNumber} onChangeText={setStockNumber} />
      <Text>Make gray dealer jacket folder:</Text>
      <TextInput style={styles.input} value={dealerFolder} onChangeText={setDealerFolder} />
      <Text>Mark if we have valid PA title on folder, or get switched to PA:</Text>
      <TextInput style={styles.input} value={titleStatus} onChangeText={setTitleStatus} />
      <Text>Make vehicle key tag (gray) mark on folder # of keys we have:</Text>
      <TextInput style={styles.input} value={keyTag} onChangeText={setKeyTag} />
      <Text>Enter vehicle info and pricing in Lot Wizard:</Text>
      <TextInput style={styles.input} value={pricing} onChangeText={setPricing} />
      <Text>Upload to website:</Text>
      <TextInput style={styles.input} value={websiteUpload} onChangeText={setWebsiteUpload} />
      <Button title="Save" onPress={handleSave} />
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











































/*import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function InputVehicleScreen() {
  const [stockNumber, setStockNumber] = useState('');
  const [dealerFolder, setDealerFolder] = useState('');
  const [titleStatus, setTitleStatus] = useState('');
  const [keyTag, setKeyTag] = useState('');
  const [pricing, setPricing] = useState('');
  const [websiteUpload, setWebsiteUpload] = useState('');

  const handleSave = async () => {
    try {
      const docRef = await addDoc(collection(db, 'cars'), {
        stockNumber,
        dealerFolder,
        titleStatus,
        keyTag,
        pricing,
        websiteUpload,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Input Vehicle into Steubenville Pike Auto</Text>
      <Text>Give vehicle stock number:</Text>
      <TextInput style={styles.input} value={stockNumber} onChangeText={setStockNumber} />
      <Text>Make gray dealer jacket folder:</Text>
      <TextInput style={styles.input} value={dealerFolder} onChangeText={setDealerFolder} />
      <Text>Mark if we have valid PA title on folder, or get switched to PA:</Text>
      <TextInput style={styles.input} value={titleStatus} onChangeText={setTitleStatus} />
      <Text>Make vehicle key tag (gray) mark on folder # of keys we have:</Text>
      <TextInput style={styles.input} value={keyTag} onChangeText={setKeyTag} />
      <Text>Enter vehicle info and pricing in Lot Wizard:</Text>
      <TextInput style={styles.input} value={pricing} onChangeText={setPricing} />
      <Text>Upload to website:</Text>
      <TextInput style={styles.input} value={websiteUpload} onChangeText={setWebsiteUpload} />
      <Button title="Save" onPress={handleSave} />
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