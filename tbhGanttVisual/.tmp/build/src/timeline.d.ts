import * as dayjs from 'dayjs';
export declare class Timeline {
    private verbose;
    private d1;
    private d2;
    private n_days;
    private n_months;
    private n_years;
    private span_days;
    private span_months;
    private span_years;
    private dayScale;
    private weekScale;
    private yearScale;
    private monthScale;
    private quarterScale;
    private width;
    private height;
    private ts;
    getStart(): dayjs.Dayjs;
    getEnd(): dayjs.Dayjs;
    getDays(): number;
    getDayScale(): number;
    getMonths(): number;
    getYears(): number;
    getTimeScale(): TimeScale;
    getPadding(): number;
    private padding;
    private isLeapYear;
    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs);
    /**
     * Not yet implemented
     * @param daysPerPixel the desired scale factor
     */
    setDayScale(daysPerPixel: number): void;
    private generateYears;
    private generateMonths;
    private updateScaleFactors;
}
export interface IYearScale {
    yearText: string;
    yearOffset: number;
}
export interface IMonthScale {
    monthText: string;
    monthOffset: number;
}
export declare class YearSeparator implements IYearScale {
    yearText: string;
    yearOffset: number;
    constructor(yearText: string, yearOffset: number);
}
export declare class MonthSeparator implements IMonthScale {
    monthText: string;
    monthOffset: number;
    constructor(monthText: string, monthOffset: number);
}
export declare class TimeScale {
    yearScale: YearSeparator[];
    monthScale: MonthSeparator[];
    constructor();
}
