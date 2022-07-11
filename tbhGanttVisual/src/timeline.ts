//Class that contains properties and functions that deal with timeline and spacing

import * as dayjs from 'dayjs';
import * as Lib from './../src/lib';
import * as Time from './../src/time';

export class Timeline {

    ////////////////////////////////////////////////////////////////
    //  Define members
    ////////////////////////////////////////////////////////////////

    //--------DEV--------//
    private verbose: boolean = true;

    private d1: dayjs.Dayjs;
    private d2: dayjs.Dayjs;
    private n_days: number;
    private n_months: number;
    private n_years: number;

    //--------SCALE--------//
    private dayScale: number;
    private weekScale: number;
    private yearScale: number;
    private monthScale: number[];
    private quarterScale: number[];

    private width: number;
    private height: number;

    ////////////////////////////////////////////////////////////////
    //  Get/Set
    ////////////////////////////////////////////////////////////////

    public getStart(): dayjs.Dayjs { return this.d1; }
    public getEnd(): dayjs.Dayjs { return this.d2; }
    public getDays(): number { return this.n_days; }
    public getDayScale(): number { return this.dayScale; }
    public getMonths(): number { return this.n_months; }
    public getYears(): number { return this.n_years; }

    ////////////////////////////////////////////////////////////////
    //  Constructor
    ////////////////////////////////////////////////////////////////

    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs) {
        this.d1 = start;
        this.d2 = end;

        this.n_days = Math.abs(this.d2.diff(this.d1, 'd', true));
        this.n_months = Math.abs(this.d2.diff(this.d1, 'M', true));
        this.n_years = Math.abs(this.d2.diff(this.d1, 'y', true));

        this.dayScale = 1;

        if (this.verbose) {
            console.log('LOG: Timeline created from ' +
                start.toISOString() + ' to ' +
                end.toISOString() +
                ' spanning ' +
                this.n_days.toString() +
                ' days.');

            console.log('LOG: ' + 
            this.n_years + ' years or ' + 
            this.n_months + ' months or ' + 
            this.n_days + ' days.');

            console.log('LOG: Timeline scale = ' + this.dayScale.toString());
        }
    }

    ////////////////////////////////////////////////////////////////
    //  Timeline Manipulation Functions
    ////////////////////////////////////////////////////////////////

    /**
     * Not yet implemented
     * @param daysPerPixel the desired scale factor 
     */
    public setDayScale(daysPerPixel: number) {
        console.log("WARNING: Timeline.setDayScale(daysPerPixel: number) Not yet implemented.")
        this.dayScale = daysPerPixel;
        this.updateScaleFactors()
    }

    ////////////////////////////////////////////////////////////////
    //  Support Functions
    ////////////////////////////////////////////////////////////////

    private updateScaleFactors() {
        this.weekScale = this.dayScale * 7;
        this.yearScale = this.dayScale * 365;
        for (let i = 0; i < 12; i++) { this.monthScale[i] = this.dayScale[i] * Time.daysPerMonth[i]; }
        this.quarterScale[0] = this.monthScale[0] + this.monthScale[1] + this.monthScale[2];
        this.quarterScale[1] = this.monthScale[3] + this.monthScale[4] + this.monthScale[5];
        this.quarterScale[2] = this.monthScale[6] + this.monthScale[7] + this.monthScale[8];
        this.quarterScale[3] = this.monthScale[9] + this.monthScale[10] + this.monthScale[11];
    }
}