import React, { createContext, useState, useContext } from 'react';

    const ImportContext = createContext();

    export const useImport = () => useContext(ImportContext);

    export const ImportProvider = ({ children }) => {
        const [isImportCenterOpen, setIsImportCenterOpen] = useState(false);
        const [files, setFiles] = useState([]);
        const [step, setStep] = useState(1);

        const openImportCenter = () => setIsImportCenterOpen(true);
        const closeImportCenter = () => setIsImportCenterOpen(false);

        const reset = () => {
            setFiles([]);
            setStep(1);
        };

        const handleOpenChange = (open) => {
            if (!open) {
                setIsImportCenterOpen(false);
                // Reset state after a short delay to allow the dialog to close gracefully
                setTimeout(() => reset(), 300);
            } else {
                setIsImportCenterOpen(true);
            }
        };

        const value = {
            isImportCenterOpen,
            openImportCenter,
            closeImportCenter,
            handleOpenChange,
            files,
            setFiles,
            step,
            setStep,
            reset,
        };

        return (
            <ImportContext.Provider value={value}>
                {children}
            </ImportContext.Provider>
        );
    };