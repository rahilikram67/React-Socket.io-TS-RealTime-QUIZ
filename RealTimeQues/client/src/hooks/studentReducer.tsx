export function reducer(state: StudentReducer, action: { type: string; }) {
    switch (action.type) {
           case "join-open":
               return { ...state, join: true };
           case "join-close":
               return { ...state, join: false };
           case "wrong-open":
               return { ...state, wrong: true };
           case "wrong-close":
               return { ...state, wrong: false };
           case "connected-open":
               return { ...state, connected: true };
           case "connected-close":
               return { ...state, connected: false };
           default:
            throw new Error("Unknown action type");                         
    }
}
