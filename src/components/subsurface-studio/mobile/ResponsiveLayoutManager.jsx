import React, { createContext, useContext, useState, useEffect } from 'react';

const ResponsiveContext = createContext();

export const useResponsive = () => useContext(ResponsiveContext);

export const ResponsiveLayoutManager = ({ children }) => {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
        isDesktop: window.innerWidth >= 1024,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setDimensions({
                width,
                height: window.innerHeight,
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isDesktop: width >= 1024,
                orientation: width > window.innerHeight ? 'landscape' : 'portrait'
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <ResponsiveContext.Provider value={dimensions}>
            <div className={`h-full w-full overflow-hidden ${dimensions.isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
                {children}
            </div>
        </ResponsiveContext.Provider>
    );
};