import { StyleSheet } from 'react-native';
import { theme } from '../../styles/global';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    elevation: 2, // Sombra no Android
  },
  title: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textMain },
  desc: { fontSize: 13, color: theme.colors.textSub },
  priority: { fontSize: 11, fontWeight: 'bold', marginTop: 5 }
});