// app/screens/AdminHomeScreen.tsx
import React, { useState, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { defaultTheme, blackGoldTheme, redBlueTheme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

type RootStackParamList = {
  NewCarProcess: undefined;
  FindCar: undefined;
  AdminDashboard: undefined;
  // other routes...
};

export default function AdminHomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme, setTheme } = useTheme();
  const { user } = useContext(AuthContext);
  const [image, setImage] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [themeOptionsVisible, setThemeOptionsVisible] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Adjusting based on new ImagePicker response structure
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleThemeOptions = () => {
    setThemeOptionsVisible(!themeOptionsVisible);
  };

  const themeStyles = theme === 'default' ? defaultTheme :
                      theme === 'blackGold' ? blackGoldTheme : redBlueTheme;

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.container.backgroundColor }]}>
      {image && <Image source={{ uri: image }} style={styles.backgroundImage} />}
      <Text style={[styles.title, { color: themeStyles.title.color }]}>Admin Home</Text>
      <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('NewCarProcess')}>
        <Text style={styles.buttonText}>Start a New Car Process</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mainButton} onPress={() => navigation.navigate('FindCar')}>
        <Text style={styles.buttonText}>Find an Existing Car</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.themeButton} onPress={toggleMenu}>
        <Ionicons name="ios-color-palette" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AdminDashboard')}>
        <Ionicons name="person" size={24} color="white" />
      </TouchableOpacity>

      <Modal transparent={true} visible={menuVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
              <Ionicons name="close" size={32} color="gold" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={toggleThemeOptions}>
              <Text style={styles.menuItemText}>Change Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={pickImage}>
              <Text style={styles.menuItemText}>Upload Background Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent={true} visible={themeOptionsVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleThemeOptions}>
              <Ionicons name="close" size={32} color="gold" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setTheme('default')}>
              <Text style={styles.menuItemText}>Default Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setTheme('blackGold')}>
              <Text style={styles.menuItemText}>Black and Gold Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setTheme('redBlue')}>
              <Text style={styles.menuItemText}>Red and Blue Theme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  mainButton: {
    backgroundColor: 'gold',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeButton: {
    position: 'absolute',
    bottom: 30,
    right: 90,
    backgroundColor: 'gold',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'gold',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: 'black',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  menuItem: {
    backgroundColor: 'gold',
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  menuItemText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
