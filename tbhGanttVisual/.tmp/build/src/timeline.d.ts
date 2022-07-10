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
    getStart(): Date;
    getEnd(): Date;
    getDays(): number;
    getDayScale(): number;
    getMonths(): number;
    getyears(): number;
    constructor(start: Date, end: Date);
    /**
     * Not yet implemented
     * @param daysPerPixel the desired scale factor
     */
    setDayScale(daysPerPixel: number): void;
    private updateScaleFactors;
}
