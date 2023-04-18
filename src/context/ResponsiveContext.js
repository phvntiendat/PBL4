import React, { createContext, useState } from 'react';

export const ResponsiveContext = createContext();

export const MenuProvider = ({ children }) => {
    const [responsive, setResponsive] = useState(true);
    return <ResponsiveContext.Provider value={{ responsive, setResponsive }}>{children}</ResponsiveContext.Provider>;
};
