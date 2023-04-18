import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition } from 'react-transition-group';

function ImageModal({ handleShowModal, showModal, selectedImg }) {
    const nodeRef = useRef(null);

    return (
        <CSSTransition in={showModal} timeout={200} nodeRef={nodeRef} classNames="modal" unmountOnExit>
            <div className="w-full h-full bg-black bg-opacity-80 flex justify-center items-center fixed top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 z-50 ">
                <ToastContainer
                    position="top-right"
                    autoClose={3500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <div className="w-full h-full bg-black bg-opacity-80 flex justify-center items-center fixed top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div ref={nodeRef} className="relative">
                        <img src={selectedImg} alt="" className="max-h-96 max-w-[250px] rounded-xl" />
                        <span
                            onClick={() => handleShowModal()}
                            className="cursor-pointer absolute right-5  text-white top-4 w-5 h-5 rounded-full hover:bg-white bg-opacity-10 hover:text-gray-400 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faClose} />
                        </span>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default ImageModal;
