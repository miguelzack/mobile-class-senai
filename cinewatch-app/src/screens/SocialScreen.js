import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';
import MovieCard from '../components/MovieCard';
import { useMovies } from '../contexts/MovieContext';
import { followUser, listFeed, listFriends, recommendMovieToFriend, searchProfiles, unfollowUser, calculateCompatibility } from '../services/socialService';
import { colors } from '../styles/theme';

function Avatar({ profile }) { return profile?.avatar_url ? <Image source={{ uri: profile.avatar_url }} style={{ width: 46, height: 46, borderRadius: 23 }} /> : <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.text, fontWeight: '900' }}>{(profile?.username || '?').slice(0,1).toUpperCase()}</Text></View>; }
function FeedText({ item }) { const name = item.profiles?.full_name || item.profiles?.username || 'Alguém'; const title = item.movie?.title || item.payload?.movie?.title || 'um filme'; const verbs = { watched: 'assistiu', favorite: 'favoritou', like: 'curtiu', dislike: 'não curtiu', review: 'avaliou', watching: 'começou a assistir', abandoned: 'abandonou' }; return <Text style={{ color: colors.text, fontWeight: '800' }}>{name} {verbs[item.type] || 'interagiu com'} {title}</Text>; }

export default function SocialScreen({ navigation }) {
  const { state } = useMovies();
  const [tab, setTab] = useState('feed');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [feed, setFeed] = useState([]);

  async function load() { try { setFriends(await listFriends()); setFeed(await listFeed()); } catch (e) { console.log(e); } }
  useFocusEffect(useCallback(() => { load(); }, []));
  async function search() { try { setResults(await searchProfiles(query)); } catch (e) { Alert.alert('Erro', e.message); } }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 58 }}>
      <View style={{ paddingHorizontal: 18 }}><Text style={{ color: colors.text, fontSize: 30, fontWeight: '900' }}>Social</Text><Text style={{ color: colors.muted, marginTop: 6 }}>Siga amigos, veja atividades, curta reviews e recomende filmes.</Text><View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}><AppButton title="Feed" small variant={tab === 'feed' ? 'primary' : 'ghost'} onPress={() => setTab('feed')} /><AppButton title="Amigos" small variant={tab === 'friends' ? 'primary' : 'ghost'} onPress={() => setTab('friends')} /><AppButton title="Buscar" small variant={tab === 'search' ? 'primary' : 'ghost'} onPress={() => setTab('search')} /></View></View>
      {tab === 'search' && <View style={{ padding: 18 }}><TextInput value={query} onChangeText={setQuery} placeholder="Buscar por nome ou usuário..." placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14 }} /><AppButton title="Pesquisar" onPress={search} style={{ marginTop: 10 }} />{results.map((profile) => <View key={profile.id} style={{ backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 14, marginTop: 12, flexDirection: 'row', gap: 12, alignItems: 'center' }}><Avatar profile={profile} /><View style={{ flex: 1 }}><Text style={{ color: colors.text, fontWeight: '900' }}>{profile.full_name || profile.username}</Text><Text style={{ color: colors.muted }}>@{profile.username}</Text></View><AppButton title="Seguir" small onPress={() => followUser(profile.id).then(load)} /></View>)}</View>}
      {tab === 'friends' && <FlatList data={friends} keyExtractor={(item) => item.id} contentContainerStyle={{ padding: 18, paddingBottom: 150 }} ListEmptyComponent={<EmptyState title="Nenhum amigo ainda" description="Busque usuários e comece a seguir." />} renderItem={({ item }) => <View style={{ backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 12, flexDirection: 'row', gap: 12, alignItems: 'center' }}><Avatar profile={item} /><View style={{ flex: 1 }}><Text style={{ color: colors.text, fontWeight: '900' }}>{item.full_name || item.username}</Text><Text style={{ color: colors.muted }}>Compatibilidade estimada: {calculateCompatibility(state, {})}%</Text></View><AppButton title="Deixar" small variant="ghost" onPress={() => unfollowUser(item.id).then(load)} /></View>} />}
      {tab === 'feed' && <FlatList data={feed} keyExtractor={(item) => item.id} contentContainerStyle={{ padding: 18, paddingBottom: 150 }} ListEmptyComponent={<EmptyState title="Feed vazio" description="Siga amigos ou publique reviews para movimentar o feed." />} renderItem={({ item }) => <View style={{ backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 12 }}><View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Avatar profile={item.profiles} /><View style={{ flex: 1 }}><FeedText item={item} /><Text style={{ color: colors.muted, marginTop: 4 }}>{new Date(item.created_at).toLocaleString('pt-BR')}</Text></View></View>{item.movie && <View style={{ marginTop: 12 }}><MovieCard movie={item.movie} navigation={navigation} listMode /></View>}</View>} />}
    </View>
  );
}
