import { useState } from 'react';
import { useContext } from 'react';
import Chat from '../components/Chat';
import { ChatContext } from '../context/ChatContext';
import Gallery from './Gallery';
import Sidebar from './Sidebar';

function Content() {
    const user = useContext(ChatContext);
    // console.log(user);
    const [showGallery, setShowGallery] = useState(false);
    const handleShow = () => {
        setShowGallery(!showGallery);
    };

    return (
        <div className="w-full bg-white flex">
            <Sidebar />
            {user.data.chatId === 'null' ? (
                <div className="flex items-center justify-center grow">
                    <p className="text-3xl">Select a user to start chatting!</p>
                </div>
            ) : (
                <Chat handleShow={handleShow} />
            )}
            <Gallery show={showGallery} />
        </div>
    );
}

export default Content;
