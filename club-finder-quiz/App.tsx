import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Screen, UserInfo } from './types';
import MainScreen from './components/MainScreen';
import QuestionScreen from './components/QuestionScreen';
import InfoScreen from './components/InfoScreen';
import ResultScreen from './components/ResultScreen';
import { questions } from './constants';
import { generateCccReason } from './services/claudeService';

const FALLBACK_REASON = '다양한 경험을 원하는 당신! CCC는 캠퍼스 활동, 국내외 선교, 문화 사역 등 폭넓은 경험을 제공해요. 의미와 재미를 모두 잡을 수 있어요! 🎯';

// URL에서 campus 값을 읽는 헬퍼 (없으면 '미분류')
const getCampus = () =>
    new URLSearchParams(window.location.search).get('campus') || '미분류';

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>(Screen.Main);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [cccReason, setCccReason] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);

    // ✅ 중복 제출 방지 플래그 (같은 세션 내에서 제출은 1회만)
    const isSubmittingRef = useRef(false);
    const initRanRef = useRef(false); // StrictMode에서 useEffect 2회 실행 방지

    useEffect(() => {
        if (initRanRef.current) return;
        initRanRef.current = true;

        const initializeApp = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const name = urlParams.get('name');
            const answersStr = urlParams.get('answers');

            if (name && answersStr) {
                const answersArr = answersStr.split(',');
                setUserName(name);
                setAnswers(answersArr);
                try {
                    const reason = await generateCccReason(answersArr);
                    setCccReason(reason);
                } catch (error) {
                    console.error('Gemini API error on init:', error);
                    setCccReason(FALLBACK_REASON);
                } finally {
                    setScreen(Screen.Result);
                }
            }
            setIsInitializing(false);
        };
        initializeApp();
    }, []);

    const handleStart = () => {
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setCccReason('');
        setUserName('');
        isSubmittingRef.current = false; // 새 응시 시작 시 제출 플래그 리셋
        setScreen(Screen.Question);
    };

    const handleAnswer = (answerType: string) => {
        const newAnswers = [...answers, answerType];
        setAnswers(newAnswers);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setScreen(Screen.Info);
        }
    };

    const handleSubmit = useCallback(async (userInfo: UserInfo) => {
        // ✅ 이미 제출 중이거나 제출 완료된 경우 재전송 차단
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        setIsLoading(true);
        setUserName(userInfo.name);

        const campusName = getCampus();

        // ✅ 동일인 재제출 방지: 이름+연락처 조합으로 로컬에 기록
        const dedupeKey = `ccc-quiz-submitted:${userInfo.name}:${userInfo.phone}`;
        const alreadySubmitted = localStorage.getItem(dedupeKey);

        if (!alreadySubmitted) {
            const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdthn5lvfyCNdX9L4xTdXubxiqb0efWfuICXFlCyjlriUB2eQ/formResponse";

            const formData = new FormData();
            formData.append('entry.1347246156', userInfo.name);
            formData.append('entry.1594868746', campusName);
            formData.append('entry.710972002', userInfo.major);
            formData.append('entry.999666589', userInfo.studentId);
            formData.append('entry.791346982', userInfo.phone);
            formData.append('entry.2094986446', '동의합니다 (동아리 활동 및 연락 목적으로 이름, 전공, 학번, 연락처를 수집 및 이용하는 것에 동의)');

            try {
                await fetch(GOOGLE_FORM_ACTION_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors',
                });
                localStorage.setItem(dedupeKey, new Date().toISOString());
            } catch (error) {
                console.error('Google Form submission error:', error);
            }
        }

        try {
            const reason = await generateCccReason(answers);
            setCccReason(reason);
        } catch (error) {
            console.error('Gemini API error:', error);
            setCccReason(FALLBACK_REASON);
        } finally {
            setIsLoading(false);
            setScreen(Screen.Result);
        }
    }, [answers]);

    const handleRestart = () => {
        // ✅ name/answers만 지우고 campus 파라미터는 유지
        const campus = new URLSearchParams(window.location.search).get('campus');
        const newSearch = campus ? `?campus=${encodeURIComponent(campus)}` : '';
        window.history.pushState({}, '', window.location.pathname + newSearch);
        setScreen(Screen.Main);
    };

    const renderScreen = () => {
        switch (screen) {
            case Screen.Main:
                return <MainScreen onStart={handleStart} />;
            case Screen.Question:
                return (
                    <QuestionScreen
                        question={questions[currentQuestionIndex]}
                        currentQuestion={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        onAnswer={handleAnswer}
                    />
                );
            case Screen.Info:
                return <InfoScreen onSubmit={handleSubmit} isLoading={isLoading} />;
            case Screen.Result:
                return <ResultScreen
                    userName={userName}
                    cccReason={cccReason}
                    answers={answers}
                    onRestart={handleRestart}
                />;
            default:
                return <MainScreen onStart={handleStart} />;
        }
    };

    if (isInitializing) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-100">
                <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-4 sm:p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-blue-500/20 overflow-hidden">
                {renderScreen()}
            </div>
        </div>
    );
};

export default App;
