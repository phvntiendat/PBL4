import Message from './Message';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import ScrollToBottom from 'react-scroll-to-bottom';
import { ChatContext } from '../context/ChatContext';
import { useContext } from 'react';
import { db } from '../firebase/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import SelfMessage from './SelfMessage';
function Chatbox({ showSearch }) {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'messages', data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unSub();
        };
    }, [data.chatId]);

    return (
        <React.Fragment>
            {/* <button onClick={handleDeleteChat}>temp delete chat conv button no CSS</button> */}
            <CSSTransition in={showSearch} timeout={200} classNames="modal" unmountOnExit>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="fixed top-[68px] z-10 px-6 rounded-br-xl h-9 py-6 text-white bg-black bg-opacity-60 focus: outline-none focus:border-gray-600"
                    type="text"
                    placeholder="Search Messages"
                />
            </CSSTransition>

            <ScrollToBottom className="bg-gray-200 py-2 shadow-[inset_0_0_30px_rgba(0,0,0,0.2)] h-full overflow-scroll overflow-x-hidden ">
                {messages.map((m) =>
                    m.senderId !== currentUser.uid ? (
                        <Message search={search} message={m} key={m.id} />
                    ) : (
                        <SelfMessage search={search} message={m} key={m.id} />
                    ),
                )}
            </ScrollToBottom>
        </React.Fragment>
    );
}

export default Chatbox;
