import React, { useState, createContext, useContext } from 'react';

const A11yContext = createContext();
export const useA11y = () => useContext(A11yContext);

export const AccessibilityOptimization = ({ children }) => {
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);

    const toggleHighContrast = () => setHighContrast(prev => !prev);
    const toggleLargeText = () => setLargeText(prev => !prev);

    return (
        <A11yContext.Provider value={{ highContrast, largeText, toggleHighContrast, toggleLargeText }}>
            <div className={`
                ${highContrast ? 'contrast-more grayscale' : ''}
                ${largeText ? 'text-lg' : ''}
            `}>
                {children}
            </div>
        </A11yContext.Provider>
    );
};