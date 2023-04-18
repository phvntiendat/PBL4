import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ForgotPassword from './pages/ForgotPassword';

function App() {
    const { currentUser } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={currentUser ? <Home /> : <Login />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="forgotpassword" element={<ForgotPassword />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
