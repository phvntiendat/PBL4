import { Link } from 'react-router-dom';

import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
    const toastPopUp = (customError) => {
        toast.error(customError, {
            position: 'top-right',
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target[0].value.length);
        if (e.target[0].value.length === 0) {
            toastPopUp('Please fill in all the input fields');
        } else {
            sendPasswordResetEmail(auth, e.target[0].value)
                .then(() => {
                    toast.info('A link to reset your password has been sent to your email!', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                })
                .catch((err) => {
                    toastPopUp('This email is not connected to any accounts');
                });
        }
    };

    return (
        <div className="bg-[url('./assets/img/bg1.jpg')] bg-cover w-screen h-screen flex items-center justify-center">
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
            <div className="h-screen lg:h-auto w-screen lg:w-96 bg-white shadow-2xl lg:rounded-3xl flex items-center justify-center lg:none">
                <form onSubmit={handleSubmit} className="px-14 py-8 flex items-center flex-col">
                    <label className="uppercase font-bold text-2xl mb-4">forgot password</label>
                    <div className="mb-2 w-full">
                        <label className="capitalize">Change password via email</label>
                        <input
                            className="pr-2 w-full py-2 border-b-2 border-cyan-400  focus: outline-none focus:border-cyan-500"
                            type="email"
                            placeholder="Type in your email"
                        ></input>
                    </div>

                    <button className="font-semibold mb-6 mt-4 py-3 w-full uppercase text-white rounded-3xl  bg-black hover:bg-opacity-80">
                        send
                    </button>

                    <label className="capitalize text-sm">Return to login</label>
                    <span className="text-sm text-cyan-400 capitalize">
                        <Link to="/login">Login</Link>
                    </span>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
