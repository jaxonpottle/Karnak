// app/styles/theme.ts
import { StyleSheet } from 'react-native';

export const defaultTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    color: 'black',
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
  },
  input: {
    borderColor: 'gray',
  },
});

export const blackGoldTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
  },
  title: {
    color: 'gold',
  },
  button: {
    backgroundColor: 'gold',
    color: 'black',
  },
  input: {
    borderColor: 'gold',
  },
});

export const redBlueTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    padding: 16,
  },
  title: {
    color: 'blue',
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
  },
  input: {
    borderColor: 'blue',
  },
});
