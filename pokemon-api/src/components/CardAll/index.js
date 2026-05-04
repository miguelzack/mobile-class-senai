import React, {useEffect, useState} from "react";
import {View, Text, Image, FlatList, ActivityIndicator} from "react-native";
import api from "../../services/api";
import {styles} from "./style";

export const CardAll = () => {
    const [poke, setPoke] = useState([]);
    const [dataPoke, setDataPoke] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [typeIcons, setTypeIcons] = useState({});

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
        if (!loading) setOffset((prev) => prev + 20);
    };

    const renderFooter = () => {
        if (!loading) return null;
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
        <Text numberOfLines={1} style={styles.name}>
            {item.name}
        </Text>
        <Text style={styles.id}>
            #{String(item.id).padStart(3, "0")}
        </Text>
        <View style={styles.types}>
            {item.types.map((t) => (<Image
                key={t.type.name}
                source={{uri: typeIcons[t.type.name]}}
                style={styles.typeIcon}
            />))}
        </View>
    </View>);

    return (<View style={styles.wrapper}>
        <FlatList
            data={dataPoke}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.list}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
        />
    </View>);
};