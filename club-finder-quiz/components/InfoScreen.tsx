
import React, { useState } from 'react';
import { UserInfo } from '../types';

interface InfoScreenProps {
    onSubmit: (userInfo: UserInfo) => void;
    isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const InfoScreen: React.FC<InfoScreenProps> = ({ onSubmit, isLoading }) => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        major: '',
        studentId: '',
        phone: '',
    });
    const [agree, setAgree] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = userInfo.name && userInfo.major && userInfo.studentId && userInfo.phone && agree;

    const handleClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading && isFormValid) {
            onSubmit({ ...userInfo, agree });
        }
    };

    return (
        <div className="p-8 animate-fadeIn">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-500 mb-2">경품 이벤트 참여 🎁</h2>
                <p className="text-slate-500 leading-relaxed">
                    간단한 정보를 입력하고<br/>푸짐한 선물의 주인공이 되어보세요!
                </p>
            </div>
            
            <form onSubmit={handleClick}>
                <div className="space-y-4 mb-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="이름"
                        value={userInfo.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        required
                    />
                    <input
                        type="text"
                        name="major"
                        placeholder="학과"
                        value={userInfo.major}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        required
                    />
                    <input
                        type="text"
                        name="studentId"
                        placeholder="학번 (예: 24학번)"
                        value={userInfo.studentId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="연락처 (010-1234-5678)"
                        value={userInfo.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        required
                    />
                </div>

                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id="agree"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
                        required
                    />
                    <label htmlFor="agree" className="ml-3 text-sm text-slate-600 cursor-pointer">
                        개인정보 수집 및 이용에 동의합니다.
                    </label>
                </div>

                <button 
                    type="submit"
                    disabled={!isFormValid || isLoading} 
                    className="w-full py-5 px-4 flex justify-center items-center gap-2 border-none rounded-2xl text-lg font-bold cursor-pointer transition-all duration-300 ease-out bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? <><LoadingSpinner /> 분석 중...</> : '경품 응모하고 결과 보기 🎯'}
                </button>
            </form>
        </div>
    );
};

export default InfoScreen;