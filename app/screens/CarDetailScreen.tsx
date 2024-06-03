import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import CustomCheckbox from '../components/CustomCheckbox';

type RootStackParamList = {
  Home: undefined;
  CarDetail: { carId: string };
};

type Car = {
  id: string;
  vehicleName: string;
  stockNumber: string;
  dealerFolder: string;
  titleStatus: string;
  keyTag: string;
  pricing: string;
  websiteUpload: string;
  bodyRepairStatus: string;
  repairCost: string;
  inspectionStatus: string;
  carLotStatus: string;
  steps: any[];
};

export default function CarDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'CarDetail'>>();
  const { carId } = route.params;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const defaultSteps = [
    {
      title: 'Step 1: Input Vehicle into Steubenville Pike Auto',
      tasks: [
        { label: 'Give vehicle stock number.', checked: false },
        { label: 'Make gray dealer jacket folder.', checked: false },
        { label: 'Mark if we have valid PA title on folder, or get switched to PA.', checked: false },
        { label: 'Make vehicle key tag (gray) mark on folder # of keys we have.', checked: false },
        { label: 'Enter vehicle info and pricing into Lot Wizard.', checked: false },
        { label: 'Upload to website.', checked: false },
      ],
      initials: '',
      date: '',
    },
    {
      title: 'Step 2: Vehicle Mechanical Inspection',
      tasks: [
        { label: 'Look vehicle over for any major mechanical, structural, body issues.', checked: false },
        { label: 'If found STOP contact Jason.', checked: false },
        { label: 'If none found perform a PA State Inspection and Emission if necessary.', checked: false },
        { label: 'Do functional check of all vehicle accessories not covered under PA Inspection.', checked: false },
      ],
      initials: '',
      date: '',
    },
    {
      title: 'Step 3: Body Shop/Detail',
      tasks: [
        { label: 'Perform any minor body repair, any parts need over $250 contact Jason.', checked: false },
        { label: 'Detail Interior (put floor mats down).', checked: false },
        { label: 'Detail Exterior.', checked: false },
        { label: 'Place Steubenville Pike Auto license plate on front (if possible).', checked: false },
        { label: 'Place Steubenville Pike Auto sticker on front windshield lower right.', checked: false },
        { label: 'Place Steubenville Pike Auto sticker on rear bumper.', checked: false },
        { label: 'Put Steubenville Pike Auto frame on rear plate.', checked: false },
        { label: 'Deliver to Car Lot.', checked: false },
      ],
      initials: '',
      date: '',
    },
    {
      title: 'Step 4: Car Lot',
      tasks: [
        { label: 'Take pictures of vehicle behind car lot for block wall background.', checked: false },
        { label: 'Put pictures into Lot Wizard and upload to website.', checked: false },
        { label: 'Put FTC notice and vehicle info page on rear driver side window.', checked: false },
        { label: 'Park vehicle and place windshield banner in place.', checked: false },
      ],
      initials: '',
      date: '',
    },
  ];

  const [steps, setSteps] = useState(defaultSteps);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'cars', carId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const carData = docSnap.data() as Car;
          setCar(carData);
          if (carData.steps) {
            setSteps(carData.steps);
          }
        } else {
          setError('No such document!');
        }
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
    fetchCar();
  }, [carId]);

  const handleTaskToggle = (stepIndex: number, taskIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].tasks[taskIndex].checked = !newSteps[stepIndex].tasks[taskIndex].checked;
    setSteps(newSteps);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (car) {
        const docRef = doc(db, 'cars', carId);
        await updateDoc(docRef, { ...car, steps }); // Save the steps along with the car details
        navigation.navigate('Home'); // Navigate back to home screen after saving
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {car?.vehicleName && <Text style={styles.carName}>{car.vehicleName}</Text>}
      {steps.map((step, stepIndex) => (
        <View key={stepIndex} style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          {step.tasks.map((task, taskIndex) => (
            <View key={taskIndex} style={styles.taskContainer}>
              <CustomCheckbox
                value={task.checked}
                onValueChange={() => handleTaskToggle(stepIndex, taskIndex)}
              />
              <Text style={styles.taskLabel}>{task.label}</Text>
            </View>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Initials"
            value={step.initials}
            onChangeText={(text) => {
              const newSteps = [...steps];
              newSteps[stepIndex].initials = text;
              setSteps(newSteps);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={step.date}
            onChangeText={(text) => {
              const newSteps = [...steps];
              newSteps[stepIndex].date = text;
              setSteps(newSteps);
            }}
          />
        </View>
      ))}

      <Button title={saving ? 'Saving...' : 'Save Changes'} onPress={handleSave} disabled={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Adjust according to theme
  },
  carName: {
    fontSize: 24,
    color: 'gold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gold',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
    color: 'white', // Adjust according to theme
  },
  errorText: {
    color: 'red',
  },
  stepContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gold',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#222',
  },
  stepTitle: {
    fontSize: 18,
    color: 'gold',
    marginBottom: 10,
    textAlign: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  taskLabel: {
    color: 'white',
    marginLeft: 10,
  },
});




/*
// app/screens/CarDetailForm.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useRoute, RouteProp } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

type RootStackParamList = {
  CarDetailForm: { carId: string };
};

type Task = {
  label: string;
  checked: boolean;
};

type Step = {
  title: string;
  tasks: Task[];
  initials: string;
  date: string;
};

const stepsData: Step[] = [
  {
    title: "Step 1: Input Vehicle into Steubenville Pike Auto",
    tasks: [
      { label: "Give vehicle stock number.", checked: false },
      { label: "Make gray dealer jacket folder.", checked: false },
      { label: "Mark if we have valid PA title on folder, or get switched to PA.", checked: false },
      { label: "Make vehicle key tag (gray) mark on folder # of keys we have.", checked: false },
      { label: "Enter vehicle info and pricing into Lot Wizard.", checked: false },
      { label: "Upload to website.", checked: false },
    ],
    initials: '',
    date: '',
  },
  {
    title: "Step 2: Vehicle Mechanical Inspection",
    tasks: [
      { label: "Look vehicle over for any major mechanical, structural, body issues.", checked: false },
      { label: "If found STOP contact Jason.", checked: false },
      { label: "If none found perform a PA State Inspection and Emission if necessary.", checked: false },
      { label: "Do functional check of all vehicle accessories not covered under PA Inspection.", checked: false },
      { label: "Complete Vehicle Inspection Form.", checked: false },
      { label: "Delivery to Body Shop.", checked: false },
    ],
    initials: '',
    date: '',
  },
  {
    title: "Step 3: Body Shop/Detail",
    tasks: [
      { label: "Perform any minor body repair, any parts need over $250 contact Jason.", checked: false },
      { label: "Detail Interior (put floor mats down).", checked: false },
      { label: "Detail Exterior.", checked: false },
      { label: "Place Steubenville Pike Auto license plate on front (if possible).", checked: false },
      { label: "Place Steubenville Pike Auto sticker on front windshield lower right.", checked: false },
      { label: "Place Steubenville Pike Auto sticker on rear bumper.", checked: false },
      { label: "Put Steubenville Pike Auto frame on rear plate.", checked: false },
      { label: "Deliver to Car Lot.", checked: false },
    ],
    initials: '',
    date: '',
  },
  {
    title: "Step 4: Car Lot",
    tasks: [
      { label: "Take pictures of vehicle behind car lot for block wall background.", checked: false },
      { label: "Put pictures into Lot Wizard and upload to website.", checked: false },
      { label: "Put FTC notice and vehicle info page on rear driver side window.", checked: false },
      { label: "Park vehicle and place windshield banner in place.", checked: false },
    ],
    initials: '',
    date: '',
  },
];

export default function CarDetailForm() {
  const route = useRoute<RouteProp<RootStackParamList, 'CarDetailForm'>>();
  const { carId } = route.params;
  const [steps, setSteps] = useState<Step[]>(stepsData);

  const handleTaskToggle = (stepIndex: number, taskIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].tasks[taskIndex].checked = !newSteps[stepIndex].tasks[taskIndex].checked;
    setSteps(newSteps);
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'cars', carId);
      await updateDoc(docRef, { steps });
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {steps.map((step, stepIndex) => (
        <View key={stepIndex} style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          {step.tasks.map((task, taskIndex) => (
            <View key={taskIndex} style={styles.taskContainer}>
              <CheckBox
                value={task.checked}
                onValueChange={() => handleTaskToggle(stepIndex, taskIndex)}
              />
              <Text style={styles.taskLabel}>{task.label}</Text>
            </View>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Initials"
            value={step.initials}
            onChangeText={(text) => {
              const newSteps = [...steps];
              newSteps[stepIndex].initials = text;
              setSteps(newSteps);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={step.date}
            onChangeText={(text) => {
              const newSteps = [...steps];
              newSteps[stepIndex].date = text;
              setSteps(newSteps);
            }}
          />
        </View>
      ))}
      <Button title="Save Changes" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'black', // Adjust according to theme
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    color: 'gold',
    marginBottom: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  taskLabel: {
    color: 'white',
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderColor: 'gold',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    color: 'white', // Adjust according to theme
  },
});
*/


/*
// app/screens/CarDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRoute, RouteProp } from '@react-navigation/native';
import { db } from '../firebaseConfig';

type RootStackParamList = {
  CarDetail: { carId: string };
};

type Car = {
  id: string;
  vehicleName: string;
  stockNumber: string;
  dealerFolder: string;
  titleStatus: string;
  keyTag: string;
  pricing: string;
  websiteUpload: string;
  bodyRepairStatus: string;
  repairCost: string;
  inspectionStatus: string;
  carLotStatus: string;
};

export default function CarDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'CarDetail'>>();
  const { carId } = route.params;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'cars', carId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const carData = docSnap.data() as Car;
          setCar(carData);
        } else {
          setError('No such document!');
        }
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
    fetchCar();
  }, [carId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (car) {
        const docRef = doc(db, 'cars', carId);
        await updateDoc(docRef, car);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Vehicle Name"
        value={car?.vehicleName || ''}
        onChangeText={(text) => setCar(car ? { ...car, vehicleName: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Stock Number"
        value={car?.stockNumber || ''}
        onChangeText={(text) => setCar(car ? { ...car, stockNumber: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Dealer Folder"
        value={car?.dealerFolder || ''}
        onChangeText={(text) => setCar(car ? { ...car, dealerFolder: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Title Status"
        value={car?.titleStatus || ''}
        onChangeText={(text) => setCar(car ? { ...car, titleStatus: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Key Tag"
        value={car?.keyTag || ''}
        onChangeText={(text) => setCar(car ? { ...car, keyTag: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Pricing"
        value={car?.pricing || ''}
        onChangeText={(text) => setCar(car ? { ...car, pricing: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Website Upload"
        value={car?.websiteUpload || ''}
        onChangeText={(text) => setCar(car ? { ...car, websiteUpload: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Body Repair Status"
        value={car?.bodyRepairStatus || ''}
        onChangeText={(text) => setCar(car ? { ...car, bodyRepairStatus: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Repair Cost"
        value={car?.repairCost || ''}
        onChangeText={(text) => setCar(car ? { ...car, repairCost: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Inspection Status"
        value={car?.inspectionStatus || ''}
        onChangeText={(text) => setCar(car ? { ...car, inspectionStatus: text } : null)}
      />
      <TextInput
        style={styles.input}
        placeholder="Car Lot Status"
        value={car?.carLotStatus || ''}
        onChangeText={(text) => setCar(car ? { ...car, carLotStatus: text } : null)}
      />
      <Button title={saving ? 'Saving...' : 'Save Changes'} onPress={handleSave} disabled={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Adjust according to theme
  },
  input: {
    height: 40,
    borderColor: 'gold',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
    color: 'white', // Adjust according to theme
  },
  errorText: {
    color: 'red',
  },
});
*/



/*
// app/screens/CarDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the edit icon

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

export default function CarDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'CarDetail'>>();
  const { carId } = route.params;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newVehicleName, setNewVehicleName] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      try {
        const cachedCar = await AsyncStorage.getItem(`car_${carId}`);
        if (cachedCar) {
          setCar(JSON.parse(cachedCar));
          setLoading(false);
          return;
        }
        const docRef = doc(db, 'cars', carId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const carData = docSnap.data() as Car;
          setCar(carData);
          await AsyncStorage.setItem(`car_${carId}`, JSON.stringify(carData));
        } else {
          setError('No such document!');
        }
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
    fetchCar();
  }, [carId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'cars', carId);
      await updateDoc(docRef, car as Car);
      await AsyncStorage.setItem(`car_${carId}`, JSON.stringify(car));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleNameChange = async () => {
    if (car) {
      const updatedCar = { ...car, vehicleName: newVehicleName };
      setCar(updatedCar);
      setEditingName(false);
      await handleSave();
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

  if (!car) {
    return (
      <View style={styles.container}>
        <Text>No car data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {editingName ? (
          <TextInput
            style={styles.title}
            value={newVehicleName}
            onChangeText={setNewVehicleName}
            onSubmitEditing={handleNameChange}
            autoFocus
          />
        ) : (
          <Text style={styles.title}>{car.vehicleName}</Text>
        )}
        <TouchableOpacity onPress={() => setEditingName(!editingName)}>
          <Ionicons name={editingName ? "checkmark" : "pencil"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      { Add the rest of the form fields and buttons }
      <Text>Stock Number:</Text>
      <TextInput
        style={styles.input}
        value={car.stockNumber}
        onChangeText={(text) => setCar({ ...car, stockNumber: text })}
      />
      <Text>Dealer Folder:</Text>
      <TextInput
        style={styles.input}
        value={car.dealerFolder}
        onChangeText={(text) => setCar({ ...car, dealerFolder: text })}
      />
      <Text>Title Status:</Text>
      <TextInput
        style={styles.input}
        value={car.titleStatus}
        onChangeText={(text) => setCar({ ...car, titleStatus: text })}
      />
      <Text>Key Tag:</Text>
      <TextInput
        style={styles.input}
        value={car.keyTag}
        onChangeText={(text) => setCar({ ...car, keyTag: text })}
      />
      <Text>Pricing:</Text>
      <TextInput
        style={styles.input}
        value={car.pricing}
        onChangeText={(text) => setCar({ ...car, pricing: text })}
      />
      <Text>Website Upload:</Text>
      <TextInput
        style={styles.input}
        value={car.websiteUpload}
        onChangeText={(text) => setCar({ ...car, websiteUpload: text })}
      />
      <Button title={saving ? 'Saving...' : 'Save Changes'} onPress={handleSave} disabled={saving} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
  },
  errorText: {
    color: 'red',
  },
});
*/