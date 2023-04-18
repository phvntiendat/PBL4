import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { useEffect, useState, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import ImageModal from '../components/ImageModal';
import { AuthContext } from '../context/AuthContext';

import { db } from '../firebase/firebase';
// import { useEffect } from 'react';

function Message({ search, message }) {
    const { data } = useContext(ChatContext);
    const { currentUser } = useContext(AuthContext);

    const [user, setUser] = useState(null);
    const ref = useRef();

    const [showModal, setShowModal] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);

    const handleShowModal = () => {
        setShowModal(!showModal);
    };

    const handleSelect = (img) => {
        setSelectedImg(img);
        handleShowModal();
    };

    useEffect(() => {
        if (message.text.toLowerCase().includes(search.toLowerCase(), 0)) {
            ref.current?.scrollIntoView();
        }
    }, [search]);

    useEffect(() => {
        ref.current?.scrollIntoView();
    }, [message]);

    useEffect(() => {
        setUser(null);
        const getInfo = async () => {
            const docRef = doc(db, 'users', data.user.userRef);
            const docSnap = await getDoc(docRef);
            setUser(docSnap.data());
            // console.log(docSnap.data());
        };
        data.user.userRef && getInfo();
    }, [data.user.userRef]);

    return (
        !message.deleted &&
        !message.hiddenTo.includes(currentUser.uid) && (
            <div ref={ref} className=" flex flex-row ml-6 gap-6 mb-3 group">
                <div className="flex items-start justify-center">
                    <img className="w-9 h-9 bg-cover rounded-full" src={user?.photoURL} alt="" />
                </div>
                <div className="relative ">
                    <span className="text-white text-sm  bg-black py-1 px-2 rounded-2xl absolute top-1/2 transform -translate-y-1/2 -right-32 hidden group-hover:block">
                        {message.date.toDate().toLocaleTimeString()}
                    </span>
                    {message.text !== '' && (
                        <p className=" inline-block break-words max-w-xs text-white bg-gray-500 px-4 py-[6px] rounded-xl ">
                            {message.text}
                        </p>
                    )}

                    {message.img && (
                        <img
                            onClick={() => handleSelect(message.img)}
                            className="bg-cover max-w-[200px] lg:max-w-xs rounded-xl hover:opacity-90 cursor-pointer "
                            src={message.img}
                            alt=""
                        />
                    )}

                    <ImageModal handleShowModal={handleShowModal} showModal={showModal} selectedImg={selectedImg} />
                </div>
            </div>
        )
    );
}

export default Message;
