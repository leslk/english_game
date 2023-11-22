<template>
<div class="gameplay-view">
  <Banner ref="banner" :showBanner="showBanner" :category="selectedQuestion && selectedQuestion.category"/>
  <template v-if="!selectedQuestion && !responseStatus">
    <h1>{{`${currentUsername}, choose your level`}}</h1>
    <div class="difficulties-container">
      <template v-for="level in difficultyLevels" :key="level">
        <div :class="['difficulties', difficultyColors(level)]" @click="$event => HandleDifficultyChoice($event)">
          <p>{{ level }}</p>
        </div>
      </template>
    </div>
  </template>
  <template v-if="selectedQuestion && !responseStatus">
    <div class="question">
      <h1 class="question-category">{{ selectedQuestion.category}}</h1>
      <h2>{{ selectedQuestion.question }}</h2>
    </div>
    <div class="answers" v-if="selectedQuestion.answers.length > 1">
      <button class="answer-button" v-for="answer in selectedQuestion.answers" :key="answer.text" @click="answerQuestion(answer)">
        {{ answer.text }}
      </button>
    </div>
    <div class="answers" v-else>
      <button class="answer-button" @click="answerQuestion()">
        Check the answer
      </button>
    </div>
  </template>
  <template v-if="responseStatus === 'correct'">
    <div>
      <h2>Good answer</h2>
      <p class="steps">{{`Step ${selectedQuestion.difficulty} ${selectedQuestion.difficulty == 1 ? 'case' : 'cases'} forward`}}</p>
    </div >
  </template>
  <template v-if="responseStatus === 'incorrect'">
    <div>
      <h2>Wrong answer</h2>
      <p class="helvetica">{{ `the answer was : ${getCorrectAnswer()}`}}</p>
      <p class="steps">{{`Step ${selectedQuestion.difficulty} ${selectedQuestion.difficulty == 1 ? 'case' : 'cases'} backward`}}</p>
    </div>
  </template>
  <button v-if="responseStatus" class="submit-button" @click="getToNextPlayer()">Next player</button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import questions from '../assets/questions.js';
import { useGameStore } from '../stores/players';
import Banner from '../components/Banner.vue';

const gameStore = useGameStore();
const banner = ref(null);
const showBanner = ref(false);

const currentUsername = computed(() => {
    return gameStore.currentPlayer.username;
});

const responseStatus = ref(null);
const choosenDifficulty = ref(0);
const selectedQuestion = ref(null);

function HandleDifficultyChoice(event) {
  choosenDifficulty.value = event.target.innerText;
  getRandomQuestion();
}

const difficultyLevels = computed(() => {
  return Array.from(new Set(questions.map(question => question.difficulty))).sort();
});

function getToNextPlayer() {
  responseStatus.value = null;
  selectedQuestion.value = null;
  showBanner.value = false;
  gameStore.switchToNextPlayer();
}

function difficultyColors(level) {
  return level == 1 ? 'easy' : level == 2 ? 'medium' : 'hard';
}

function getRandomQuestion() {
  let availableQuestions = questions.filter(
    (question) => 
      question.difficulty == choosenDifficulty.value &&
      (question.lastAnswered === null || isTimeElapsed(question.lastAnswered))
  );

  if (availableQuestions.length == 0) {
    for (let question of questions) {
      if (question.difficulty == choosenDifficulty.value) {
        question.lastAnswered = null;
      }
    }
    availableQuestions = questions.filter(
    (question) => 
      question.difficulty == choosenDifficulty.value &&
      (question.lastAnswered === null || isTimeElapsed(question.lastAnswered))
  );
  }

  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  selectedQuestion.value = availableQuestions[randomIndex];

  questions.find((q) => q.question === selectedQuestion.value.question).lastAnswered = new Date();

  return selectedQuestion;
}

function isTimeElapsed(lastAnswered) {
  const elapsedTime = new Date() - new Date(lastAnswered);
  const elapsedMinutes = elapsedTime / (1000 * 60);
  return elapsedMinutes >= 90;
}

function getCorrectAnswer() {
  const question = questions.find((q) => q.question === selectedQuestion.value.question);
  const res = question.answers.find((a) => a.correct).text;
  return res;
  
}

function answerQuestion(answer) {
  if (!answer) {
    responseStatus.value = 'correct';
    return;
  }
  const question = questions.find((q) => q.question === selectedQuestion.value.question);

  const answerIndex = question.answers.findIndex((a) => a.text === answer.text);

  if (answerIndex !== -1 && question.answers[answerIndex].correct) {
    gameStore.updatePlayerResult(selectedQuestion.value.category);
    const hasBadge = gameStore.hasEnoughPoints(selectedQuestion.value.category);
    if (hasBadge) {
      showBanner.value = true;
    }
    responseStatus.value = 'correct';
  } else {
    responseStatus.value = 'incorrect';
  }
}
</script>

<style scoped lang="scss">
.gameplay-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  max-width: 400px;
  height: 100%;
  margin: auto;
  text-align: center;
}
.difficulties-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
  .difficulties {
    font-size: 20px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: 1px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .answers {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .question-category {
    font-size: 20px;
    font-weight: bold;
    color: #F2BE22;
    padding-bottom: 20px;

  }

  .helvetica {
    font-family: 'Helvetica';
    padding-top: 20px;
  }

  .steps {
    font-size: 20px;
    font-weight: bold;
    padding-top: 20px;
  }
</style>

