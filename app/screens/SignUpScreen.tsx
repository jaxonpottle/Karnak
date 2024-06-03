import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';

type RootStackParamList = {
  AdminDashboard: undefined;
};

export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      const adminUser = await createUserWithEmailAndPassword(auth, email, password);
      const organizationId = adminUser.user.uid;
      await setDoc(doc(db, 'organizations', organizationId), {
        name: organizationName,
        admin: adminUser.user.uid,
        roles: { [adminUser.user.uid]: 'admin' },
      });
      navigation.navigate('AdminDashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Organization Name"
        value={organizationName}
        onChangeText={setOrganizationName}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
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

