/**
 * Parses a time string (e.g., "6:00 AM") into total minutes from start of day.
 * @param {string} timeStr 
 * @returns {number} minutes
 */
export const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(' ');
    let [h, m] = time.split(':');
    let hr = parseInt(h, 10);
    if (hr === 12) hr = 0;
    if (modifier === 'PM') hr += 12;
    return hr * 60 + parseInt(m, 10);
};

/**
 * Checks if current time is within operating hours.
 * @param {string} hours - Operating hours range (e.g., "6:00 AM - 11:00 PM")
 * @param {Date} now - Current date object
 * @returns {string} 'Open' | 'Closed'
 */
export const checkStatus = (hours, now) => {
    if (!hours) return 'Closed';
    try {
        const [start, end] = hours.split(' - ');
        if (!start || !end) return 'Closed';

        const startMinutes = parseTime(start);
        const endMinutes = parseTime(end);
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        return currentMinutes >= startMinutes && currentMinutes <= endMinutes ? 'Open' : 'Closed';
    } catch (e) {
        console.error("Error checking status:", e);
        return 'Closed';
    }
};
