//A header lib for date and time fns


////////////////////////////////////////////////////////////////
//  CONSTANTS
////////////////////////////////////////////////////////////////
export const monthArray: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const mmm: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

export const m: string[] = [
    'J',
    'F',
    'M',
    'A',
    'M',
    'J',
    'J',
    'A',
    'S',
    'O',
    'N',
    'D'
];

export const daysPerMonthArray: number[] = [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
];

export const msPerSecond: number = 1000;
export const secondsPerMinute: number = 60;
export const minutesPerHour: number = 60;
export const hoursPerDay: number = 24;
export const daysPerWeek: number = 7;
export const monthsPerYear: number = 12;
/**
 * The number of days in a non-leap year.
 */
export const daysPerYear: number = 365;

////////////////////////////////////////////////////////////////
//  YEAR TO DAYS
////////////////////////////////////////////////////////////////

/**
 * Returns the number of days in the specified year accounting for leap years.
 * @param year the year to count the days.
 */
export function totalDaysPerYear(year: number): number;

/**
 * Counts the number of days between the specified years (inclusive), accounting for leap years.
 * @param startYear the beginning of the year range to consider
 * @param endYear the end of the year range to consider
 */
export function totalDaysPerYear(startYear: number, endYear: number): number;

export function totalDaysPerYear(startYear: number, endYear?: number): number {
    //convert to whole number
    let y1: number = Math.floor(startYear);

    if (endYear == undefined) { //input is the year to determine
        if (isLeapYear(y1)) { //check leap year
            return 366;
        } else {
            return 365;
        }
    } else { //input is a range of years inclusive to determine
        //convert to whole number
        let y2: number = Math.floor(endYear);

        //check order
        if (y1 > y2) {
            let temp: number = y1;
            y1 = y2;
            y2 = temp;
        }

        let dy: number = y2 - y1;

        //number of leaps in range
        let leaps: number = 0;
        if (isLeapYear(startYear)) { leaps++; }
        leaps += Math.floor(dy / 4);
        if (isLeapYear(endYear) && (dy % 4 != 0)) { leaps++; }

        return (dy * 365) + leaps;
    }
}

////////////////////////////////////////////////////////////////
//  SUPPORT FUNCTIONS
////////////////////////////////////////////////////////////////

export function epoch0(): Date {
    return new Date(1970, 1, 1);
}

export function isLeapYear(year: number): boolean {
    if (Math.abs(year % 4) == 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * Returns the number of days in the epoch timeline between two dates,
 * @param start The start date
 * @param end The end date
 * @returns the number of days between the two dates rounded down.
 */
export function daysBetween(start: Date, end: Date): number {
    return Math.floor((end.valueOf() - start.valueOf()) / (
        msPerSecond*
        secondsPerMinute*
        minutesPerHour*
        hoursPerDay));
}

// export function numberOfLeapYearsBetween(startDay: number, endDay: number): number {
//     //todo
//     return 0;
// }

//BADLY NAMED
// export function date(dayIndex: number): string {
//     return '0000-00-00T00:00:00';
// }

// export function year(dayIndex: number): number {
//     var deltaYears = Math.floor(dayIndex / totalDaysPerYear(2001));

//     return 1970 + Math.floor(dayIndex / totalDaysPerYear(2001));
// }

// export function month(dayIndex: number): string {
//     return '0000-00-00T00:00:00';
// }

// export function day(dayIndex: number): string {
//     return '0000-00-00T00:00:00';
// }