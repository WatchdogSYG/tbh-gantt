import * as dayjs from 'dayjs';
export declare class Timeline {
    private verbose;
    private d1;
    private d2;
    private n_days;
    private n_months;
    private n_years;
    private dayScale;
    private weekScale;
    private yearScale;
    private monthScale;
    private quarterScale;
    private width;
    private height;
    getStart(): dayjs.Dayjs;
    getEnd(): dayjs.Dayjs;
    getDays(): number;
    getDayScale(): number;
    getMonths(): number;
    getYears(): number;
    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs);
    /**
     * Not yet implemented
     * @param daysPerPixel the desired scale factor
     */
    setDayScale(daysPerPixel: number): void;
    private updateScaleFactors;
}
