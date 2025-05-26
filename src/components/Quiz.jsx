import { useCallback, useState } from 'react';
import QUESTIONS from '../questions.js';
import quizCompletedImage from '../assets/quiz-complete.png';
import Question from './Question.jsx';

export default function Quiz() {
  const [answerState, setAnswerState] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);

  const activeQuestionsIndex =
    answerState === '' ? userAnswers.length : userAnswers.length - 1;

  const isQuizFinished = activeQuestionsIndex === QUESTIONS.length;

  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer,
  ) {
    setAnswerState('answered');
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer];
    });

    setTimeout(() => {
      if (selectedAnswer === QUESTIONS[activeQuestionsIndex].answers[0]) {
        setAnswerState('correct');
      } else {
        setAnswerState('wrong');
      }

      setTimeout(() => {
        setAnswerState('');
      }, 2000);
    }, 1000);
  }, []);

  const handleSkipAnswer = useCallback(() => {
    handleSelectAnswer(null);
  }, [handleSelectAnswer]);

  if (isQuizFinished) {
    return (
      <div id="summary">
        <img src={quizCompletedImage} alt="Trophy icon" />
        <h2>Quiz Completed</h2>
      </div>
    );
  }

  return (
    <div id="quiz">
      <Question
        key={activeQuestionsIndex}
        questionText={QUESTIONS[activeQuestionsIndex].text}
        answers={QUESTIONS[activeQuestionsIndex].answers}
        onSelectAnswer={handleSelectAnswer}
        answerState={answerState}
        selectedAnswer={userAnswers[userAnswers.length - 1]}
        onSkipAnswer={handleSkipAnswer}
      />
    </div>
  );
}
