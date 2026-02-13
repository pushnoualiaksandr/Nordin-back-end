const dateFormat = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

export const toISO8601 = (date: Date | number): string => {
    try {
        if (!date) {
            return '';
        }

        if (typeof date === 'number') {
            date = new Date(date);
        }

        const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

        const [month, day, year] = dateFormat.format(utcDate).replaceAll('/', '-').split('T')[0].split('-');
        return `${year}-${month}-${day}`;
    } catch (error) {
        throw new Error('Invalid date format');
    }
};
