//Class that contains properties and functions that deal with timeline and Offset

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

    private ts: TimelineScale;

    ////////////////////////////////////////////////////////////////
    //  Get/Set
    ////////////////////////////////////////////////////////////////

    public getStart(): dayjs.Dayjs { return this.d1; }
    public getEnd(): dayjs.Dayjs { return this.d2; }
    public getDays(): number { return this.n_days; }
    public getDayScale(): number { return this.dayScale; }
    public getMonths(): number { return this.n_months; }
    public getYears(): number { return this.n_years; }
    public getTimelineScale(): TimelineScale { return this.ts; }

    private isLeapYear;

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

        this.ts = new TimelineScale();

        console.log('Created TimeScale ts');
        var isLeapYear = require('dayjs/plugin/isLeapYear');

        console.log(Math.ceil(this.getYears()).toString());
        for (let i = 0; i < Math.ceil(this.getYears()); i++) {
            this.ts.yearScale[i] = new YearSeparator((this.d1.year() + i).toString(), 365 * i);
            // console.log('Log: yearText: ' + this.ts.yearScale[i].yearText);
            // console.log('Log: yearOffset: ' + this.ts.yearScale[i].yearOffset);
        }
        //console.log(this.ts.yearText);
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

////////////////////////////////////////////////////////////////
//  Support Classes and Interfaces
////////////////////////////////////////////////////////////////

export interface IYearScale {
    yearText: string;
    yearOffset: number;
}

export interface IMonthScale {
    monthText: string;
    monthOffset: number;
}

export class YearSeparator implements IYearScale {
    yearText: string;
    yearOffset: number;

    constructor(yearText: string, yearOffset: number) {
        this.yearText = yearText;
        this.yearOffset = yearOffset;
    }
}

export class MonthSeparator implements IMonthScale {
    monthText: string;
    monthOffset: number;

    constructor(monthText: string, monthOffset: number) {
        this.monthText = monthText;
        this.monthOffset = monthOffset;
    }
}

export class TimelineScale {
    yearScale: YearSeparator[];
    monthScale: MonthSeparator[];

    constructor(n_years?: number, n_months?: number) {
        console.log('new TimelineScale');
        this.yearScale = [];
        console.log('new YearSeparator');
        this.monthScale = [];
        console.log('new MonthSeparator');
    }
}