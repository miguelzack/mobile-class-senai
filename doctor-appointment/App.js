import {styled} from "styled-components/native";
import {Home} from "./src/pages/home";
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "expo-status-bar";


const Status = styled.StatusBar``
const Title = styled.Text`
font-size: 30px;
`

export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar hidden/>
      <Home/>
    </SafeAreaView>
  );
}

