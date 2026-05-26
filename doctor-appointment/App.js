import { StatusBar } from 'expo-status-bar';
import { Home } from "./src/pages/home/index"
import { SafeAreaView } from 'react-native-safe-area-context';


export default function App() {
  return (
    <SafeAreaView style={{flex: 1}} >
      <StatusBar hidden />
      <Home />
    </SafeAreaView>
  );
}
