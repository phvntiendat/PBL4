import { useState } from 'react';
import { db } from '../firebase/firebase';
import {
    collection,
    query,
    orderBy,
    startAt,
    endAt,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
} from 'firebase/firestore';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function Search() {
    // Hold search content
    const [username, setUsername] = useState('');

    const [real, setReal] = useState([]);
    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        if (username !== '') {
            const q = query(
                collection(db, 'users'),
                orderBy('displayName'),
                startAt(username),
                endAt(username + '\uf8ff'),
            );
            let users = [];
            try {
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    users.push(doc.data());
                });
                console.log(users);
                setReal(users);
            } catch (err) {}
        } else {
            setReal([]);
            setUsername('');
        }
    };

    const handleKey = (e) => {
        e.code === 'Enter' && handleSearch();
    };

    const handleSelect = async (user) => {
        // Connect uid of both users and set it as an array
        setReal([]);
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, 'messages', combinedId));

            // Create new contact between 2 users if not existed
            if (!res.exists()) {
                // Create messages collection, left blank
                await setDoc(doc(db, 'messages', combinedId), { messages: [] });

                // [Nested collection] Create connection on both user ends
                await updateDoc(doc(db, 'contacts', currentUser.uid), {
                    [combinedId + '.userRef']: user.uid,
                    [combinedId + '.date']: serverTimestamp(),
                    [combinedId + '.latestMessage']: '',
                });
                // createContact(combinedId, currentUser.uid, user.uid);
                // createContact(combinedId, user.uid, currentUser.uid);

                await updateDoc(doc(db, 'contacts', user.uid), {
                    [combinedId + '.userRef']: currentUser.uid,
                    [combinedId + '.date']: serverTimestamp(),
                    [combinedId + '.latestMessage']: '',
                });
            }
        } catch (err) {}

        // Clear search and targeted user
        // setUser(null);
        setUsername('');
    };

    return (
        <div className="flex flex-col w-[full] h-auto ">
            <div className=" w-full py-4 px-6 relative bg-white">
                <input
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-black  w-[280px] lg:w-full h-9 text-white  rounded-3xl pl-4 pr-12 py-2  focus: outline-none"
                    type="text"
                    placeholder="Search people"
                />
                <FontAwesomeIcon
                    onClick={handleSearch}
                    className="absolute cursor-pointer p-2 text-xl text-white top-1/2 transform -translate-y-1/2 right-8  rounded-full z-50"
                    icon={faMagnifyingGlass}
                />
            </div>
            {real.map((temp) => (
                <div key={uuid()} className="grow bg-gray-200">
                    {temp && (
                        <div
                            onClick={() => handleSelect(temp)}
                            className="m-2 rounded-xl cursor-pointer  px-6 py-3 flex items-center gap-3 hover:bg-gray-300"
                        >
                            <div>
                                <img className="w-14 h-14 bg-cover rounded-full" src={temp.photoURL} alt="" />
                            </div>
                            <div className="grow flex flex-col">
                                <label className="cursor-pointer max-w-[270px] whitespace-nowrap overflow-hidden font-semibold">
                                    {temp.displayName}
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Search;
