import { useState } from 'react';
import { db } from '../firebase/firebase';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { collection, query, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

function Contacts() {
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const handleClick = (u) => {
        console.log(u.latestMessage);
        dispatch({ type: 'CHANGE_USER', payload: u });
    };

    useEffect(() => {
        const getContacts = async () => {
            let tempUsers = [];
            const q = query(collection(db, 'users'));
            try {
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    tempUsers.push(doc.data());
                });
                console.log(tempUsers);
                setUsers(tempUsers);
                console.log(users);
            } catch (err) {}
            const unsub = onSnapshot(doc(db, 'contacts', currentUser.uid), (doc) => {
                setContacts(doc.data());
            });

            return () => {
                unsub();
            };
        };
        currentUser.uid && getContacts();
    }, [currentUser.uid]);

    return (
        <div className="flex flex-col w-screen h-full  overflow-y-hidden lg:w-full">
            <div className="grow bg-white overflow-scroll overflow-x-hidden">
                {Object.entries(contacts)
                    ?.sort((a, b) => b[1].date - a[1].date)
                    .map((contact) =>
                        users.map(
                            (user) =>
                                user.uid === contact[1].userRef && (
                                    <div
                                        onClick={() => handleClick(contact[1])}
                                        key={uuid()}
                                        className=" my-2 ml-2 mr-1 rounded-xl cursor-pointer px-6 py-3 flex items-center gap-3 hover:bg-gray-300"
                                    >
                                        <div className="relative">
                                            <img
                                                className="w-14 h-14 bg-cover rounded-full"
                                                src={user.photoURL}
                                                alt=""
                                            />
                                            <FontAwesomeIcon
                                                className={`${
                                                    user.online ? 'text-green-500' : 'text-gray-500'
                                                } absolute -right-1 bottom-1 text-md border-2 rounded-full border-white`}
                                                icon={faCircle}
                                            />
                                        </div>
                                        <div className="grow flex flex-col">
                                            <label className="cursor-pointer max-w-[250px] whitespace-nowrap overflow-hidden font-semibold">
                                                {user.displayName}
                                            </label>
                                            <p className="max-w-[200px] lg:max-w-[250px] whitespace-nowrap overflow-x-hidden text-sm text-gray-600 ">
                                                {contact[1].latestMessage} &nbsp;
                                            </p>
                                        </div>
                                    </div>
                                ),
                        ),
                    )}
            </div>
        </div>
    );
}

export default Contacts;
