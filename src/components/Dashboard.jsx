import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket, faMessage } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { AuthContext } from '../context/AuthContext';
import { useContext, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { ResponsiveContext } from '../context/ResponsiveContext';
import ProfileModal from '../components/ProfileModal';

import { db } from '../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

function Dashboard() {
    const { currentUser } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const { dispatch } = useContext(ChatContext);
    // const [expand, setExpand] = useState(false);
    const { responsive, setResponsive } = useContext(ResponsiveContext);

    const handleSignOut = async () => {
        await updateDoc(doc(db, 'users', currentUser.uid), {
            online: false,
        });
        dispatch({ type: 'CLEAR_USER' });
        signOut(auth);
    };

    const handleShowModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="w-16 relative z-50 flex flex-col  justify-between bg-black pt-4 h-full">
            <div className="relative flex item-center justify-center flex-col group">
                <div className="flex item-center justify-center ">
                    <img
                        className="rounded-3xl hover:rounded-xl transition-all duration-150 ease-linear w-9 h-9 bg-cover "
                        src={currentUser.photoURL}
                        alt=""
                    />
                </div>
                <span className="shadow-md group-hover:scale-100 scale-0 rounded-md transition-all duration-150 origin-left absolute left-16 w-auto p-2 min-w-max m-2 bg-gray-900 text-white">
                    {currentUser.displayName}
                </span>
            </div>

            <div className="flex flex-col justify-center items-center mb-4 gap-4">
                <div
                    onClick={() => setResponsive(!responsive)}
                    className="lg:hidden flex flex-row justify-center  cursor-pointer items-center w-full
                 text-white relative group
                 "
                >
                    <button className="bg-gray-800 rounded-3xl hover:rounded-xl transition-all duration-150 ease-linear mx-2 w-9 h-9 flex items-center justify-center">
                        <FontAwesomeIcon className="p-2 text-md " icon={faMessage} />
                    </button>
                    <span className="group-hover:scale-100 scale-0 shadow-md rounded-md transition-all duration-150 origin-left absolute left-16 w-auto p-2 min-w-max m-2 bg-gray-900 text-white">
                        Contacts
                    </span>
                </div>
                <div
                    onClick={() => setShowModal(!showModal)}
                    className="
                  flex flex-row  cursor-pointer justify-center items-center w-full
                 text-white relative group"
                >
                    <button className="bg-gray-800 rounded-3xl hover:rounded-xl transition-all duration-150 ease-linear mx-2 w-9 h-9 flex items-center justify-center">
                        <FontAwesomeIcon className="p-2 text-xl " icon={faGear} />
                    </button>
                    <span className="group-hover:scale-100 scale-0 shadow-md rounded-md transition-all duration-150 origin-left absolute left-16 w-auto p-2 min-w-max m-2 bg-gray-900 text-white">
                        Profile
                    </span>
                </div>
                <div
                    onClick={handleSignOut}
                    className=" flex flex-row justify-center  cursor-pointer items-center w-full
                 text-white relative group
                 "
                >
                    <button className="bg-gray-800 rounded-3xl hover:rounded-xl transition-all duration-150 ease-linear mx-2 w-9 h-9 flex items-center justify-center">
                        <FontAwesomeIcon className="p-2 text-md " icon={faRightFromBracket} />
                    </button>
                    <span className="group-hover:scale-100 scale-0 shadow-md rounded-md transition-all duration-150 origin-left absolute left-16 w-auto p-2 min-w-max m-2 bg-gray-900 text-white">
                        Sign Out
                    </span>
                </div>
            </div>
            <ProfileModal handleShowModal={handleShowModal} showModal={showModal} />
        </div>
    );
}

export default Dashboard;
