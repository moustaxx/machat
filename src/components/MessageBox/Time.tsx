import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DateTime } from 'luxon';
import useIsMounted from '../../hooks/useIsMounted';

const useParseDate = (dateISO: string) => {
    const dateTime = useMemo(() => DateTime.fromISO(dateISO).setLocale('en-US'), [dateISO]);
    const isMounted = useIsMounted();
    const parseDate = useCallback((): [string | null, number] => {
        const diff = dateTime.diffNow('minute').minutes;
        const suggestedInterval = (diff > -1) ? 1000 : 60 * 1000;

        if (dateTime.hasSame(DateTime.local(), 'day')) {
            return [dateTime.toRelative(), suggestedInterval];
        }
        if (dateTime.diffNow('day').days > -2) {
            return [
                `${dateTime.toRelativeCalendar()}, ${dateTime.toLocaleString(DateTime.TIME_SIMPLE)}`,
                suggestedInterval,
            ];
        }

        return [dateTime.toLocaleString(DateTime.DATETIME_MED), suggestedInterval];
    }, [dateTime]);

    const [[parsed, interval], setDateState] = useState(parseDate);

    useEffect(() => {
        const handleTick = () => {
            if (!isMounted()) return;
            const newState = parseDate();
            setDateState(newState);

            const fn = () => window.requestAnimationFrame(handleTick);
            setTimeout(fn, interval);
        };
        handleTick();
    }, [isMounted, parseDate, interval]);

    return [parsed, dateTime] as const;
};

type ITimeProps = React.DetailedHTMLProps<React.TimeHTMLAttributes<HTMLElement>, HTMLElement> & {
    time: string;
};

const Time: React.FC<ITimeProps> = ({ time, ...rest }) => {
    const [parsedDate, date] = useParseDate(time);

    return (
        <time
            {...rest}
            title={date.toLocaleString(DateTime.DATETIME_MED)}
            dateTime={time}
            children={parsedDate}
        />
    );
};

export default Time;
