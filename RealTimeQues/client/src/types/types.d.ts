interface Question {
    user: string,
    question: string,
    answers: string[],
    correct: string,
    choosen: string,
    session: number,
    imgs: string[],
    count: number
}

interface Exam {
    [key: string]: Question[]
}

interface StudentReducer {
    join: boolean,
    wrong: boolean,
    connected: boolean,
}

interface AdminReducer {
    id: number;
    show: boolean;
    open: boolean;
}
interface DeleteFabButton {
    data: Exam,
    dispatch: Function,
    setData: Function,
    chips: number[],
    setChips: Function,
    state: AdminReducer
}

interface Login {
    login: string,
    setLogin: Function
}