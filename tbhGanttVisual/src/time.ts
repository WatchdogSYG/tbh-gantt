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

export function daysPerYear(): number {
    return 365;
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
    var deltaYears = Math.floor(dayIndex / daysPerYear());

    return 1970 + Math.floor(dayIndex / daysPerYear());
}

export function month(dayIndex: number): string {
    return '0000-00-00T00:00:00';
}

export function day(dayIndex: number): string {
    return '0000-00-00T00:00:00';
}