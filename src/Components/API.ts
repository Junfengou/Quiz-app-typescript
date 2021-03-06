import {shuffleArray} from "./utils"

export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
}

export type QuestionState = Question & { answers: string[] };

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
}

export const fetchQuizQuestions = async (amount: number, difficulty: Difficulty) => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=15&type=multiple`;
    const data = await (await fetch(endpoint)).json(); //first await will fetch the data, second await will convert the data into json
    console.log(data);
    return data.results.map((question: Question) => (
        {...question, answers: shuffleArray([...question.incorrect_answers, question.correct_answer]) } //shuffleArray is just a sorting method
    ))
}