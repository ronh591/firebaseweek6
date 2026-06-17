import { parseISO, format, isValid } from 'date-fns';

export default function Date({ dateString }) {
  if (!dateString) {
    return <span>Unknown date</span>;
  }

  let date;
  try {
    date = parseISO(dateString);
  } catch (error) {
    console.error(`Failed to parse date "${dateString}": ${error.message}`);
    return <span>{dateString}</span>;
  }

  if (!isValid(date)) {
    console.error(`Invalid date value: "${dateString}"`);
    return <span>{dateString}</span>;
  }

  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}
