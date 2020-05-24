import { useEffect } from 'react';

const useOnClickOutside = (
    ref: React.MutableRefObject<HTMLElement | null>,
    callback: (event: MouseEvent) => void,
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            callback(event);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
};

export default useOnClickOutside;
