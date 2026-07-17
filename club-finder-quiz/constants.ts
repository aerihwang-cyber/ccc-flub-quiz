
import { Question } from './types';

export const questions: Question[] = [
    {
        question: "주말에 친구들과 만날 때, 나는?",
        answers: [
            { text: "새로운 사람들도 만나고 싶어요! 🎉", type: "extrovert" },
            { text: "친한 친구들끼리 깊은 대화를 나누고 싶어요 💭", type: "introvert" }
        ]
    },
    {
        question: "동아리 활동을 선택할 때 중요한 건?",
        answers: [
            { text: "함께 성장하고 의미 있는 활동을 하는 것! 🌱", type: "meaningful" },
            { text: "재미있고 즐거운 분위기! 🎊", type: "fun" }
        ]
    },
    {
        question: "어려운 일이 생겼을 때, 나는?",
        answers: [
            { text: "혼자 곰곰이 생각해보는 편이에요 🤔", type: "thoughtful" },
            { text: "주변 사람들과 이야기하며 해결책을 찾아요 💬", type: "social" }
        ]
    },
    {
        question: "동아리에서 하고 싶은 역할은?",
        answers: [
            { text: "리더십을 발휘하며 이끄는 역할! 👑", type: "leader" },
            { text: "든든하게 서포트하는 역할! 🤝", type: "supporter" }
        ]
    },
    {
        question: "대학 생활에서 가장 중요하게 생각하는 건?",
        answers: [
            { text: "인생의 가치와 방향을 찾는 것 🧭", type: "value" },
            { text: "다양한 경험과 추억 만들기 📸", type: "experience" }
        ]
    }
];
