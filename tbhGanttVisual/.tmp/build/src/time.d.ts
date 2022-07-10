export declare const monthArray: string[];
export declare const mmmArray: string[];
export declare const mArray: string[];
export declare const daysPerMonthArray: number[];
export declare function hoursPerDay(): number;
export declare function daysPerMonth(index: any): number;
export declare function monthsPerYear(): number;
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
export declare function monthName(index: number): string;
export declare function mmm(index: number): string;
export declare function m(index: number): string;
export declare function numberOfLeapYearsBetween(startDay: number, endDay: number): number;
export declare function date(dayIndex: number): string;
export declare function year(dayIndex: number): number;
export declare function month(dayIndex: number): string;
export declare function day(dayIndex: number): string;
