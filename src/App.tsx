import React, {useState} from 'react';
import {fetchQuizQuestions} from "./Components/API"
import QuestionCard from "./Components/QuestionCard"

import {GlobalStyle, Wrapper} from "./App.style";
// import './App.css';

//Types
import {QuestionState, Difficulty} from "./Components/API"

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

function App() {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  // console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY));
  console.log(questions)

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY); //fetch a fresh set of questions upon clicking the button

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswer([]);
    setNumber(0);
    setLoading(false);

  }

  const checkAnswer = (e : React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver)
    {
      //grab user answer from QuestionCard.tsx 
      const answer = e.currentTarget.value;
      
      //check answer against the correct value 
      const correct = questions[number].correct_answer === answer;

      //Add score if answer is correct
      if(correct) {
        setScore(prev => prev + 1);
      }

      //save answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer: answer, 
        correct: correct,
        correctAnswer: questions[number].correct_answer
      }

      setUserAnswer(prev => [...prev, answerObject])
    }
  }


  const nextQuestion = () => {
    //Move onto to the next question if not the last question
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS)
    {
      setGameOver(true);
    }
    else {
      setNumber(nextQuestion);
    }
  }

  return (
    <>
    <GlobalStyle />
    <Wrapper>
     <h1>Quiz app</h1>
     {/* this will check if the game is over or if the user is on the last question */}
     {gameOver || userAnswer.length === TOTAL_QUESTIONS ? (
       <button className="start" onClick={startTrivia}>Start</button>
     ) : null}

     {!gameOver ? (<p className="score">Score: {score} </p>) : null}
     {loading && <p>Loading Questions</p>}

      {!loading && !gameOver && (
        <QuestionCard 
        questionNum={number + 1}  
        totalQuestions={TOTAL_QUESTIONS} 
        question={questions[number].question} 
        answers={questions[number].answers}  
        userAnswer={userAnswer ? userAnswer[number] : undefined} 
        callback={checkAnswer} 
      />
     )}
    {/**
     * if the game is not over
     * if the game is not loading
     * [userAnswer.length === number + 1] don't show the button if the user haven't given an answer yet 
     * [number !== TOTAL_QUESTIONS - 1] check if the user is not on the last question
     * 
     */}
     {!gameOver && !loading && userAnswer.length === number + 1  && number !== TOTAL_QUESTIONS - 1 ? (<button className="next" onClick={nextQuestion}>Next Question</button>) : null}
     </Wrapper>
    </>
  );
}

export default App;
