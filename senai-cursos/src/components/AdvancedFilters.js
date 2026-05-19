import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  Modal,
  Portal,
  Searchbar,
  Text,
} from 'react-native-paper';
import { courseAreas, courseLevels, ratingFilters, sortOptions } from '../data/coursesSeed';
import { teacherNames } from '../data/schoolInfo';
import { colors } from '../styles/colors';

function ChipGroup({
  title,
  helper,
  options,
  selectedValue,
  onChange,
  getLabel = (item) => item,
  getValue = (item) => item,
}) {
  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <Text style={styles.groupTitle}>{title}</Text>
        {helper ? <Text style={styles.groupHelper}>{helper}</Text> : null}
      </View>

      <View style={styles.chipGrid}>
        {options.map((option) => {
          const value = getValue(option);
          const selected = value === selectedValue;

          return (
            <Chip
              key={`${title}-${value}`}
              selected={selected}
              showSelectedOverlay={false}
              mode={selected ? 'flat' : 'outlined'}
              onPress={() => onChange(value)}
              style={[styles.chip, selected && styles.selectedChip]}
              textStyle={[styles.chipText, selected && styles.selectedChipText]}
            >
              {getLabel(option)}
            </Chip>
          );
        })}
      </View>
    </View>
  );
}

export default function AdvancedFilters({
  search,
  selectedArea,
  selectedLevel,
  selectedTeacher,
  minRating,
  sortBy,
  onSearchChange,
  onAreaChange,
  onLevelChange,
  onTeacherChange,
  onRatingChange,
  onSortChange,
  onClearFilters,
}) {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [localSearch, setLocalSearch] = useState(search || '');

  useEffect(() => {
    setLocalSearch(search || '');
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((search || '') !== localSearch) {
        onSearchChange(localSearch);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, search]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (localSearch.trim()) count += 1;
    if (selectedArea !== 'Todos') count += 1;
    if (selectedLevel !== 'Todos') count += 1;
    if (selectedTeacher !== 'Todos') count += 1;
    if (Number(minRating) > 0) count += 1;
    if (sortBy !== 'rating') count += 1;

    return count;
  }, [localSearch, selectedArea, selectedLevel, selectedTeacher, minRating, sortBy]);

  const filterSummary = useMemo(() => {
    if (activeFilterCount === 0) return 'Nenhum filtro aplicado';
    if (activeFilterCount === 1) return '1 filtro aplicado';
    return `${activeFilterCount} filtros aplicados`;
  }, [activeFilterCount]);

  function handleClearFilters() {
    setLocalSearch('');
    onClearFilters();
  }

  function handleOpenFilters() {
    Keyboard.dismiss();
    setFiltersVisible(true);
  }

  function handleFinishFilters() {
    Keyboard.dismiss();
    setFiltersVisible(false);
  }

  function handleSubmitSearch() {
    onSearchChange(localSearch);
    Keyboard.dismiss();
  }

  return (
    <>
      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <View style={styles.topRow}>
            <View style={styles.topTextBox}>
              <Text variant="titleMedium" style={styles.title}>
                Encontre seu curso
              </Text>
              <Text style={styles.subtitle}>
                Pesquise pelo nome do curso ou abra os filtros avançados quando quiser refinar os resultados.
              </Text>
            </View>
          </View>

          <Searchbar
            placeholder="Buscar curso, área, nível ou professor"
            value={localSearch}
            onChangeText={setLocalSearch}
            onSubmitEditing={handleSubmitSearch}
            blurOnSubmit={false}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
          />

          <View style={styles.filterActionRow}>
            <View style={styles.filterSummaryBox}>
              <Text style={styles.filterSummaryLabel}>Filtros</Text>
              <Text style={styles.filterSummaryText}>{filterSummary}</Text>
            </View>

            <View style={styles.actionButtons}>
              {activeFilterCount > 0 ? (
                <Button
                  compact
                  mode="text"
                  onPress={handleClearFilters}
                  textColor={colors.muted}
                  icon="filter-remove-outline"
                >
                  Limpar
                </Button>
              ) : null}

              <Button
                mode="contained"
                icon="filter-variant"
                onPress={handleOpenFilters}
                style={styles.openFilterButton}
                contentStyle={styles.openFilterButtonContent}
              >
                Filtros
              </Button>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={filtersVisible}
          dismissable={false}
          dismissableBackButton={false}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleBox}>
              <Text variant="titleLarge" style={styles.modalTitle}>
                Filtros avançados
              </Text>
              <Text style={styles.modalSubtitle}>
                Escolha os critérios desejados. Esta janela só fecha ao tocar em “Filtro concluído”.
              </Text>
            </View>
          </View>

          <Divider style={styles.modalDivider} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
          >
            <ChipGroup
              title="Área"
              helper="Filtre pela trilha principal do curso."
              options={courseAreas}
              selectedValue={selectedArea}
              onChange={onAreaChange}
            />

            <ChipGroup
              title="Nível"
              helper="Organize os cursos por nível de conhecimento."
              options={courseLevels}
              selectedValue={selectedLevel}
              onChange={onLevelChange}
            />

            <ChipGroup
              title="Professor"
              helper="Busque cursos ligados ao professor responsável."
              options={teacherNames}
              selectedValue={selectedTeacher}
              onChange={onTeacherChange}
            />

            <ChipGroup
              title="Classificação mínima"
              helper="Mostre apenas cursos com avaliação igual ou superior."
              options={ratingFilters}
              selectedValue={minRating}
              onChange={onRatingChange}
              getLabel={(item) => item.label}
              getValue={(item) => item.value}
            />

            <ChipGroup
              title="Ordenar resultados por"
              helper="Defina a forma de exibição da lista."
              options={sortOptions}
              selectedValue={sortBy}
              onChange={onSortChange}
              getLabel={(item) => item.label}
              getValue={(item) => item.value}
            />
          </ScrollView>

          <Divider style={styles.modalDivider} />

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              icon="filter-remove-outline"
              onPress={handleClearFilters}
              style={styles.modalActionButton}
            >
              Limpar filtros
            </Button>
            <Button
              mode="contained"
              icon="check-circle-outline"
              onPress={handleFinishFilters}
              style={styles.modalActionButton}
            >
              Filtro concluído
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  topTextBox: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    marginTop: 2,
    lineHeight: 19,
  },
  searchbar: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  filterActionRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  filterSummaryBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
  },
  filterSummaryLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  filterSummaryText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 2,
  },
  actionButtons: {
    alignItems: 'flex-end',
    gap: 4,
  },
  openFilterButton: {
    borderRadius: 16,
  },
  openFilterButtonContent: {
    paddingHorizontal: 4,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 30,
    paddingTop: 18,
    maxHeight: '88%',
  },
  modalHeader: {
    paddingHorizontal: 20,
  },
  modalTitleBox: {
    flex: 1,
  },
  modalTitle: {
    color: colors.text,
    fontWeight: '900',
  },
  modalSubtitle: {
    color: colors.muted,
    marginTop: 4,
    lineHeight: 19,
  },
  modalDivider: {
    marginTop: 16,
  },
  modalScroll: {
    maxHeight: 460,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  modalActionButton: {
    flex: 1,
    borderRadius: 16,
  },
  group: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F8FAFC',
  },
  groupHeader: {
    marginBottom: 10,
  },
  groupTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  groupHelper: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
});
