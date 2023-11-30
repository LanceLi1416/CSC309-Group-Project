/**
 * Format a date time string to a date time string in the format of "YYYY-MM-DD HH:MM:SS"
 *
 * @param dateTimeString
 * @param locales
 * @returns {`${string} ${string}`}
 */
export default function formatDateTimeString(dateTimeString, locales = 'en-CA') {
    const dateTime = new Date(dateTimeString);
    const date = dateTime.toLocaleDateString(locales);
    const time = dateTime.toLocaleTimeString(locales);
    return `${date} ${time}`;
}