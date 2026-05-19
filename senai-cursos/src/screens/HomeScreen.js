import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Text,
} from 'react-native-paper';
import Header from '../components/Header';
import AdvancedFilters from '../components/AdvancedFilters';
import CourseCard from '../components/CourseCard';
import CourseDetailsModal from '../components/CourseDetailsModal';
import { getCoursesByFilter, initDatabase } from '../database/database';
import { schoolInfo } from '../data/schoolInfo';
import { colors } from '../styles/colors';

export default function HomeScreen() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todos');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [selectedTeacher, setSelectedTeacher] = useState('Todos');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const totalLabel = useMemo(() => {
    if (courses.length === 1) return '1 curso encontrado';
    return `${courses.length} cursos encontrados`;
  }, [courses.length]);

  const activeFilterLabel = useMemo(() => {
    const active = [];
    if (selectedArea !== 'Todos') active.push(selectedArea);
    if (selectedLevel !== 'Todos') active.push(selectedLevel);
    if (selectedTeacher !== 'Todos') active.push(selectedTeacher);
    if (minRating > 0) active.push(`${minRating}+ estrelas`);

    return active.length ? active.join(' • ') : 'Mostrando todos os cursos';
  }, [selectedArea, selectedLevel, selectedTeacher, minRating]);

  const loadCourses = useCallback(async () => {
    try {
      setError('');
      await initDatabase();
      const data = await getCoursesByFilter({
        search,
        area: selectedArea,
        level: selectedLevel,
        teacher: selectedTeacher,
        minRating,
        sortBy,
      });
      setCourses(data);
    } catch (err) {
      console.log(err);
      setError('Não foi possível carregar os cursos do banco SQLite.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedArea, selectedLevel, selectedTeacher, minRating, sortBy]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadCourses();
  }, [loadCourses]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setSelectedArea('Todos');
    setSelectedLevel('Todos');
    setSelectedTeacher('Todos');
    setMinRating(0);
    setSortBy('rating');
  }, []);

  const listHeader = useMemo(() => (
    <>
      <Header
        title="SENAI Cursos"
        subtitle={`${schoolInfo.unitName}: trilhas de desenvolvimento, projetos, dados, mobile e nuvem.`}
      />

      <AdvancedFilters
        search={search}
        selectedArea={selectedArea}
        selectedLevel={selectedLevel}
        selectedTeacher={selectedTeacher}
        minRating={minRating}
        sortBy={sortBy}
        onSearchChange={handleSearchChange}
        onAreaChange={setSelectedArea}
        onLevelChange={setSelectedLevel}
        onTeacherChange={setSelectedTeacher}
        onRatingChange={setMinRating}
        onSortChange={setSortBy}
        onClearFilters={clearFilters}
      />

      <View style={styles.resultHeader}>
        <View style={styles.resultTextBox}>
          <Text style={styles.resultTitle}>Cursos disponíveis</Text>
          <Text style={styles.resultSubtitle}>{totalLabel}</Text>
        </View>
        <View style={styles.summaryBadge}>
          <Text style={styles.summaryBadgeText}>{activeFilterLabel}</Text>
        </View>
      </View>
    </>
  ), [
    search,
    selectedArea,
    selectedLevel,
    selectedTeacher,
    minRating,
    sortBy,
    handleSearchChange,
    clearFilters,
    totalLabel,
    activeFilterLabel,
  ]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Preparando banco...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => (
          <CourseCard course={item} onPress={() => setSelectedCourse(item)} />
        )}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              Nenhum curso encontrado
            </Text>
            <Text style={styles.emptyText}>
              Tente buscar por outro termo ou combinar filtros diferentes.
            </Text>
            <Button mode="contained-tonal" onPress={clearFilters} icon="filter-remove-outline">
              Limpar filtros
            </Button>
          </View>
        }
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CourseDetailsModal
        visible={!!selectedCourse}
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: colors.muted,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 22,
  },
  resultHeader: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resultTextBox: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: colors.text,
  },
  resultSubtitle: {
    color: colors.muted,
    marginTop: 2,
    fontWeight: '600',
  },
  summaryBadge: {
    flexShrink: 1,
    maxWidth: '52%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryBadgeText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'right',
  },
  emptyBox: {
    alignItems: 'center',
    padding: 24,
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  emptyTitle: {
    fontWeight: '900',
    color: colors.text,
  },
  emptyText: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  error: {
    color: colors.primary,
    textAlign: 'center',
    margin: 10,
    fontWeight: '700',
  },
});
