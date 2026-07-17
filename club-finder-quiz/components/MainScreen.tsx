import React from 'react';

interface MainScreenProps {
    onStart: () => void;
}

// 간단한 SVG 일러스트 (손상된 base64 이미지를 대체)
const WelcomeIllustration: React.FC = () => (
    <svg
        viewBox="0 0 240 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-48 h-40 mx-auto"
    >
        <circle cx="120" cy="100" r="90" fill="#DBEAFE" />
        <circle cx="120" cy="80" r="34" fill="#3B82F6" />
        <path
            d="M60 170 Q120 120 180 170"
            stroke="#3B82F6"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
        />
        <circle cx="105" cy="76" r="6" fill="white" />
        <circle cx="135" cy="76" r="6" fill="white" />
        <path
            d="M105 96 Q120 108 135 96"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
        />
        <path
            d="M40 60 L55 45 M200 60 L185 45 M120 20 L120 5"
            stroke="#93C5FD"
            strokeWidth="5"
            strokeLinecap="round"
        />
    </svg>
);

const MainScreen: React.FC<MainScreenProps> = ({ onStart }) => {
    return (
        <div className="p-8 text-center animate-fadeIn">
            <WelcomeIllustration />
            <h1 className="text-3xl font-black text-slate-800 mt-6 mb-3 leading-relaxed">
                나에게 딱 맞는<br />동아리는?
            </h1>
            <p className="text-slate-500 text-base mb-8 leading-relaxed">
                간단한 질문 몇 가지로<br />당신에게 어울리는 동아리를 찾아드려요!
            </p>
            <button
                onClick={onStart}
                className="w-full py-5 px-4 text-lg font-bold cursor-pointer transition-all duration-300 ease-out rounded-2xl bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
            >
                시작하기 🎯
            </button>
        </div>
    );
};

export default MainScreen;
