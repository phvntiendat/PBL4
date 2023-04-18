import { createContext, useContext, useReducer } from 'react';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const INITIAL_STATE = {
        chatId: 'null',
        user: {},
    };
    // Use React Reducer => Prevent having to pass chilren between components
    const chatReducer = (state, action) => {
        switch (action.type) {
            case 'CHANGE_USER':
                return {
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.userRef
                            ? currentUser.uid + action.payload.userRef
                            : action.payload.userRef + currentUser.uid,
                };
            case 'CLEAR_USER':
                return {
                    user: {},
                    chatId: 'null',
                };

            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return <ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>;
};
