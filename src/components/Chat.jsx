import Input from '../components/Input';
import Chatbox from '../components/Chatbox';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { useEffect, useState, useRef } from 'react';
import { getDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMagnifyingGlass, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase/firebase';
import { CSSTransition } from 'react-transition-group';
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { serverTimestamp } from 'firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';

import { ResponsiveContext } from '../context/ResponsiveContext';

function Chat({ handleShow }) {
    const { responsive, setResponsive } = useContext(ResponsiveContext);
    const { currentUser } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);

    const { data } = useContext(ChatContext);
    const [user, setUser] = useState(null);
    const [toggleDropdown, setToggleDropdown] = useState(false);
    const nodeRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    useEffect(() => {
        setResponsive(true);
        setUser(null);
        const getInfo = async () => {
            const docRef = doc(db, 'users', data.user.userRef);
            const docSnap = await getDoc(docRef);
            setUser(docSnap.data());
            // console.log(docSnap.data());
        };
        data.user.userRef && getInfo();
    }, [data.user.userRef]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'messages', data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unSub();
        };
    }, [data.chatId]);

    const handleDeleteChat = async () => {
        console.log('triggered');
        messages.map(async (message) => {
            let tempRef = doc(db, 'messages', data.chatId);
            let tempMessage = message;
            console.log(tempMessage.img);

            await updateDoc(tempRef, {
                messages: arrayRemove(message),
            });
            await updateDoc(tempRef, {
                messages: arrayUnion({
                    date: tempMessage.date,
                    hiddenTo: [...tempMessage.hiddenTo, currentUser.uid],
                    id: tempMessage.id,
                    img: tempMessage.img,
                    text: tempMessage.text,
                    senderId: tempMessage.senderId,
                    deleted: tempMessage.deleted,
                }),
            });
        });
        await updateDoc(doc(db, 'contacts', currentUser.uid), {
            [data.chatId + '.latestMessage']: '',
            [data.chatId + '.date']: serverTimestamp(),
        });
    };

    return (
        <div
            className={`${
                responsive ? 'fixed w-screen h-screen z-40 lg:relative lg:w-auto lg:h-auto lg:z-0' : ''
            } flex flex-col grow `}
        >
            {/* HEADER */}

            <div className="w-full py-4  px-6 h-[68px] bg-white ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <img className="w-9 h-9 bg-cover rounded-full" src={user?.photoURL} alt="" />
                        <label className="font-semibold">{user?.displayName}</label>
                    </div>
                    <div className="flex flex-row items-center justify-center gap-0 pr-10 lg:pr-0 lg:gap-3">
                        <button className="btn-icon">
                            <FontAwesomeIcon
                                onClick={() => setShowSearch(!showSearch)}
                                className="p-2 text-xl  text-black rounded-full hover:bg-black hover:text-white"
                                icon={faMagnifyingGlass}
                            />
                        </button>
                        <button className="btn-icon">
                            <FontAwesomeIcon
                                onClick={handleShow}
                                className="p-2 text-xl  text-black rounded-full hover:bg-black hover:text-white"
                                icon={faImage}
                            />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setToggleDropdown(!toggleDropdown)}
                                type="button"
                                data-dropdown-toggle="dropdown"
                                className=" btn-icon text-xl  text-black rounded-full hover:bg-black hover:text-white"
                            >
                                <FontAwesomeIcon className="" icon={faEllipsis} />
                            </button>
                            {toggleDropdown && (
                                <div class="absolute right-0 top-12 z-40 w-44  rounded divide-y divide-gray-100 shadow-xl bg-black hover:bg-gray-700">
                                    <ul class="z-40 py-1 text-sm text-gray-700 dark:text-gray-200">
                                        <li>
                                            <div
                                                onClick={() => setShowModal(!showModal)}
                                                class="cursor-pointer block py-2 px-4 hover:bg-gray-800 dark:hover:bg-gray-900 dark:hover:text-white"
                                            >
                                                Delete Conversation
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <CSSTransition in={showModal} timeout={200} nodeRef={nodeRef} classNames="modal" unmountOnExit>
                    <div className="w-full h-full bg-black bg-opacity-80 flex justify-center items-center fixed top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 z-50 ">
                        <div ref={nodeRef} className=" bg-white shadow-2xl rounded-3xl">
                            <form className="relative px-14 py-8 flex items-center flex-col">
                                <div>Confirm Conversation Deletion?</div>
                                <div className="w-full ">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteChat();
                                            setToggleDropdown(false);
                                            setShowModal(false);
                                        }}
                                        className="mr-4 font-semibold my-6 py-3 w-40 uppercase text-white rounded-3xl bg-black hover:bg-opacity-80"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setToggleDropdown(false);
                                            setShowModal(false);
                                        }}
                                        className="font-semibold my-6 py-3 w-40 uppercase text-white rounded-3xl bg-black hover:bg-opacity-80"
                                    >
                                        Close
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </CSSTransition>
            </div>

            <Chatbox showSearch={showSearch} />
            <Input />
        </div>
    );
}

export default Chat;
