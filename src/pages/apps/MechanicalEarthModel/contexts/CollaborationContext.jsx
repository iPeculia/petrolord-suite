import React, { createContext, useContext, useReducer } from 'react';
import { useToast } from "@/components/ui/use-toast";

const CollaborationContext = createContext();

const initialState = {
    teamMembers: [],
    comments: [],
    activityLog: [],
    versions: [],
};

function reducer(state, action) {
    switch (action.type) {
        // Reducer cases for collaboration state
        default:
            return state;
    }
}

export const CollaborationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { toast } = useToast();

    const showNotImplementedToast = () => {
        toast({
            title: "Feature Not Implemented",
            description: "🚧 This collaboration feature isn't implemented yet. Request it in your next prompt! 🚀",
            variant: "default",
        });
    };

    const value = { state, dispatch, showNotImplementedToast };

    return (
        <CollaborationContext.Provider value={value}>
            {children}
        </CollaborationContext.Provider>
    );
};

export const useCollaboration = () => {
    const context = useContext(CollaborationContext);
    if (context === undefined) {
        throw new Error('useCollaboration must be used within a CollaborationProvider');
    }
    return context;
};