import { useRef, useEffect, useCallback } from 'react';

const useIsMounted = () => {
    const mountedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    });

    return useCallback(() => mountedRef.current, []);
};

export default useIsMounted;
