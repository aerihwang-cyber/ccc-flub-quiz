
export enum Screen {
    Main,
    Question,
    Info,
    Result,
}

export interface Answer {
    text: string;
    type: string;
}

export interface Question {
    question: string;

    answers: [Answer, Answer];
}

export interface UserInfo {
    name: string;
    major: string;
    studentId: string;
    phone: string;
    agree: boolean;
}
