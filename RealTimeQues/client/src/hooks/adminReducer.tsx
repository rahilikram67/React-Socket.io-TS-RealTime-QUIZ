export function reducer(state: AdminReducer, action: { type: string; }) {
    let [type, value] = action.type.split("-");
    switch (type) {
        case "id":
            return { ...state, id: Number(value) };
        case "show":
            return { ...state, show: true };
        case "hide":
            return { ...state, show: false };
        case "open":
            return { ...state, open: true };
        case "close":
            return { ...state, open: false };     
        default:
            throw new Error();
    }
}
