
import React, { useMemo, useState, useEffect } from 'react';

// --- Confetti Component Logic ---
const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti: React.FC = () => {
    const confettiCount = 150;
    const pieces = useMemo(() => {
        const newPieces = [];
        const colors = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#ffffff'];
        for (let i = 0; i < confettiCount; i++) {
            const style: React.CSSProperties = {
                left: `${Math.random() * 100}%`,
                top: `${-20 + Math.random() * -80}%`,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${2 + Math.random() * 4}s ${Math.random() * 2}s linear forwards`,
                opacity: 1,
            };
            newPieces.push(<ConfettiPiece key={i} style={style} />);
        }
        return newPieces;
    }, []);

    return <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">{pieces}</div>;
};
// --- End Confetti ---


interface ResultScreenProps {
    userName: string;
    cccReason: string;
    onRestart: () => void;
    answers: string[];
}

const ClubItem: React.FC<{ rank: number; name: string; desc: string; style: React.CSSProperties }> = ({ rank, name, desc, style }) => (
    <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 animate-slideInUp" style={style}>
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-sky-400 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg">
                {rank}
            </div>
            <div>
                <h4 className="text-slate-800 font-bold text-base">{name}</h4>
                <p className="text-slate-500 text-sm">{desc}</p>
            </div>
        </div>
    </div>
);

interface Club {
    name: string;
    desc: string;
    tags: string[];
}

const allClubs: Club[] = [
    { name: "운동 동아리", desc: "건강한 몸과 마음, 함께 땀 흘리며 스트레스를 날려요", tags: ["extrovert", "social", "fun", "experience", "leader"] },
    { name: "여행 동아리", desc: "새로운 곳에서의 발견, 함께 떠나는 설레는 여정", tags: ["extrovert", "social", "experience", "fun"] },
    { name: "봉사 동아리", desc: "따뜻한 마음을 나누며 세상을 바꾸는 작은 움직임", tags: ["meaningful", "value", "supporter", "social", "thoughtful"] },
    { name: "시사 토론 동아리", desc: "세상을 보는 넓은 시야, 논리적인 생각의 힘을 키워요", tags: ["thoughtful", "value", "leader", "introvert"] },
    { name: "사진 동아리", desc: "세상의 아름다운 순간을 나만의 시선으로 담아보세요", tags: ["thoughtful", "experience", "introvert", "supporter"] },
    { name: "미술/전시 관람 동아리", desc: "일상의 감성을 채우는 예술, 함께 보고 이야기 나눠요", tags: ["introvert", "thoughtful", "experience"] },
];

const getRecommendedClubs = (userAnswers: string[]): Club[] => {
    const scoredClubs = allClubs.map(club => {
        const score = club.tags.reduce((acc, tag) => acc + (userAnswers.includes(tag) ? 1 : 0), 0);
        return { ...club, score };
    });
    scoredClubs.sort(() => Math.random() - 0.5); 
    scoredClubs.sort((a, b) => b.score - a.score);
    return scoredClubs.slice(0, 2);
};

const ResultScreen: React.FC<ResultScreenProps> = ({ userName, cccReason, onRestart, answers }) => {
    const [showCopyMessage, setShowCopyMessage] = useState(false);
    const recommendedClubs = useMemo(() => getRecommendedClubs(answers), [answers]);
    
    const learnMoreCCC = () => window.open('https://litt.ly/ccc_nfc', '_blank');

    const handleShare = async () => {
        const url = new URL(window.location.href);
        const nameParam = userName || '친구';
        url.search = `?name=${encodeURIComponent(nameParam)}&answers=${answers.join(',')}`;
        const shareUrl = url.toString();
        const shareTitle = `${nameParam}님에게 딱 맞는 동아리 추천 결과!`;
        const shareText = 'AI가 내 성향을 분석해줬어! 너도 한번 해봐! 👀';

        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
            } catch (error) {
                console.error('Share failed:', error);
            }
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setShowCopyMessage(true);
                setTimeout(() => setShowCopyMessage(false), 2000);
            });
        }
    };

    return (
        <div className="relative overflow-hidden">
            <Confetti />
            <div className="p-8">
                <div className="text-center mb-6 animate-slideInUp">
                    <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-sky-400 mb-2">
                        {userName ? `${userName}님을 위한` : '당신을 위한'}
                    </h2>
                    <p className="text-slate-600 text-lg">최고의 동아리를 찾았어요!</p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-6 rounded-2xl text-white mb-6 text-center shadow-2xl shadow-blue-500/40 animate-slideInUp" style={{ animationDelay: '150ms' }}>
                    <div className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-xs font-bold mb-3 tracking-wider ring-1 ring-white/20">🏆 1순위 추천</div>
                    <h3 className="text-3xl font-bold mb-3 drop-shadow-lg">CCC 한국대학생선교회</h3>
                    <p className="text-base leading-relaxed opacity-90">{cccReason}</p>
                </div>

                <div className="flex flex-col gap-3 mb-8 relative animate-slideInUp" style={{ animationDelay: '300ms' }}>
                     <button 
                        onClick={learnMoreCCC}
                        className="w-full py-4 px-4 text-base font-bold cursor-pointer transition-all duration-300 ease-out rounded-xl bg-blue-500 text-white border-2 border-transparent hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                    >
                        CCC 더 알아보기
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={handleShare}
                            className="w-full py-4 px-4 text-base font-bold cursor-pointer transition-all duration-300 ease-out rounded-xl bg-white text-slate-500 border-2 border-slate-200 hover:bg-slate-100 hover:border-slate-400 hover:scale-105 active:scale-95"
                        >
                            결과 공유하기 🔗
                        </button>
                        <button 
                            onClick={onRestart}
                            className="w-full py-4 px-4 text-base font-bold cursor-pointer transition-all duration-300 ease-out rounded-xl bg-white text-slate-500 border-2 border-slate-200 hover:bg-slate-100 hover:border-slate-400 hover:scale-105 active:scale-95"
                        >
                            다시 하기 🔄
                        </button>
                    </div>
                    {showCopyMessage && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-3 py-1.5 rounded-full animate-fadeIn">
                            URL이 복사되었어요!
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                     <p className="text-slate-500 text-sm mb-2 text-center animate-slideInUp" style={{ animationDelay: '450ms' }}>이런 동아리도 당신과 잘 맞아요!</p>
                    {recommendedClubs.map((club, index) => (
                         <ClubItem
                            key={club.name}
                            rank={index + 2}
                            name={club.name}
                            desc={club.desc}
                            style={{ animationDelay: `${550 + index * 100}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultScreen;