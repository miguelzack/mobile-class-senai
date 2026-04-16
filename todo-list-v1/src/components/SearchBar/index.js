import { TextInput, View } from 'react-native';
import { styles } from './styles';

export default function SearchBar({value, onChangeText}) {
    return(
        <View>
            <TextInput style={styles.input}
                       placeholder="Pesquisar por título..."
                       value={value}
                       onChangeText={onChangeText}
            />
        </View>
    );
}