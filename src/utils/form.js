import moment from 'moment-timezone';

function getBodyOfForm(event) {
    const body = {};
    try {
        const data = new FormData(event.currentTarget);
        for (const [key, value] of data.entries()) {
            body[key] = value;
        }
    } catch (error) {
        console.log('Error', error);
    }
    return body;
}

function getHumanTime(inputTimestamp) {
    const dateTimeUTC = moment.utc(inputTimestamp);
    const dateTimeIST = dateTimeUTC.tz('Asia/Kolkata'); const formattedDate = dateTimeIST.format('Do MMMM YYYY');
    const formattedTime = dateTimeIST.format('h:mm A');
    const formattedDateTime = `${formattedDate} at ${formattedTime} IST`;
    if (formattedDate.includes('Invalid date')) return inputTimestamp;
    return formattedDateTime;
}

export { getBodyOfForm, getHumanTime };