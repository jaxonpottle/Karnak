import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Button, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { RootStackParamList } from '../navigation'; // Ensure this is the correct path to your navigation definitions

type Car = {
  id: string;
  vehicleName: string;
  stockNumber: string;
};

export default function FindCarScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      const carCollection = collection(db, 'cars');
      const carSnapshot = await getDocs(carCollection);
      const carList = carSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Car),
      }));
      setCars(carList);
      setLoading(false);
    };
    fetchCars();
  }, []);

  const handleDelete = async (carId: string) => {
    try {
      await deleteDoc(doc(db, 'cars', carId));
      setCars(cars.filter(car => car.id !== carId));
      setModalVisible(false);
    } catch (err) {
      console.error('Error deleting document: ', err);
    }
  };

  const confirmDelete = (carId: string) => {
    setSelectedCarId(carId);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Car }) => (
    <View style={styles.carContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('CarDetail', { carId: item.id })}>
        <Text style={styles.carName}>{item.vehicleName}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <Text style={styles.deleteButton}>X</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cars}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are you sure you want to delete this car?</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Yes"
                onPress={() => {
                  if (selectedCarId) {
                    handleDelete(selectedCarId);
                  }
                }}
              />
              <Button
                title="No"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  carName: {
    fontSize: 18,
  },
  deleteButton: {
    fontSize: 18,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});




/*
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { collection, getDocs, query, orderBy, startAfter, limit, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Car = {
  id: string;
  vehicleName: string;
  stockNumber: string;
  dealerFolder: string;
  titleStatus: string;
  keyTag: string;
  pricing: string;
  websiteUpload: string;
};

type RootStackParamList = {
  CarDetail: { carId: string };
  // other routes...
};

export default function FindCarScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const cachedCars = await AsyncStorage.getItem('cars');
        if (cachedCars !== null) {
          setCars(JSON.parse(cachedCars));
        }

        const querySnapshot = await getDocs(query(collection(db, 'cars'), orderBy('vehicleName'), limit(10)));
        const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Car[];
        
        setCars(carsList);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        await AsyncStorage.setItem('cars', JSON.stringify(carsList));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const fetchMoreCars = async () => {
    if (!lastVisible) return;
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'cars'), orderBy('vehicleName'), startAfter(lastVisible), limit(10))
      );
      const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Car[];

      setCars(prevCars => [...prevCars, ...carsList]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (carId: string) => {
      try {
        await deleteDoc(doc(db, 'cars', carId));
        setCars(prevCars => prevCars.filter(car => car.id !== carId));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    const confirmDelete = (carId: string) => {
      Alert.alert(
        "Delete Confirmation",
        "Are you sure you want to delete this car?",
        [
          {
            text: "No",
            onPress: () => {},
            style: "cancel"
          },
          { text: "Yes", onPress: () => handleDelete(carId) }
        ]
      );
    };

    if (loading && cars.length === 0) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      );
    }

    const CarItem = React.memo(({ car }: { car: Car }) => (
      <View style={styles.item}>
        <TouchableOpacity onPress={() => navigation.navigate('CarDetail', { carId: car.id })} style={styles.carInfo}>
          <Text>{car.vehicleName ?? 'Unnamed Vehicle'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(car.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>X</Text>
        </TouchableOpacity>
      </View>
    ));

    const renderItem = ({ item }: { item: Car }) => <CarItem car={item} />;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Find an Existing Car</Text>
        {cars.length === 0 ? (
          <Text style={styles.emptyText}>No cars found.</Text>
        ) : (
          <FlatList
            data={cars}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            initialNumToRender={10}
            onEndReached={fetchMoreCars}
            onEndReachedThreshold={0.5}
            getItemLayout={(data, index) => (
              { length: 70, offset: 70 * index, index }
            )}
          />
        )}
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
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 70,
    alignItems: 'center',
  },
  carInfo: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

*/




/*
// app/screens/FindCarScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, startAfter, limit } from 'firebase/firestore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Car = {
  id: string;
  vehicleName: string;
  stockNumber: string;
  dealerFolder: string;
  titleStatus: string;
  keyTag: string;
  pricing: string;
  websiteUpload: string;
};

type RootStackParamList = {
  CarDetail: { carId: string };
  // other routes...
};

export default function FindCarScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const cachedCars = await AsyncStorage.getItem('cars');
        if (cachedCars !== null) {
          setCars(JSON.parse(cachedCars));
        }

        const querySnapshot = await getDocs(query(collection(db, 'cars'), orderBy('vehicleName'), limit(10)));
        const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Car[];
        
        setCars(carsList);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        await AsyncStorage.setItem('cars', JSON.stringify(carsList));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const fetchMoreCars = async () => {
    if (!lastVisible) return;
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'cars'), orderBy('vehicleName'), startAfter(lastVisible), limit(10))
      );
      const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Car[];

      setCars(prevCars => [...prevCars, ...carsList]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && cars.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const CarItem = React.memo(({ car }: { car: Car }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CarDetail', { carId: car.id })}>
      <View style={styles.item}>
        <Text>{car.vehicleName ?? 'Unnamed Vehicle'}</Text>
      </View>
    </TouchableOpacity>
  ));

  const renderItem = ({ item }: { item: Car }) => <CarItem car={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find an Existing Car</Text>
      {cars.length === 0 ? (
        <Text style={styles.emptyText}>No cars found.</Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          initialNumToRender={10}
          onEndReached={fetchMoreCars}
          onEndReachedThreshold={0.5}
          getItemLayout={(data, index) => (
            { length: 70, offset: 70 * index, index }
          )}
        />
      )}
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
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 70,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});*/
































/*
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, startAfter, limit } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FindCarScreen() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const cachedCars = await AsyncStorage.getItem('cars');
        if (cachedCars !== null) {
          setCars(JSON.parse(cachedCars));
        }

        const querySnapshot = await getDocs(query(collection(db, 'cars'), orderBy('vehicleName'), limit(10)));
        const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setCars(carsList);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        await AsyncStorage.setItem('cars', JSON.stringify(carsList));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const fetchMoreCars = async () => {
    if (!lastVisible) return;
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'cars'), orderBy('vehicleName'), startAfter(lastVisible), limit(10))
      );
      const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setCars(prevCars => [...prevCars, ...carsList]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && cars.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const CarItem = React.memo(({ car }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CarDetail', { carId: car.id })}>
      <View style={styles.item}>
        <Text>{car.vehicleName ?? 'Unnamed Vehicle'}</Text>
      </View>
    </TouchableOpacity>
  ));

  const renderItem = ({ item }) => <CarItem car={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find an Existing Car</Text>
      {cars.length === 0 ? (
        <Text style={styles.emptyText}>No cars found.</Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          initialNumToRender={10}
          onEndReached={fetchMoreCars}
          onEndReachedThreshold={0.5}
          getItemLayout={(data, index) => (
            { length: 70, offset: 70 * index, index }
          )}
        />
      )}
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
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 70,
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

*/











/*
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, startAfter, limit } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FindCarScreen() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const cachedCars = await AsyncStorage.getItem('cars');
        if (cachedCars !== null) {
          setCars(JSON.parse(cachedCars));
        }

        const querySnapshot = await getDocs(query(collection(db, 'cars'), orderBy('vehicleName'), limit(10)));
        const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setCars(carsList);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        await AsyncStorage.setItem('cars', JSON.stringify(carsList));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const fetchMoreCars = async () => {
    if (!lastVisible) return;
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'cars'), orderBy('vehicleName'), startAfter(lastVisible), limit(10))
      );
      const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setCars(prevCars => [...prevCars, ...carsList]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const CarItem = React.memo(({ car }) => (
    <TouchableOpacity onPress={() => navigation.navigate('CarDetail', { carId: car.id })}>
      <View style={styles.item}>
        <Text>{car.vehicleName ?? 'Unnamed Vehicle'}</Text>
      </View>
    </TouchableOpacity>
  ));

  const renderItem = ({ item }) => <CarItem car={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find an Existing Car</Text>
      {cars.length === 0 ? (
        <Text style={styles.emptyText}>No cars found.</Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={fetchMoreCars}
          onEndReachedThreshold={0.5}
        />
      )}
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
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

*/














/*
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';

export default function FindCarScreen() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cars'));
        const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCars(carsList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find an Existing Car</Text>
      {cars.length === 0 ? (
        <Text style={styles.emptyText}>No cars found.</Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('CarDetail', { carId: item.id })}>
              <View style={styles.item}>
                <Text>{item.vehicleName ?? 'Unnamed Vehicle'}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});
*/


































/*
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function FindCarScreen() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cars'));
        const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCars(carsList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find an Existing Car</Text>
      {cars.length === 0 ? (
        <Text style={styles.emptyText}>No cars found.</Text>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>Stock Number: {item.stockNumber ?? 'N/A'}</Text>
              <Text>Dealer Folder: {item.dealerFolder ?? 'N/A'}</Text>
              <Text>Title Status: {item.titleStatus ?? 'N/A'}</Text>
              <Text>Key Tag: {item.keyTag ?? 'N/A'}</Text>
              <Text>Pricing: {item.pricing ?? 'N/A'}</Text>
              <Text>Website Upload: {item.websiteUpload ?? 'N/A'}</Text>
            </View>
          )}
        />
      )}
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
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

*/


















































/*
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function FindCarScreen() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const querySnapshot = await getDocs(collection(db, 'cars'));
      const carsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCars(carsList);
    };
    fetchCars();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find an Existing Car</Text>
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Stock Number: {item.stockNumber}</Text>
            <Text>Dealer Folder: {item.dealerFolder}</Text>
            <Text>Title Status: {item.titleStatus}</Text>
            <Text>Key Tag: {item.keyTag}</Text>
            <Text>Pricing: {item.pricing}</Text>
            <Text>Website Upload: {item.websiteUpload}</Text>
          </View>
        )}
      />
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
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
*/