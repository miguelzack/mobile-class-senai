import React, {useEffect, useState, forwardRef, useImperativeHandle, useRef} from "react";
import {
    View, Text, Image, ActivityIndicator, TextInput, TouchableOpacity
} from "react-native";
import {KeyboardAwareFlatList} from "react-native-keyboard-aware-scroll-view";
import api from "../../services/api";
import {styles} from "./style";

export const CardAll = forwardRef(({headerComponent}, ref) => {
    const [poke, setPoke] = useState([]);
    const [dataPoke, setDataPoke] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [typeIcons, setTypeIcons] = useState({});

    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);

    const flatListRef = useRef(null);

    useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        }
    }));

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await api.get("type");
                const responses = await Promise.all(res.data.results.map((t) => api.get(t.url)));
                const icons = {};
                responses.forEach((res) => {
                    const typeName = res.data.name;
                    const icon = res.data.sprites?.["generation-viii"]?.["sword-shield"]?.name_icon;
                    icons[typeName] = icon;
                });
                setTypeIcons(icons);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTypes();
    }, []);

    useEffect(() => {
        const fetchList = async () => {
            try {
                setLoading(true);
                const res = await api.get(`pokemon?limit=20&offset=${offset}`);
                setPoke((prev) => [...prev, ...res.data.results]);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, [offset]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const newPokes = poke.slice(dataPoke.length);
                if (newPokes.length === 0) return;
                const responses = await Promise.all(newPokes.map((p) => api.get(p.url)));
                const data = responses.map((res) => res.data);

                setDataPoke((prev) => {
                    const ids = new Set(prev.map((p) => p.id));
                    const filtered = data.filter((p) => !ids.has(p.id));
                    return [...prev, ...filtered];
                });
            } catch (err) {
                console.log(err);
            }
        };
        fetchDetails();
    }, [poke]);

    const loadMore = () => {
        if (!loading && !searching) setOffset((prev) => prev + 20);
    };

    const handleSearch = async () => {
        if (!query.trim()) {
            setSearching(false);
            setSearchResult(null);
            setError("");
            return;
        }

        try {
            setSearchLoading(true);
            setError("");

            const res = await api.get(`pokemon/${query.toLowerCase()}`);
            setSearchResult(res.data);
            setSearching(true);

            flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        } catch (err) {
            setError("Pokémon não encontrado");
            setSearching(true);
        } finally {
            setSearchLoading(false);
        }
    };

    const renderFooter = () => {
        if (!loading || searching) return null;
        return (<View style={styles.footerLoader}>
            <ActivityIndicator size="large" color="red"/>
        </View>);
    };

    const renderItem = ({item}) => (<View style={styles.card}>
        <Image
            style={styles.image}
            source={{
                uri: item.sprites?.other?.["official-artwork"]?.front_default || item.sprites?.front_default
            }}
        />
        <Text numberOfLines={1} style={styles.name}>{item.name}</Text>
        <Text style={styles.id}>#{String(item.id).padStart(3, "0")}</Text>
        <View style={styles.types}>
            {item.types.map((t) => (<Image
                key={t.type.name}
                source={{uri: typeIcons[t.type.name]}}
                style={styles.typeIcon}
            />))}
        </View>
    </View>);

    const renderSearchResult = () => {
        if (error) {
            return (<View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>);
        }

        if (!searchResult) return null;

        return (<View style={styles.searchCard}>
            <Image
                style={styles.searchImage}
                source={{
                    uri: searchResult.sprites?.other?.["official-artwork"]?.front_default
                }}
            />
            <Text style={styles.searchName}>{searchResult.name}</Text>
            <Text style={styles.searchId}>
                #{String(searchResult.id).padStart(3, "0")}
            </Text>
            <View style={styles.types}>
                {searchResult.types.map((t) => (<Image
                    key={t.type.name}
                    source={{uri: typeIcons[t.type.name]}}
                    style={styles.typeIcon}
                />))}
            </View>
        </View>);
    };

    return (<View style={{flex: 1}}>
        <View style={styles.wrapper}>
            <KeyboardAwareFlatList
                innerRef={(ref) => (flatListRef.current = ref)}
                data={searching ? [] : dataPoke}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.list}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={120}
                ListHeaderComponent={<>
                    {headerComponent && headerComponent()}

                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Nome ou número"
                            placeholderTextColor="#999"
                            style={styles.searchInput}
                            value={query}
                            onChangeText={setQuery}
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Text style={styles.searchButtonText}>Buscar</Text>
                        </TouchableOpacity>
                    </View>

                    {searching && renderSearchResult()}
                </>}
            />
        </View>

        {searchLoading && (<View style={styles.loadingOverlay} pointerEvents="auto">
            <ActivityIndicator size="large" color="red"/>
        </View>)}
    </View>);
});