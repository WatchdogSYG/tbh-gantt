import * as dayjs from 'dayjs';
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
export declare const mmm: string[];
export declare const m: string[];
/**
 * Returns the month name given a month index.
 * @param month the month index (0 is Jan, 11 is Dec)
 * @returns the month string eg. 'January'
 */
export declare function month(month: number): string;
/**
 * Returns the number of days in the specified year accounting for leap years.
 * @param year the year to count the days.
 */
export declare function daysInYear(year: number): number;
/**
 * Returns the number of days in the specified month.
 * @param month the month index (0 is Jan, 11 is Dec)
 * @returns the number of days in the month
 */
export declare function daysInMonth(month: number): number;
export declare function remainingDaysInYear(d: dayjs.Dayjs): number;
export declare function daysElapsedInYear(d: dayjs.Dayjs): number;
export declare function remainingDaysInMonth(d: dayjs.Dayjs): number;
export declare function daysElapsedInMonth(d: dayjs.Dayjs): number;
/**
 * The number of different years the duration between start and end spans.
 * @param start the start date
 * @param end the end date
 */
export declare function spanYears(start: dayjs.Dayjs, end: dayjs.Dayjs): number;
/**
 * The number of different months the duration between start and end spans.
 * @param start the start date
 * @param end the end date
 */
export declare function spanMonths(start: dayjs.Dayjs, end: dayjs.Dayjs): number;
/**
 * Returns a Date at an epoch (POSIX) time of 0;
 * @returns a Date corresponding to midnight 1 January 1970;
 */
export declare function epoch0(): Date;
/**
 * Is the year an ISO leap year?
 * @param year Gregorian and prolaptic Gregorian BCE calendar with defined 0 year.
 * @returns If the year is a leap year.
 */
export declare function isLeapYear(year: number): boolean;
