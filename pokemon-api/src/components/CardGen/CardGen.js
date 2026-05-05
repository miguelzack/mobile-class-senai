import React, {
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle,
    useRef
} from "react";
import {
    View,
    Text,
    Image,
    ActivityIndicator,
    TextInput,
    TouchableOpacity
} from "react-native";
import {KeyboardAwareFlatList} from "react-native-keyboard-aware-scroll-view";
import api from "../../services/api";
import {styles} from "./style";

let generationCache = {};
let globalTypeIcons = null;

export const CardGen = forwardRef(({headerComponent, generation, onLoadingChange}, ref) => {
    const [pokemons, setPokemons] = useState([]);
    const [visible, setVisible] = useState(20);
    const [loading, setLoading] = useState(false);
    const [typeIcons, setTypeIcons] = useState({});

    const [query, setQuery] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);

    const [suggestions, setSuggestions] = useState([]);
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const flatListRef = useRef(null);

    useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        }
    }));

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setSuggestions([]);
            return;
        }

        const search = debouncedQuery.toLowerCase().trim();

        const filtered = pokemons
            .filter((p) => {
                return (
                    p.name.toLowerCase().includes(search) ||
                    String(p.id).includes(search) ||
                    String(p.id).padStart(3, "0").includes(search)
                );
            })
            .slice(0, 8)
            .map((p) => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1)
            }));

        setSuggestions(filtered);
    }, [debouncedQuery, pokemons]);

    const handleSelectSuggestion = (name) => {
        setQuery(name);
        setSuggestions([]);
    };

    useEffect(() => {
        const fetchTypes = async () => {
            if (globalTypeIcons) {
                setTypeIcons(globalTypeIcons);
                return;
            }

            try {
                const res = await api.get("type");

                const responses = await Promise.all(
                    res.data.results.map((t) => api.get(t.url))
                );

                const icons = {};

                responses.forEach((res) => {
                    const typeName = res.data.name;
                    const icon = res.data.sprites?.["generation-viii"]?.["sword-shield"]?.name_icon;
                    icons[typeName] = icon;
                });

                globalTypeIcons = icons;
                setTypeIcons(icons);
            } catch (err) {
                console.log(err);
            }
        };

        fetchTypes();
    }, []);

    const fetchBatch = async (ids, batchSize = 20) => {
        let results = [];

        for (let i = 0; i < ids.length; i += batchSize) {
            const batch = ids.slice(i, i + batchSize);

            const responses = await Promise.all(
                batch.map((id) => api.get(`pokemon/${id}`))
            );

            results = [...results, ...responses.map((res) => res.data)];
        }

        return results;
    };

    useEffect(() => {
        const fetchGeneration = async () => {
            try {
                setLoading(true);
                onLoadingChange?.(true);

                setVisible(20);
                setSearching(false);
                setSearchResult(null);
                setError("");
                setSuggestions([]);
                setQuery("");

                if (generationCache[generation]) {
                    setPokemons(generationCache[generation]);
                    return;
                }

                const res = await api.get(`generation/${generation}`);

                const ids = res.data.pokemon_species
                    .map((p) => Number(p.url.split("/").filter(Boolean).pop()))
                    .sort((a, b) => a - b);

                const data = await fetchBatch(ids);

                generationCache[generation] = data;
                setPokemons(data);
            } catch (err) {
                console.log(err);
                setPokemons([]);
                setError("Erro ao carregar geração");
            } finally {
                setLoading(false);
                onLoadingChange?.(false);
            }
        };

        fetchGeneration();
    }, [generation]);

    const loadMore = () => {
        if (!loading && !searching && visible < pokemons.length) {
            setVisible((prev) => prev + 20);
        }
    };

    const handleSearch = async () => {
        if (!query.trim()) {
            setSearching(false);
            setSearchResult(null);
            setError("");
            setSuggestions([]);
            return;
        }

        try {
            setSearchLoading(true);
            setError("");

            const search = query.toLowerCase().trim().replace("#", "");

            const found = pokemons.find((p) => {
                return (
                    p.name.toLowerCase() === search ||
                    String(p.id) === search ||
                    String(p.id).padStart(3, "0") === search
                );
            });

            setSearching(true);
            setSearchResult(found || null);

            if (!found) {
                setError("Pokémon não encontrado");
            }

            setSuggestions([]);

            flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        } catch (err) {
            setError("Pokémon não encontrado");
            setSearching(true);
        } finally {
            setSearchLoading(false);
        }
    };

    const renderFooter = () => {
        if (loading) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="large" color="red"/>
                </View>
            );
        }

        return null;
    };

    const renderItem = ({item}) => (
        <View style={styles.card}>
            <Image
                style={styles.image}
                source={{
                    uri: item.sprites?.other?.["official-artwork"]?.front_default || item.sprites?.front_default
                }}
            />

            <Text numberOfLines={1} style={styles.name}>
                {item.name}
            </Text>

            <Text style={styles.id}>
                #{String(item.id).padStart(3, "0")}
            </Text>

            <View style={styles.types}>
                {item.types.map((t) => (
                    <Image
                        key={t.type.name}
                        source={{uri: typeIcons[t.type.name]}}
                        style={styles.typeIcon}
                    />
                ))}
            </View>
        </View>
    );

    const renderSearchResult = () => {
        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        }

        if (!searchResult) return null;

        return (
            <View style={styles.searchCard}>
                <Image
                    style={styles.searchImage}
                    source={{
                        uri:
                            searchResult.sprites?.other?.["official-artwork"]?.front_default ||
                            searchResult.sprites?.front_default
                    }}
                />

                <Text style={styles.searchName}>
                    {searchResult.name}
                </Text>

                <Text style={styles.searchId}>
                    #{String(searchResult.id).padStart(3, "0")}
                </Text>

                <View style={styles.types}>
                    {searchResult.types.map((t) => (
                        <Image
                            key={t.type.name}
                            source={{uri: typeIcons[t.type.name]}}
                            style={styles.typeIcon}
                        />
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={{flex: 1}}>
            <View style={styles.wrapper}>
                <KeyboardAwareFlatList
                    innerRef={(ref) => (flatListRef.current = ref)}
                    data={searching ? [] : pokemons.slice(0, visible)}
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
                    ListHeaderComponent={
                        <>
                            {headerComponent && headerComponent()}

                            <View style={styles.generationTitleContainer}>
                                <Text style={styles.generationTitle}>
                                    Geração {generation}
                                </Text>
                            </View>

                            <View style={styles.searchContainer}>
                                <TextInput
                                    placeholder="Nome ou número"
                                    placeholderTextColor="#999"
                                    style={styles.searchInput}
                                    value={query}
                                    onChangeText={setQuery}
                                />

                                <TouchableOpacity
                                    style={styles.searchButton}
                                    onPress={handleSearch}
                                    disabled={searchLoading || loading}
                                >
                                    <Text style={styles.searchButtonText}>
                                        Buscar
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {suggestions.length > 0 && (
                                <View style={styles.suggestionsContainer}>
                                    {suggestions.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.suggestionItem}
                                            onPress={() => handleSelectSuggestion(item.name)}
                                        >
                                            <Text style={styles.suggestionText}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {searching && renderSearchResult()}
                        </>
                    }
                />
            </View>

            {searchLoading && (
                <View style={styles.loadingOverlay} pointerEvents="auto">
                    <ActivityIndicator size="large" color="red"/>
                </View>
            )}
        </View>
    );
});