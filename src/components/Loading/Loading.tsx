import clsx from 'clsx';

import styles from './Loading.module.css';

type TProps = {
    className?: string;
};

const Loading = ({ className }: TProps) => {
    return (
        <div className={clsx(styles.root, className)}>
            Loading...
        </div>
    );
};

export default Loading;
