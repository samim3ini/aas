import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ErrorContextType {
    error: Error | null;
    errorData: any;
    setError: (error: Error, data?: any) => void;
    clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType>({
    error: null,
    errorData: null,
    setError: () => { },
    clearError: () => { },
});

export const useError = () => useContext(ErrorContext);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [error, setErrorState] = useState<Error | null>(null);
    const [errorData, setErrorData] = useState<any>(null);

    const setError = (error: Error, data?: any) => {
        setErrorState(error);
        if (data !== undefined) setErrorData(data);
    };

    const clearError = () => {
        setErrorState(null);
        setErrorData(null);
    };

    return (
        <ErrorContext.Provider value={{ error, errorData, setError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};