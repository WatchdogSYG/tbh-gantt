import * as dayjs from 'dayjs';
export declare class Timeline {
    verbose: boolean;
    private d1;
    private d2;
    private status;
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
    getStatus(): dayjs.Dayjs;
    getDays(): number;
    getDayScale(): number;
    getMonths(): number;
    getYears(): number;
    getTimeScale(): TimeScale;
    getYearPadding(): number;
    getMonthPadding(): number;
    setYearPadding(padding: number): void;
    private yearPadding;
    private monthPadding;
    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs, status: dayjs.Dayjs, minWidth: number);
    defineTimeline(start: dayjs.Dayjs, end: dayjs.Dayjs, status: dayjs.Dayjs, minWidth: number): void;
    /**
     * Not yet implemented
     * @param daysPerPixel the desired scale factor
     */
    setDayScale(daysPerPixel: number): void;
    setDayScaleByContainerWidth(containerWidth: number): void;
    /**
     * Returns an array of YearSeparators based on the start and finish dates of the timeline.
     * The text is currently left aligned only. (text-align: start;)
     * TODO: consider if there needs to be start and end date arguments or if it should just read the member variables.
     *
     * @returns an array of YearSeparators which determine the content and positioning of Year
     * display elements in the timeline based on the start and finish dates.
     */
    private generateYears;
    /**
 * Returns an array of MonthSeparators based on the start and finish dates of the timeline.
 * The text is currently middle aligned only. (text-align: middle;)
 * TODO: consider if there needs to be start and end date arguments or if it should just read the member variables.
 *
 * @returns an array of MonthSeparators which determine the content and positioning of Month
 * display elements in the timeline based on the start and finish dates.
 */
    private generateMonths;
    /**
     * Updates the weekScale, quarterScale, and yearScale member variables based on the dayScale member variable.
     */
    private updateScaleFactors;
    /**
     * Converts a Day.js date to a horizontal offset on the chart based on the Timeline scale.
     * @param date the date to convert
     * @returns the location from the left edge of the chart the input date corresponds to
     */
    dateLocation(date: dayjs.Dayjs): number;
    /**
     * Converts the status date to a horizontal offset on the chart based on the Timeline scale. Similar to Timeline.dateLocation(date: dayjs.Dayjs).
     * @returns The location from the left edge of the chart the current status date corresponds to
     */
    statusDateTranslationPx(): string;
    /**
     * DEV ONLY
     */
    setStatus(status: dayjs.Dayjs): void;
}
export interface ISeparator {
    text: string;
    offset: number;
    textAnchorOffset: number;
}
export declare class YearSeparator implements ISeparator {
    text: string;
    offset: number;
    textAnchorOffset: number;
    constructor(yearText: string, yearOffset: number, textAnchorOffset: number);
}
export declare class MonthSeparator implements ISeparator {
    text: string;
    offset: number;
    textAnchorOffset: number;
    constructor(monthText: string, monthOffset: number, textAnchorOffset: number);
}
export declare class TimeScale {
    yearScale: YearSeparator[];
    monthScale: MonthSeparator[];
    constructor();
}
