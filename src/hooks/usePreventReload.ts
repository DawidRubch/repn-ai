import { useEffect } from "react";

export const usePreventAccidentalRefresh = () => {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {

            event.preventDefault();
            // This message might not be displayed in some browsers due to security reasons
            event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';

        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
};