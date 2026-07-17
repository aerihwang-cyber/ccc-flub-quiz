
import React from 'react';
import { Question } from '../types';

interface QuestionScreenProps {
    question: Question;
    currentQuestion: number;
    totalQuestions: number;
    onAnswer: (answerType: string) => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ question, currentQuestion, totalQuestions, onAnswer }) => {
    const progressPercentage = (currentQuestion / totalQuestions) * 100;

    return (
        <div className="animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-500 to-sky-400 p-6 text-center text-white">
                <h1 className="text-2xl font-bold">Q{currentQuestion}.</h1>
            </div>
            <div className="p-8">
                <div className="h-2 bg-blue-100 rounded-full mb-8 overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500 ease-out" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="text-2xl text-slate-800 font-bold mb-10 text-center leading-relaxed">
                    {question.question}
                </div>
                <div className="space-y-4">
                    {question.answers.map((answer, index) => (
                        <button 
                            key={index}
                            className="w-full py-5 px-5 border-2 border-slate-200 rounded-2xl text-base font-bold cursor-pointer transition-all duration-300 ease-out text-slate-700 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-500 hover:scale-105 active:scale-95"
                            onClick={() => onAnswer(answer.type)}
                        >
                            {answer.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionScreen;