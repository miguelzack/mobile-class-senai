import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import EmptyState from "../components/EmptyState";
import MovieCard from "../components/MovieCard";
import {
  buildQuizSuggestion,
  discoverMoviesBySuggestion,
  suggestionOptions,
  suggestionQuizQuestions,
} from "../services/tmdb";
import { colors } from "../styles/theme";

function appendUniqueMovies(currentMovies, newMovies) {
  const ids = new Set(currentMovies.map((movie) => movie.id));
  const uniqueNewMovies = newMovies.filter((movie) => !ids.has(movie.id));
  return [...currentMovies, ...uniqueNewMovies];
}

function ProgressBar({ currentStep }) {
  const percent = ((currentStep + 1) / suggestionQuizQuestions.length) * 100;

  return (
    <View style={{ marginTop: 18 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ color: colors.secondary, fontWeight: "900" }}>
          Pergunta {currentStep + 1}/{suggestionQuizQuestions.length}
        </Text>
        <Text style={{ color: colors.muted, fontWeight: "800" }}>{Math.round(percent)}%</Text>
      </View>
      <View style={{ height: 10, backgroundColor: colors.surfaceLight, borderRadius: 999, overflow: "hidden" }}>
        <View style={{ width: `${percent}%`, height: "100%", backgroundColor: colors.primary, borderRadius: 999 }} />
      </View>
    </View>
  );
}

function QuizOption({ option, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(option)}
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 22,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Text style={{ fontSize: 34 }}>{option.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontSize: 17, fontWeight: "900" }}>{option.title}</Text>
          <Text style={{ color: colors.muted, marginTop: 4, lineHeight: 19 }}>{option.subtitle}</Text>
        </View>
        <Text style={{ color: colors.primary, fontSize: 24, fontWeight: "900" }}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SuggestionsScreen({ navigation, route }) {
  const [mode, setMode] = useState("quiz");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const totalXp = useMemo(
    () => suggestionQuizQuestions.reduce((sum, question) => sum + question.xp, 0),
    []
  );

  async function loadSuggestionPage(option, pageToLoad = 1, replace = false) {
    try {
      if (replace) {
        setErrorMessage("");
        setMovies([]);
        setLoadingInitial(true);
      } else {
        setLoadingMore(true);
      }

      const data = await discoverMoviesBySuggestion(option, pageToLoad);
      const results = data.results || [];

      setMovies((current) => (replace ? results : appendUniqueMovies(current, results)));
      setPage(pageToLoad);
      setHasMore(pageToLoad < Math.min(data.totalPages || 1, 500) && results.length > 0);

      if (replace && results.length === 0) {
        setErrorMessage("Não encontrei filmes para esse resultado. Refazer o quiz pode abrir outras combinações.");
      }
    } catch (error) {
      console.log(error);
      if (replace) {
        setMovies([]);
        setErrorMessage("Não foi possível carregar as sugestões agora.");
      }
    } finally {
      setLoadingInitial(false);
      setLoadingMore(false);
    }
  }

  function startResult(option) {
    setSelected(option);
    setMode("result");
    setPage(1);
    setHasMore(false);
    loadSuggestionPage(option, 1, true);
  }

  function handleAnswer(option) {
    const question = suggestionQuizQuestions[currentStep];
    const nextAnswers = { ...answers, [question.id]: option.id };
    setAnswers(nextAnswers);

    if (currentStep >= suggestionQuizQuestions.length - 1) {
      startResult(buildQuizSuggestion(nextAnswers));
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function handleLoadMore() {
    if (!selected || loadingInitial || loadingMore || !hasMore) return;
    loadSuggestionPage(selected, page + 1, false);
  }

  function restartQuiz() {
    setMode("quiz");
    setCurrentStep(0);
    setAnswers({});
    setSelected(null);
    setMovies([]);
    setPage(1);
    setHasMore(false);
    setLoadingInitial(false);
    setLoadingMore(false);
    setErrorMessage("");
  }

  function goBackQuestion() {
    if (currentStep === 0) return;
    const previousQuestion = suggestionQuizQuestions[currentStep];
    setAnswers((current) => {
      const updated = { ...current };
      delete updated[previousQuestion.id];
      return updated;
    });
    setCurrentStep((step) => Math.max(0, step - 1));
  }

  useEffect(() => {
    const suggestionId = route?.params?.initialSuggestionId;
    if (!suggestionId) return;

    const option = suggestionOptions.find((item) => item.id === suggestionId);
    if (option) {
      startResult(option);
    }
  }, [route?.params?.initialSuggestionId]);

  if (mode === "quiz") {
    const question = suggestionQuizQuestions[currentStep];
    const earnedXp = suggestionQuizQuestions.slice(0, currentStep).reduce((sum, item) => sum + item.xp, 0);

    return (
      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 58 }}>
        <View style={{ paddingHorizontal: 18 }}>
          <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>Quiz de sugestões 🎲</Text>
          <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 21 }}>
            Responda perguntas rápidas e o app monta uma recomendação combinando clima, companhia e ritmo.
          </Text>

          <ProgressBar currentStep={currentStep} />

          <View
            style={{
              marginTop: 18,
              backgroundColor: colors.surface,
              borderRadius: 22,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 16,
            }}
          >
            <Text style={{ color: colors.secondary, fontWeight: "900" }}>+{question.xp} XP nessa rodada</Text>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: "900", marginTop: 8 }}>{question.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{question.subtitle}</Text>
          </View>
        </View>

        <FlatList
          key="quiz-options-list"
          data={question.options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <QuizOption option={item} onPress={handleAnswer} />}
          contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={{ marginTop: 4 }}>
              <Text style={{ color: colors.muted, textAlign: "center", marginBottom: 12 }}>
                XP acumulado: {earnedXp}/{totalXp}
              </Text>

              {currentStep > 0 && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={goBackQuestion}
                  style={{
                    alignSelf: "center",
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: colors.text, fontWeight: "900" }}>Voltar pergunta</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 58 }}>
      <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>{selected?.emoji} {selected?.title}</Text>
        <Text style={{ color: colors.muted, marginTop: 6, lineHeight: 20 }}>{selected?.subtitle}</Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          <TouchableOpacity
            onPress={restartQuiz}
            activeOpacity={0.85}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "900" }}>Refazer quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => startResult(suggestionOptions[Math.floor(Math.random() * suggestionOptions.length)])}
            activeOpacity={0.85}
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "900" }}>Surpresa rápida</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loadingInitial ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={{ color: colors.muted, marginTop: 12 }}>Montando recomendações...</Text>
        </View>
      ) : (
        <FlatList
          key="suggestion-results-grid"
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <MovieCard movie={item} navigation={navigation} />}
          contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.55}
          ListEmptyComponent={
            <EmptyState title="Nada encontrado" description={errorMessage || "Refaça o quiz para tentar outra combinação."} />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 22, alignItems: "center" }}>
                <ActivityIndicator color={colors.primary} />
                <Text style={{ color: colors.muted, marginTop: 8 }}>Carregando mais sugestões...</Text>
              </View>
            ) : movies.length > 0 && !hasMore ? (
              <Text style={{ color: colors.muted, textAlign: "center", paddingVertical: 22 }}>
                Fim das sugestões por enquanto. Refaça o quiz para outro resultado.
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
}
