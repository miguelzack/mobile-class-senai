import api from './src/services/api'
import {global} from "./src/styles/global";
import {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {ScrollView, Text, TextInput, View, Image} from "react-native";

export default function App() {
    const [filmes, setFilmes] = useState([])
    const [pesquisa, setPesquisa] = useState("")

    useEffect(() => {
        async function carregarFilmes() {
            if (pesquisa.trim() !== "") {
                try {
                    const response = await api.get(pesquisa.replace(" ", "%20"))
                    setFilmes(response.data)
                } catch (error) {
                    console.error("Erro na requisição" + error)
                }
            } else {
                setFilmes([])
            }
        }

        carregarFilmes()
    }, [pesquisa])


    const handlePesquisa = (texto) => {
        setPesquisa(texto)
    }

    return (<SafeAreaView style={global.container}>
        <TextInput style={global.input} placeholder="Digite o nome do filme" value={pesquisa}
                   onChangeText={handlePesquisa}/>
        <Text style={global.titulo}>Resultado(s) da pesquisa</Text>
        <ScrollView>
          {filmes.map((filme) => (
              <View key={filme.show.id} style={global.card}>
                {filme.show.image && (
                    <Image
                        source={{ uri: filme.show.image.medium }}
                        style={global.imagem}
                        resizeMode="cover"
                    />
                )}

                <View style={global.infoContainer}>
                  <Text style={global.tituloFilme}>
                    {filme.show.name}
                  </Text>
                  <Text style={global.url}>
                    {filme.show.url}
                  </Text>
                </View>
              </View>
          ))}
        </ScrollView>
    </SafeAreaView>)
}