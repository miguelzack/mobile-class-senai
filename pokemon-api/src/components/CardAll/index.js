import React, {useEffect, useState, forwardRef, useImperativeHandle, useRef} from "react";
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

let globalPokemonList = null;
let globalTypeIcons = null;

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
        const fetchSuggestions = async () => {
            if (!debouncedQuery.trim()) {
                setSuggestions([]);
                setDropdownPosition(null);
                return;
            }

            try {
                const search = normalizeSearch(debouncedQuery);

                if (!globalPokemonList) {
                    const res = await api.get("pokemon?limit=2000");

                    globalPokemonList = res.data.results.map((p) => {
                        const id = p.url.split("/").filter(Boolean).pop();

                        return {
                            name: p.name,
                            id
                        };
                    });
                }

                const filtered = globalPokemonList
                    .filter((p) => {
                        return (
                            p.name.includes(search) ||
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
            } catch (err) {
                console.log(err);
                setSuggestions([]);
                setDropdownPosition(null);
            }
        };

        fetchSuggestions();
    }, [debouncedQuery]);

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

    useEffect(() => {
        const fetchList = async () => {
            try {
                setLoading(true);

                const res = await api.get(`pokemon?limit=20&offset=${offset}`);

                setPoke((prev) => {
                    const names = new Set(prev.map((p) => p.name));
                    const filtered = res.data.results.filter((p) => !names.has(p.name));

                    return [...prev, ...filtered];
                });
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
        if (!loading && !searching && suggestions.length === 0) {
            setOffset((prev) => prev + 20);
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

            const normalizedQuery = normalizeSearch(query);
            const res = await api.get(`pokemon/${normalizedQuery}`);

            setSearchResult(res.data);
            setSearching(true);
        } catch (err) {
            setSearchResult(null);
            setError("Pokémon não encontrado");
            setSearching(true);
        } finally {
            setSearchLoading(false);
        }
    };

    const renderFooter = () => {
        if (!loading || searching) return null;

        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="large" color="red"/>
            </View>
        );
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
                    data={searching ? [] : dataPoke}
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
                                        activeOpacity={0.8}
                                        disabled={searchLoading}
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