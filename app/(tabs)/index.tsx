// app/index.tsx
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../context/ThemeContext';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen'; // Import AdminHomeScreen
import NewCarProcessScreen from '../screens/NewCarProcessScreen';
import InputVehicleScreen from '../screens/InputVehiclesScreen';
import VehicleInspectionScreen from '../screens/VehicleInspectionScreen';
import BodyShopScreen from '../screens/BodyShopScreen';
import CarLotScreen from '../screens/CarLotScreen';
import CarDetailScreen from '../screens/CarDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import FindCarScreen from '../screens/FindCarScreen'; // Import the FindCarScreen
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen'; // Import the BarcodeScannerScreen
import { AuthProvider, AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
  app.listen(port, () => {
  console.log('Hello world listening on port', port);
});

export default function App() {
  const  role = useContext(AuthContext);

  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer independent={true}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            {role === 'superuser' || role === 'admin' ? (
              <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
            ) : (
              <Stack.Screen name="Home" component={HomeScreen} />
            )}
            <Stack.Screen name="NewCarProcess" component={NewCarProcessScreen} />
            <Stack.Screen name="InputVehicle" component={InputVehicleScreen} />
            <Stack.Screen name="VehicleInspection" component={VehicleInspectionScreen} />
            <Stack.Screen name="BodyShop" component={BodyShopScreen} />
            <Stack.Screen name="CarLot" component={CarLotScreen} />
            <Stack.Screen name="CarDetail" component={CarDetailScreen} />
            <Stack.Screen name="FindCar" component={FindCarScreen} />
            <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} /> 
            <Stack.Screen name="AdminDashboard" component={ AdminHomeScreen } /> 
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}


/*
// app/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../context/ThemeContext';
// Navigation from './navigation';
//import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NewCarProcessScreen from '../screens/NewCarProcessScreen';
import InputVehicleScreen from '../screens/InputVehiclesScreen';
import VehicleInspectionScreen from '../screens/VehicleInspectionScreen';
import BodyShopScreen from '../screens/BodyShopScreen';
import CarLotScreen from '../screens/CarLotScreen';
import CarDetailScreen from '../screens/CarDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import FindCarScreen from '../screens/FindCarScreen'; // Import the FindCarScreen
import { AuthProvider } from '../context/AuthContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>  
      <ThemeProvider>
        <NavigationContainer independent = {true}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="NewCarProcess" component={NewCarProcessScreen} />
            <Stack.Screen name="InputVehicle" component={InputVehicleScreen} />
            <Stack.Screen name="VehicleInspection" component={VehicleInspectionScreen} />
            <Stack.Screen name="BodyShop" component={BodyShopScreen} />
            <Stack.Screen name="CarLot" component={CarLotScreen} />
            <Stack.Screen name="CarDetail" component={CarDetailScreen} />
            <Stack.Screen name="FindCar" component={FindCarScreen} /> 
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
*/



// app/(tabs)/index.tsx
/*import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import NewCarProcessScreen from '../screens/NewCarProcessScreen';
import InputVehicleScreen from '../screens/InputVehiclesScreen';
import VehicleInspectionScreen from '../screens/VehicleInspectionScreen';
import BodyShopScreen from '../screens/BodyShopScreen';
import CarLotScreen from '../screens/CarLotScreen';

// Define the type for the stack's param list
type RootStackParamList = {
  Home: undefined;
  NewCarProcess: undefined;
  InputVehicle: undefined;
  VehicleInspection: undefined;
  BodyShop: undefined;
  CarLot: undefined;
};

const Stack = createStackNavigator<RootStackParamList>(); 

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewCarProcess" component={NewCarProcessScreen} />
        <Stack.Screen name="InputVehicle" component={InputVehicleScreen} />
        <Stack.Screen name="VehicleInspection" component={VehicleInspectionScreen} />
        <Stack.Screen name="BodyShop" component={BodyShopScreen} />
        <Stack.Screen name="CarLot" component={CarLotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/


// **** App component ****
/*
import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native'; 
import { Navigation } from './navigation';

export default function App() {   
  return (
      <NavigationContainer>
          <Navigation />
      </NavigationContainer>   
  ); 
}



// app/(tabs)/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './navigation';

export default function App() {
  return (
    <NavigationContainer independent = {true}>
      <Navigation />
    </NavigationContainer>
  );
}
*/