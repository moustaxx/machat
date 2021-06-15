import { DateTime } from 'luxon';

import useParseDate from './useParseDate';

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
