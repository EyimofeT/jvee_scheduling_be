
// export function createDateFromString(dateString, start_time, month_plus) {
//     // const dateStr = '2024-8-1';
//     // const startTime = 7; // 7 AM
//     // Split the date string into parts (day, month, year)
//     let [year, month, day] = dateString.split('-');

//     console.log(year, month, day)
//     month = Number(month) + Number(month_plus)

//     // Ensure day and month have two digits
//     if (day.length === 1) day = '0' + day;
//     if (month.length === 1) month = '0' + month;

//     // Create a new Date object
//     const date = new Date(`${year}-${month}-${day}`);

//     // Set the hour based on start_time (Assume start_time is always in 24-hour format)
//     date.setHours(start_time + 1);

//     console.log(year, month, day)
//     console.log(date)

//     return date;
// }
export function createDateFromString(dateString, start_time, month_plus) {
    // Split the date string into parts (year, month, day)
    let [year, month, day] = dateString.split('-').map(Number);

    // Adjust the month by adding month_plus (considering month_plus can push month to next year)
    month += Number(month_plus);
    if (month > 12) {
        month -= 12;
        year += 1;
    }

    // Ensure day and month have two digits
    day = day.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');

    // Create a new Date object with the correct time (in local time zone)
    const date = new Date(`${year}-${month}-${day}T${start_time.padStart(2, '0')}:00:00`);

    return date.toISOString();
}

// Example usage:
// const date = createDateFromString('2024-08-01', '07', 0);
// console.log(date); // "2024-08-01T07:00:00.000Z" or similar based on the local time zone


export function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    const dayWithSuffix = day + getOrdinalSuffix(day);

    return `${dayWithSuffix} ${month} ${year}`;
}

export function getDaysOfMonthFromDate(datetime, daysOfWeek) {
    const startDate = new Date(datetime);
    const result = [];

    // Map of days of the week to numbers (Sunday = 0, Monday = 1, etc.)
    const daysMap = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
    };

    // Convert the list of day names to day numbers
    const daysOfWeekNumbers = daysOfWeek.map(day => daysMap[day.toLowerCase()]);

    // Get the current year and month
    const year = startDate.getFullYear();
    const month = startDate.getMonth();

    // Start from the given date
    let currentDate = new Date(startDate);

    // Loop through each day of the month starting from the given date
    while (currentDate.getMonth() === month) {
        // Check if the current day is in the daysOfWeek list
        if (daysOfWeekNumbers.includes(currentDate.getDay())) {
            result.push(currentDate.toISOString().split('T')[0]); // Add date in YYYY-MM-DD format
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // If no matching days were found, return the original datetime date
    if (result.length === 0) {
        result.push(startDate.toISOString().split('T')[0]);
    }

    return result;
}

export function generate_time_slots(days_of_week) {
    const timeSlots = [];
    let startTime = days_of_week.includes('sunday') ? 10 : 8; // Start at 10:00 if 'sunday' is included, otherwise at 8:00
    const endTime = 19; // End at 19:00

    // Loop through each hour from start to end
    for (let hour = startTime; hour < endTime; hour++) {
        // Loop through each 15-minute interval within the hour
        for (let minutes = 0; minutes < 60; minutes += 15) {
            // Format hours and minutes to always be two digits (e.g., 08:00, 08:15)
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            // Push the formatted time to the timeSlots array
            timeSlots.push(`${formattedHour}:${formattedMinutes}`);
        }
    }
    // Add the final 19:00 time slot
    timeSlots.push('19:00');

    return timeSlots;
}

export function extract_hour_from_datetime(datetimeString) {
    // Create a Date object from the datetime string
    const dateObj = new Date(datetimeString);

    // Extract the hour component and format it as two digits
    const hours = dateObj.getUTCHours().toString().padStart(2, '0');

    return hours;
}

export async function filter_times_by_hour(timeList, hourToFilter) {
    // console.log("hour to filter : " +hourToFilter)
    // Validate that hourToFilter is a two-digit string
    if (!/^\d{2}$/.test(hourToFilter)) {
        throw new Error('hourToFilter must be a two-digit string.');
    }

    // Filter the list to remove times that start with the specified hour
    const filteredTimes = timeList.filter(time => !time.startsWith(hourToFilter));

    return filteredTimes;
}

export function create_date_time_string(date, time) {
    // Combine the date and time into a single string
    const dateTimeString = `${date}T${time}:00.000Z`;

    // Create a new Date object to ensure the format is correct
    const dateTime = new Date(dateTimeString);

    // Return the ISO string of the Date object
    return dateTime.toISOString();
}


export function is_today(dateString) {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Compare today's date with the provided date string
    return dateString === today;
}

export function filter_by_current_hour(timeList) {
    // Get the current hour in 24-hour format
    const currentHour = new Date().getHours();

    // Filter the time list to only include times after the current hour
    const filteredTimes = timeList.filter(time => {
        const hour = parseInt(time.split(':')[0], 10);
        return hour > currentHour;
    });

    return filteredTimes;
}

export function validate_and_update_date(dateString) {
    // Split the input date string into year, month, and day
    let [year, month, day] = dateString.split('-');

    // Create a Date object for the input date
    const inputDate = new Date(year, month - 1, day);

    // Create a Date object for today's date
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1; // Month is zero-based
    const todayDay = today.getDate();

    // Check if the input date is less than today's date
    if (inputDate < today) {
        // If so, update the date to today's date
        year = todayYear;
        month = todayMonth;
        day = todayDay;
    }

    // Ensure day and month have two digits
    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');

    // Return the updated date string in the format yyyy-mm-dd
    return `${year}-${month}-${day}`;
}
