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
/**
 * Counts the number of days between the specified years (inclusive), accounting for leap years.
 * @param startYear the beginning of the year range to consider
 * @param endYear the end of the year range to consider
 */
export declare function totalDaysPerYear(startYear: number, endYear: number): number;
export declare function epoch0(): Date;
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
 * Returns the number of months between two dates.
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
