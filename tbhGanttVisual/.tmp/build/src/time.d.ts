import * as dayjs from 'dayjs';
export declare const monthArray: string[];
export declare const mmm: string[];
export declare const m: string[];
export declare const daysPerMonth: number[];
export declare const millisPerSecond: number;
export declare const secondsPerMinute: number;
export declare const minutesPerHour: number;
export declare const hoursPerDay: number;
export declare const daysPerWeek: number;
export declare const monthsPerYear: number;
/**
 * The number of days in a non-leap year.
 */
export declare const daysPerYear: number;
/**
 * Returns the number of days in the specified year accounting for leap years.
 * @param year the year to count the days.
 */
export declare function totalDaysPerYear(year: number): number;
export declare function remainingDaysInYear(d: dayjs.Dayjs): number;
export declare function daysElapsedInYear(d: dayjs.Dayjs): number;
export declare function remainingDaysInMonth(d: dayjs.Dayjs): number;
export declare function daysElapsedInMonth(d: dayjs.Dayjs): number;
export declare function epoch0(): Date;
/**
 * Is the year a leap year?
 * @param year Gregorian and prolaptic Gregorian BCE calendar with defined 0 year.
 * @returns If the year is a leap year.
 */
export declare function isLeapYear(year: number): boolean;
/**
 * Returns the number of days in the epoch timeline between two dates.
 * @param start The start date.
 * @param end The end date.
 * @param round Rounds the number of days to the nearest integer. Rounds up if >0, does not round if == 0, rounds down otherwise.
 * @returns the number of days between the two dates rounded down.
 */
export declare function daysBetween(start: Date, end: Date, round?: number): number;
/**
 * Returns the number of months between two dates. TODO ROUND OPTIONS
 * @param start The start date.
 * @param end The end date.
 * @param round Rounds the number of months to the nearest integer. Rounds up if >0, does not round if == 0, rounds down otherwise.
 * @returns the number of days between the two dates rounded down.
 */
export declare function monthsBetween(start: Date, end: Date, round?: number): number;
/**
 * Returns the number of years between two dates. NOT FULLY IMPLEMENTED
 * @param start The start date.
 * @param end The end date.
 * @param round Rounds the number of years to the nearest integer. Rounds up if >0, does not round if == 0, rounds down otherwise.
 * @returns the number of days between the two dates rounded down.
 */
export declare function yearsBetween(start: Date, end: Date, round?: number): number;
