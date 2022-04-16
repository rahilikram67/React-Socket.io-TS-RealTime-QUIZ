export interface Question {
    user: string,
    question: string,
    answers: string[],
    correct: string,
    choosen: string,
    session: number,
    imgs: string[],
    count: number
}

export interface Exam {
    [key: string]: Question[]
}
