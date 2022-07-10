//A header lib for date and time fns

// export const month : string[] = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December'
// ];

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

    'December'];

export const mmmArray: string[] = [
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
    'Dec'];

export const mArray: string[] = [
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
    31];

export function hoursPerDay(): number {
    return 24;
}
export function daysPerMonth(index): number {
    return this.daysPerMonthArray[parseInt(index.toString())];
}
export function monthsPerYear(): number {
    return 12;
}

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

export function isLeapYear(year: number): boolean {
    if (Math.abs(year % 4) == 0) {
        return true;
    } else {
        return false;
    }
}
export function monthName(index: number): string {
    return this.monthArray[parseInt(index.toString())];
}

export function mmm(index: number): string {
    return this.mmmArray[parseInt(index.toString())];
}
export function m(index: number): string {
    return this.mArray[parseInt(index.toString())];
}

export function numberOfLeapYearsBetween(startDay: number, endDay: number): number {
    //todo
    return 0;
}

//BADLY NAMED
export function date(dayIndex: number): string {
    return '0000-00-00T00:00:00';
}

export function year(dayIndex: number): number {
    var deltaYears = Math.floor(dayIndex / totalDaysPerYear(2001));

    return 1970 + Math.floor(dayIndex / totalDaysPerYear(2001));
}

export function month(dayIndex: number): string {
    return '0000-00-00T00:00:00';
}

export function day(dayIndex: number): string {
    return '0000-00-00T00:00:00';
}