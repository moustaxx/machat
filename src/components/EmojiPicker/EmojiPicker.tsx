import React, { lazy, useState, Suspense, useRef } from 'react';
import { BaseEmoji } from 'emoji-mart';

import './emoji-mart.css';
import { MdInsertEmoticon } from 'react-icons/md';
import styles from './EmojiPicker.module.css';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import Loading from '../Loading';

const Picker = lazy(async () => {
    const module = await import('emoji-mart');
    return { default: module.Picker };
});

type TEmojiPickerProps = {
    addEmoji: (emoji: BaseEmoji) => void;
};

const EmojiPicker = ({ addEmoji }: TEmojiPickerProps) => {
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
            >
                <MdInsertEmoticon
                    className={styles.emojiPickerIcon}
                    aria-label="emoticons"
                />
            </button>
            {isPickerOpen && (
                <div className={styles.pickerWrapper} ref={pickerRef}>
                    <Suspense fallback={<Loading className={styles.loading} />}>
                        <Picker
                            set="twitter"
                            title=""
                            sheetSize={32}
                            exclude={['symbols']}
                            style={{ width: '100%' }}
                            onSelect={addEmoji}
                            color="#7288da"
                        />
                    </Suspense>
                </div>
            )}
        </div>
    );
};

export default EmojiPicker;
