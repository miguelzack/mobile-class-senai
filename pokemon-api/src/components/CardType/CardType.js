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
    TouchableOpacity,
    FlatList
} from "react-native";
import {KeyboardAwareFlatList} from "react-native-keyboard-aware-scroll-view";
import api from "../../services/api";
import {styles} from "./style";

let typeCache = {};
let globalTypeIcons = null;

export const CardType = forwardRef(({headerComponent, type, typeLabel, onLoadingChange}, ref) => {
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
    const [dropdownPosition, setDropdownPosition] = useState(null);

    const rootRef = useRef(null);
    const flatListRef = useRef(null);
    const searchContainerRef = useRef(null);

    useImperativeHandle(ref, () => ({
        scrollToTop: () => {
            flatListRef.current?.scrollToOffset({offset: 0, animated: true});
        }
    }));

    const normalizeSearch = (value) => {
        return value
            .toLowerCase()
            .trim()
            .replace("#", "")
            .replace(/\s+/g, "-");
    };

    const measureDropdown = () => {
        requestAnimationFrame(() => {
            rootRef.current?.measureInWindow((rootX, rootY) => {
                searchContainerRef.current?.measureInWindow((x, y, width, height) => {
                    setDropdownPosition({
                        top: y - rootY + height + 4,
                        left: x - rootX,
                        width
                    });
                });
            });
        });
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setSuggestions([]);
            setDropdownPosition(null);
            return;
        }

        const search = normalizeSearch(debouncedQuery);

        const filtered = pokemons
            .filter((p) => {
                return (
                    p.name.toLowerCase().includes(search) ||
                    String(p.id).includes(search) ||
                    String(p.id).padStart(3, "0").includes(search)
                );
            })
            .slice(0, 80)
            .map((p) => ({
                name: p.name.charAt(0).toUpperCase() + p.name.slice(1),
                id: p.id
            }));

        setSuggestions(filtered);

        if (filtered.length > 0) {
            measureDropdown();
        } else {
            setDropdownPosition(null);
        }
    }, [debouncedQuery, pokemons]);

    const handleSelectSuggestion = (name) => {
        setQuery(name);
        setSuggestions([]);
        setDropdownPosition(null);
    };

    const closeSuggestions = () => {
        setSuggestions([]);
        setDropdownPosition(null);
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
        const fetchTypePokemons = async () => {
            try {
                setLoading(true);
                onLoadingChange?.(true);

                setVisible(20);
                setSearching(false);
                setSearchResult(null);
                setError("");
                setSuggestions([]);
                setDropdownPosition(null);
                setQuery("");

                if (typeCache[type]) {
                    setPokemons(typeCache[type]);
                    return;
                }

                const res = await api.get(`type/${type}`);

                const ids = res.data.pokemon
                    .map((item) => {
                        const url = item.pokemon.url;
                        return Number(url.split("/").filter(Boolean).pop());
                    })
                    .filter((id) => !Number.isNaN(id))
                    .sort((a, b) => a - b);

                const data = await fetchBatch(ids);

                typeCache[type] = data;
                setPokemons(data);
            } catch (err) {
                console.log(err);
                setPokemons([]);
                setError("Erro ao carregar tipo");
            } finally {
                setLoading(false);
                onLoadingChange?.(false);
            }
        };

        fetchTypePokemons();
    }, [type]);

    const loadMore = () => {
        if (!loading && !searching && suggestions.length === 0 && visible < pokemons.length) {
            setVisible((prev) => prev + 20);
        }
    };

    const handleSearch = async () => {
        if (!query.trim()) {
            setSearching(false);
            setSearchResult(null);
            setError("");
            closeSuggestions();
            return;
        }

        try {
            setSearchLoading(true);
            setError("");
            closeSuggestions();

            const search = normalizeSearch(query);

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

    const renderSuggestionsOverlay = () => {
        if (suggestions.length === 0 || !dropdownPosition) return null;

        return (
            <View
                style={[
                    styles.suggestionsOverlay,
                    {
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width
                    }
                ]}
            >
                <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    keyboardShouldPersistTaps="always"
                    nestedScrollEnabled
                    scrollEnabled
                    showsVerticalScrollIndicator
                    style={styles.suggestionsList}
                    contentContainerStyle={styles.suggestionsContent}
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    windowSize={5}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            style={styles.suggestionItem}
                            activeOpacity={0.75}
                            onPress={() => handleSelectSuggestion(item.name)}
                        >
                            <Text style={styles.suggestionText}>
                                {item.name}
                            </Text>

                            <Text style={styles.suggestionId}>
                                #{String(item.id).padStart(3, "0")}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        );
    };

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
        <View ref={rootRef} style={{flex: 1}}>
            <View style={styles.wrapper}>
                <KeyboardAwareFlatList
                    innerRef={(ref) => (flatListRef.current = ref)}
                    data={searching ? [] : pokemons.slice(0, visible)}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    columnWrapperStyle={styles.columnWrapper}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid
                    extraScrollHeight={120}
                    removeClippedSubviews={false}
                    nestedScrollEnabled
                    scrollEnabled={suggestions.length === 0}
                    onScrollBeginDrag={closeSuggestions}
                    ListHeaderComponent={
                        <>
                            {headerComponent && headerComponent()}

                            <View style={styles.typeTitleContainer}>
                                <Text style={styles.typeTitle}>
                                    Tipo {typeLabel}
                                </Text>
                            </View>

                            <View style={styles.searchArea}>
                                <View
                                    ref={searchContainerRef}
                                    style={styles.searchContainer}
                                    onLayout={measureDropdown}
                                >
                                    <TextInput
                                        placeholder="Nome ou número"
                                        placeholderTextColor="#999"
                                        style={styles.searchInput}
                                        value={query}
                                        onFocus={measureDropdown}
                                        onChangeText={(text) => {
                                            setQuery(text);
                                            measureDropdown();
                                        }}
                                    />

                                    <TouchableOpacity
                                        style={styles.searchButton}
                                        onPress={handleSearch}
                                        disabled={searchLoading || loading}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.searchButtonText}>
                                            Buscar
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {searching && renderSearchResult()}
                        </>
                    }
                />
            </View>

            {renderSuggestionsOverlay()}

            {searchLoading && (
                <View style={styles.loadingOverlay} pointerEvents="auto">
                    <ActivityIndicator size="large" color="red"/>
                </View>
            )}
        </View>
    );
});