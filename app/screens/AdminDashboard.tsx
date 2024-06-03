// app/screens/AdminDashboard.tsx

// app/screens/AdminDashboard.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import * as SMS from 'expo-sms';

export default function AdminDashboard() {
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [role, setRole] = useState('worker');
  const [organizationId, setOrganizationId] = useState(''); // Fetch this from user context or state
  const [error, setError] = useState('');

  const inviteEmployee = async () => {
    try {
      const inviteCode = generateInviteCode();
      await updateDoc(doc(db, 'organizations', organizationId), {
        [`invitations.${employeeEmail}`]: { inviteCode, role },
      });
      const message = `You're invited to join the organization as a ${role}. Use this code to sign up: ${inviteCode}`;
      await SMS.sendSMSAsync(employeeEmail, message); // Use phone number in actual implementation
    } catch (err) {
      setError(err.message);
    }
  };

  const generateInviteCode = () => Math.random().toString(36).substr(2, 8);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Employee Email"
        value={employeeEmail}
        onChangeText={setEmployeeEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Role (worker/manager)"
        value={role}
        onChangeText={setRole}
      />
      <Button title="Invite Employee" onPress={inviteEmployee} />
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

/*
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import * as SMS from 'expo-sms';

export default function AdminDashboard() {
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [role, setRole] = useState('worker'); // default role
  const [organizationId, setOrganizationId] = useState(''); // Fetch this from user context or state
  const [error, setError] = useState('');

  const inviteEmployee = async () => {
    try {
      const inviteCode = generateInviteCode();
      await updateDoc(doc(db, 'organizations', organizationId), {
        [`invitations.${employeeEmail}`]: { inviteCode, role },
      });
      const message = `You're invited to join the organization as a ${role}. Use this code to sign up: ${inviteCode}`;
      await SMS.sendSMSAsync(employeeEmail, message); // Use phone number in actual implementation
    } catch (err) {
      setError(err.message);
    }
  };

  const generateInviteCode = () => Math.random().toString(36).substr(2, 8);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Employee Email"
        value={employeeEmail}
        onChangeText={setEmployeeEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Role (worker/manager)"
        value={role}
        onChangeText={setRole}
      />
      <Button title="Invite Employee" onPress={inviteEmployee} />
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
*/
