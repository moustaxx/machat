import React, { lazy, useState, Suspense, useRef } from 'react';

import './emoji-mart.css';
import styles from './EmojiPicker.module.css';
import useOnClickOutside from '../../hooks/useOnClickOutside';

const Picker = lazy(async () => {
    const module = await import('emoji-mart');
    return { default: module.Picker };
});

const EmojiPicker = () => {
    const [isPickerOpen, setPickerStatus] = useState(false);
    const pickerRef = useRef<HTMLDivElement | null>(null);
    const emojiPickerBtnRef = useRef<HTMLButtonElement | null>(null);

    useOnClickOutside(pickerRef, (event) => {
        const path = event.composedPath();
        const isButtonClicked = path.includes(emojiPickerBtnRef.current!);
        if (isButtonClicked) return;
        setPickerStatus(false);
    });

    const handleIconClick = () => setPickerStatus(!isPickerOpen);

    return (
        <div className={styles.root}>
            <button
                type="button"
                ref={emojiPickerBtnRef}
                className={styles.emojiPickerBtn}
                onClick={handleIconClick}
                onKeyDown={handleIconClick}
            >
                <svg
                    className={styles.emojiPickerIcon}
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-label="Emoticons"
                >
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52
                        22 22 17.52 22 12S17.52 2 11.99 2zM8.5 8c.83 0 1.5.67
                        1.5 1.5S9.33 11 8.5 11 7 10.33 7 9.5 7.67 8 8.5 8zM12
                        18c-2.28 0-4.22-1.66-5-4h10c-.78 2.34-2.72 4-5 4zm3.5-7c-.83
                        0-1.5-.67-1.5-1.5S14.67 8 15.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                    />
                </svg>
            </button>
            {isPickerOpen && (
                <div className={styles.pickerWrapper} ref={pickerRef}>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Picker
                            set="twitter"
                            title=""
                            sheetSize={32}
                            exclude={['symbols']}
                            style={{ width: '100%' }}
                        />
                    </Suspense>
                </div>
            )}
        </div>
    );
};

export default EmojiPicker;
