import Content from '../components/Content';
import Dashboard from '../components/Dashboard';
import { useContext, useState } from 'react';
import { ResponsiveContext } from '../context/ResponsiveContext';

function Home() {
    const [responsive, setResponsive] = useState(false);
    return (
        <div className="flex w-screen h-screen">
            <ResponsiveContext.Provider value={{ responsive, setResponsive }}>
                <Dashboard />
                <Content />
            </ResponsiveContext.Provider>
        </div>
    );
}

export default Home;
