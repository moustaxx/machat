import React, { useState, useEffect, useCallback } from 'react';
import { DateTime } from 'luxon';

const useParseDate = (date: DateTime) => {
    const parse = useCallback(() => {
        const difference = date.diffNow('minute').minutes;

        if (date.hasSame(DateTime.local(), 'day')) {
            return [date.toRelative(), difference] as const;
        }
        if (date.diffNow('day').days > -2) {
            return [
                `${date.toRelativeCalendar()}, ${date.toLocaleString(DateTime.TIME_SIMPLE)}`,
                difference,
            ] as const;
        }

        return [date.toLocaleString(DateTime.DATETIME_MED), difference] as const;
    }, [date]);

    const [parsedDate, setParsedDate] = useState(parse()[0]);

    useEffect(() => {
        const [parsed, diff] = parse();
        const interval = (diff < 1) ? 1000 : 60 * 1000;

        const tick = () => setParsedDate(parsed);
        const id = setInterval(tick, interval);
        return () => clearInterval(id);
    }, [parse]);

    return parsedDate;
};

type ITimeProps = React.DetailedHTMLProps<React.TimeHTMLAttributes<HTMLElement>, HTMLElement> & {
    time: string;
};

const Time: React.FC<ITimeProps> = ({ time, ...rest }) => {
    const date = DateTime.fromISO(time).setLocale('en-US');
    const parsedDate = useParseDate(date);

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
