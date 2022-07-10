export declare const monthArray: string[];
export declare const mmm: string[];
export declare const m: string[];
export declare const daysPerMonthArray: number[];
export declare const hoursPerDay: number;
export declare const daysPerWeek: number;
export declare const monthsPerYear: number;
export declare const minutesPerHour: number;
export declare const secondsPerMinute: number;
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
export declare function isLeapYear(year: number): boolean;
