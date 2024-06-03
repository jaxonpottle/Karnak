// app/(tabs)/navigation.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NewCarProcessScreen from '../screens/NewCarProcessScreen';
import InputVehicleScreen from '../screens/InputVehiclesScreen';
import VehicleInspectionScreen from '../screens/VehicleInspectionScreen';
import BodyShopScreen from '../screens/BodyShopScreen';
import CarLotScreen from '../screens/CarLotScreen';
import CarDetailScreen from '../screens/CarDetailScreen';
import FindCarScreen from '../screens/FindCarScreen'; // Import the FindCarScreen

const Stack = createStackNavigator();


function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewCarProcess" component={NewCarProcessScreen} />
      <Stack.Screen name="InputVehicle" component={InputVehicleScreen} />
      <Stack.Screen name="VehicleInspection" component={VehicleInspectionScreen} />
      <Stack.Screen name="BodyShop" component={BodyShopScreen} />
      <Stack.Screen name="CarLot" component={CarLotScreen} />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} />
      <Stack.Screen name="FindCar" component={FindCarScreen} /> 
    </Stack.Navigator>
  );
}

export default Navigation;






/*import React from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';


import HomeScreen from '../screens/HomeScreen';
import NewCarProcessScreen from '../screens/NewCarProcessScreen';
import InputVehicleScreen from '../screens/InputVehiclesScreen';
import VehicleInspectionScreen from '../screens/VehicleInspectionScreen';
import BodyShopScreen from '../screens/BodyShopScreen';
import CarLotScreen from '../screens/CarLotScreen';

type RootStackParamList = {
    Home: undefined;
    NewCarProcess: undefined;
    InputVehicle: undefined;
    VehicleInspection: undefined;
    BodyShop: undefined;
    CarLot: undefined;
  };

const Stack = createStackNavigator<RootStackParamList>();

function Navigation() {
    return(
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="NewCarProcess" component={NewCarProcessScreen} />
            <Stack.Screen name="InputVehicle" component={InputVehicleScreen} />
            <Stack.Screen name="VehicleInspection" component={VehicleInspectionScreen} />
            <Stack.Screen name="BodyShop" component={BodyShopScreen} />
            <Stack.Screen name="CarLot" component={CarLotScreen} />
        </Stack.Navigator> );
}

export default Navigation;



// app/(tabs)/navigation.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import NewCarProcessScreen from '../screens/NewCarProcessScreen';
import InputVehicleScreen from '../screens/InputVehiclesScreen';
import VehicleInspectionScreen from '../screens/VehicleInspectionScreen';
import BodyShopScreen from '../screens/BodyShopScreen';
import CarLotScreen from '../screens/CarLotScreen';
import FindCarScreen from '../screens/FindCarScreen';
import CarDetailScreen from '../screens/CarDetailScreen';

type RootStackParamList = {
  Home: undefined;
  NewCarProcess: undefined;
  InputVehicle: undefined;
  VehicleInspection: undefined;
  BodyShop: undefined;
  CarLot: undefined;
  FindCar: undefined;
  CarDetail: { carId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewCarProcess" component={NewCarProcessScreen} />
      <Stack.Screen name="InputVehicle" component={InputVehicleScreen} />
      <Stack.Screen name="VehicleInspection" component={VehicleInspectionScreen} />
      <Stack.Screen name="BodyShop" component={BodyShopScreen} />
      <Stack.Screen name="CarLot" component={CarLotScreen} />
      <Stack.Screen name="FindCar" component={FindCarScreen} />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} />
    </Stack.Navigator>
  );
}

export default Navigation;
*/