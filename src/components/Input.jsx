import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faClose, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { storage } from '../firebase/firebase';
import { doc, arrayUnion, Timestamp, serverTimestamp, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { db } from '../firebase/firebase';
import { uploadBytesResumable, getDownloadURL, ref } from 'firebase/storage';

function Input() {
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const imageChange = (e) => {
        if (e.target.files.length !== 0) {
            setImg(e.target.files[0]);
            setImgPreview(e.target.files[0]);
        }
    };

    const handleKey = (e) => {
        if (e.code === 'Enter') {
            handleSend();
        }
    };

    const handleClearImage = () => {
        setImg(null);
        setImgPreview(null);
    };

    const handleSend = async () => {
        if (text !== '' || img !== null) {
            if (img) {
                const storageRef = ref(storage, uuid());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    (error) => {},
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            await updateDoc(doc(db, 'messages', data.chatId), {
                                messages: arrayUnion({
                                    id: uuid(),
                                    text,
                                    senderId: currentUser.uid,
                                    date: Timestamp.now(),
                                    img: downloadURL,
                                    hiddenTo: [],
                                    deleted: false,
                                }),
                            });

                            await updateDoc(doc(db, 'contacts', currentUser.uid), {
                                [data.chatId + '.latestMessage']: '[Photo]',
                                [data.chatId + '.date']: serverTimestamp(),
                            });

                            await updateDoc(doc(db, 'contacts', data.user.userRef), {
                                [data.chatId + '.latestMessage']: '[Photo]',
                                [data.chatId + '.date']: serverTimestamp(),
                            });
                        });
                    },
                );
            } else {
                await updateDoc(doc(db, 'messages', data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        img: null,
                        hiddenTo: [],
                        deleted: false,
                    }),
                });

                await updateDoc(doc(db, 'contacts', currentUser.uid), {
                    [data.chatId + '.latestMessage']: text,
                    [data.chatId + '.date']: serverTimestamp(),
                });

                await updateDoc(doc(db, 'contacts', data.user.userRef), {
                    [data.chatId + '.latestMessage']: text,
                    [data.chatId + '.date']: serverTimestamp(),
                });
            }
        }
        setText('');
        setImg(null);
        setImgPreview(null);
    };

    return (
        <div className="w-[320px] lg:w-full h-[68px] flex items-center justify-center bg-white shadow-2xl -z-0">
            <div className=" relative flex items-center justify-center w-full px-6">
                <label htmlFor="upload" className="flex items-center cursor-pointer gap-2 text-sm capitalize">
                    <FontAwesomeIcon
                        className="p-2 text-xl  text-black rounded-full hover:bg-black hover:text-white"
                        icon={faCamera}
                    />
                </label>
                <input
                    onKeyDown={handleKey}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className=" mx-6 w-full h-9 border-b-2 border-gray-400  py-2  focus: outline-none focus:border-gray-600"
                    type="text"
                    placeholder="Message"
                />
                <input onChange={imageChange} id="upload" type="file" className="hidden" />
                <div className="left-10 bottom-16 absolute">
                    <div className="relative">
                        {imgPreview !== null ? (
                            <div>
                                <img
                                    src={URL.createObjectURL(imgPreview)}
                                    alt=""
                                    className="shadow-xl max-h-40 rounded-xl "
                                />
                                <FontAwesomeIcon
                                    onClick={handleClearImage}
                                    className="shadow-xl bg-transparent absolute top-2 right-3 text-base  text-white cursor-pointer"
                                    icon={faClose}
                                />
                            </div>
                        ) : (
                            <span></span>
                        )}
                    </div>
                </div>

                <button onClick={handleSend} className="btn-icon">
                    <FontAwesomeIcon
                        className="text-xl p-2 text-black rounded-full hover:bg-black hover:text-white"
                        icon={faPaperPlane}
                    />
                </button>
            </div>
        </div>
    );
}

export default Input;
