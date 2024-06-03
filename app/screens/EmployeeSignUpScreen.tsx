// app/screens/EmployeeSignUpScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDocs, collection, updateDoc } from 'firebase/firestore';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';

type RootStackParamList = {
  Home: undefined;
  // other routes...
};

export default function EmployeeSignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleSignUp = async () => {
    try {
      const organizationsSnapshot = await getDocs(collection(db, 'organizations'));
      let organizationId: string | null = null;
      let role: string | null = null;

      organizationsSnapshot.forEach((doc) => {
        const organization = doc.data();
        if (organization.invitations && organization.invitations[email]?.inviteCode === inviteCode) {
          organizationId = doc.id;
          role = organization.invitations[email].role;
        }
      });

      if (organizationId && role) {
        await createUserWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { organizationId, role });
        }
        navigation.navigate('Home');
      } else {
        setError('Invalid invite code or email.');
      }
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
        placeholder="Invite Code"
        value={inviteCode}
        onChangeText={setInviteCode}
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
