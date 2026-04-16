import { StyleSheet } from 'react-native';
import { theme } from '../../styles/global';

export const styles = StyleSheet.create({
  modal: { flex: 1, padding: 30, backgroundColor: theme.colors.background },

  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#DDD' },
  
  button: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 10, alignItems: 'center' }
});