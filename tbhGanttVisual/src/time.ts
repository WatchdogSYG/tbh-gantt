//A header lib for date and time fns

import { precisionRound } from "d3";


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

export const daysPerMonth: number[] = [
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

export const millisPerSecond: number = 1000;
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
 * Returns the number of days in the epoch timeline between two dates.
 * @param start The start date.
 * @param end The end date.
 * @param round Rounds the number of days to the nearest integer. Rounds up if >0, does not round if == 0, rounds down otherwise.
 * @returns the number of days between the two dates rounded down.
 */
export function daysBetween(start: Date, end: Date, round?: number): number {
    if (round > 0) {
        return Math.ceil((end.valueOf() - start.valueOf()) / (
            millisPerSecond *
            secondsPerMinute *
            minutesPerHour *
            hoursPerDay));
    } else if ((round == 0) || (round == undefined)) {
        return (end.valueOf() - start.valueOf()) / (
            millisPerSecond *
            secondsPerMinute *
            minutesPerHour *
            hoursPerDay);
    } else {
        return Math.floor((end.valueOf() - start.valueOf()) / (
            millisPerSecond *
            secondsPerMinute *
            minutesPerHour *
            hoursPerDay));
    }

}

/**
 * Returns the number of months between two dates.
 * @param start The start date.
 * @param end The end date.
 * @param round Rounds the number of months to the nearest integer. Rounds up if >0, does not round if == 0, rounds down otherwise.
 * @returns the number of days between the two dates rounded down.
 */
export function monthsBetween(start: Date, end: Date, round?: number): number {
    let t: number = end.valueOf() - start.valueOf();
    let m: number[] = [start.getMonth(), end.getMonth()];

    //if they are in the same month
    if (m[0] == m[1]) {
        if (isLeapYear(start.getFullYear()) && m[0] == 1) { //we are in a leap february
            return (daysPerMonth[m[0]] + 1) *
                ((end.valueOf() - start.valueOf()) /
                    (millisPerSecond * secondsPerMinute * minutesPerHour * hoursPerDay));
        } else {
            return daysPerMonth[m[0]] *
                ((end.valueOf() - start.valueOf()) /
                    (millisPerSecond * secondsPerMinute * minutesPerHour * hoursPerDay));
        }
    }

    //if they are in the same year
    if (yearsBetween(start, end, 0) > 1) {
        start.getDate;
    }



    if (round > 0) {

        return;
    } else if ((round == 0) || (round == undefined)) {
        return end.getFullYear() - start.getFullYear();
    } else {
        return Math.floor(end.getFullYear() - start.getFullYear());
    }
}

/**
 * Returns the number of years between two dates. NOT FULLY IMPLEMENTED
 * @param start The start date.
 * @param end The end date.
 * @param round Rounds the number of years to the nearest integer. Rounds up if >0, does not round if == 0, rounds down otherwise.
 * @returns the number of days between the two dates rounded down.
 */
export function yearsBetween(start: Date, end: Date, round?: number): number {
    //TODO get partial years
    if (round > 0) {
        return Math.ceil(end.getFullYear() - start.getFullYear());
    } else if ((round == 0) || (round == undefined)) {
        return end.getFullYear() - start.getFullYear();
    } else {
        return Math.floor(end.getFullYear() - start.getFullYear());
    }
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