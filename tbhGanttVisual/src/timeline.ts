//Class that contains properties and functions that deal with timeline and Offset

import * as dayjs from 'dayjs';
import * as Lib from './../src/lib';
import * as Time from './../src/time';

export class Timeline {

    ////////////////////////////////////////////////////////////////
    //  Define members
    ////////////////////////////////////////////////////////////////

    //--------DEV--------//
    private verbose: boolean = false;

    private d1: dayjs.Dayjs;
    private d2: dayjs.Dayjs;
    private n_days: number;
    private n_months: number;
    private n_years: number;
    private span_days: number;
    private span_months: number;
    private span_years: number;
    //--------SCALE--------//
    private dayScale: number;
    private weekScale: number;
    private yearScale: number;
    private monthScale: number[];
    private quarterScale: number[];

    private width: number;
    private height: number;

    private ts: TimeScale;

    ////////////////////////////////////////////////////////////////
    //  Get/Set
    ////////////////////////////////////////////////////////////////

    public getStart(): dayjs.Dayjs { return this.d1; }
    public getEnd(): dayjs.Dayjs { return this.d2; }
    public getDays(): number { return this.n_days; }
    public getDayScale(): number { return this.dayScale; }
    public getMonths(): number { return this.n_months; }
    public getYears(): number { return this.n_years; }
    public getTimeScale(): TimeScale { return this.ts; }
    public getPadding(): number { return this.padding; }

    ////////////////////////////////////////////////////////////////
    //  SVG Style
    ////////////////////////////////////////////////////////////////

    private padding: number;

    ////////////////////////////////////////////////////////////////
    //  Day.js
    ////////////////////////////////////////////////////////////////

    private isLeapYear: NodeRequire;

    ////////////////////////////////////////////////////////////////
    //  Constructor
    ////////////////////////////////////////////////////////////////

    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs) {

        var isLeapYear = require('dayjs/plugin/isLeapYear');

        //check which date is larger and round to nearest day
        if (start > end) {
            this.d1 = end.startOf('d');
            this.d2 = start.endOf('d');
        } else {
            this.d1 = start.startOf('d');
            this.d2 = end.endOf('d');
        }

        this.n_years = this.d2.diff(this.d1, 'y', true);
        this.n_months = this.d2.diff(this.d1, 'M', true);
        this.n_days = this.d2.diff(this.d1, 'd', true);
        // this.span_days;
        // this.span_months;
        this.span_years = Time.spanYears(start,end);

        this.padding = 5;
        this.dayScale = 1;



        if (this.verbose) {
            console.log('LOG: Timeline created from ' +
                this.d1.toISOString() + ' to ' +
                this.d2.toISOString() +
                ' spanning ' +
                this.n_days.toString() +
                ' days.');

            console.log('LOG: ' +
                this.n_years + ' years or ' +
                this.n_months + ' months or ' +
                this.n_days + ' days.');

            console.log('LOG: Timeline scale = ' + this.dayScale.toString());
        }

        this.ts = new TimeScale();
        console.log('Created TimeScale ts');

        this.ts.yearScale = this.generateYears();
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

    private generateYears(): YearSeparator[] {
        console.log('LOG: Generating YearSeparator array for timeline.');

        let result: YearSeparator[];
        let cumulativeOffset: number = 0;
        let proportion: number;

        //If the dates are in the same year, the loop will not return the correct value. Handle it here.      
        if (this.span_years == 0) { //same year, return year
            result = [new YearSeparator(this.d1.year().toString(), 0)];
            console.log(result);
            console.log('LOG: YearScale generation complete.');
            return result;
        }

        result = [];
        //the dates are not in the same year, run this loop
        for (let i = 0; i < this.span_years; i++) {
            if (this.verbose) {
                console.log('LOG: year index = ' + i);

                //check if we are considering the first or last year and calc the proportion of the section we want
                if (i == 0) {//this is the first year, take the portion of that year and create the offset. TODO check if the text will overlap

                    proportion = Time.remainingDaysInYear(this.d1);
                    proportion = proportion / Time.daysInYear(this.d1.year());
                    if (this.verbose) { console.log('LOG: proportion = ' + Time.remainingDaysInYear(this.d1) + '/' + Time.daysInYear(this.d1.year()) + ' = ' + proportion); }

                } else if (i == (this.span_years - 1)) { //this is the last year, take the last proportion to the beginning of the year. Same todo as above

                    proportion = Time.daysElapsedInYear(this.d2);
                    proportion = proportion / Time.daysInYear(this.d2.year());
                    if (this.verbose) { console.log('LOG: proportion = ' + Time.daysElapsedInYear(this.d2) + '/' + Time.daysInYear(this.d2.year()) + ' = ' + proportion); }

                } else { //somewhere in the middle

                    proportion = 1;
                    if (this.verbose) { console.log('LOG: proportion = ' + proportion); }

                }

                result[i] = new YearSeparator((
                    this.d1.year() + i).toString(),
                    cumulativeOffset
                );
                if (this.verbose) { console.log('LOG: created new YearSeparator(' + (this.d1.year() + i) + ', ' + cumulativeOffset + ') at this.ts.yearScale[' + i + ']'); }

                cumulativeOffset += Time.daysInYear(this.d1.year()) * this.dayScale * proportion;
            }


        }
        console.log(result);
        console.log('LOG: YearScale generation complete.');
        return result;
    }

    private generateMonths() {
        console.log('LOG: Generating MonthSeparator array for timeline.');

        let result: MonthSeparator[];
        let cumulativeOffset: number = 0;
        let proportion: number;

        //If the dates are in the same year, the loop will not return the correct value. Handle it here.      
        if (this.span_months == 0) { //same year, return year
            result = [new MonthSeparator(this.d1.year().toString(), 0)];
            console.log(result);
            console.log('LOG: MonthSeparator array generation complete.');
            return result;
        }

        result = [];
        //the dates are not in the same year, run this loop
        for (let i = 0; i < this.span_years; i++) {
            if (this.verbose) {
                console.log('LOG: year index = ' + i);

                //check if we are considering the first or last year and calc the proportion of the section we want
                if (i == 0) {//this is the first year, take the portion of that year and create the offset. TODO check if the text will overlap

                    proportion = Time.remainingDaysInYear(this.d1);
                    proportion = proportion / Time.daysInYear(this.d1.year());
                    if (this.verbose) { console.log('LOG: proportion = ' + Time.remainingDaysInYear(this.d1) + '/' + Time.daysInYear(this.d1.year()) + ' = ' + proportion); }

                } else if (i == (this.span_years - 1)) { //this is the last year, take the last proportion to the beginning of the year. Same todo as above

                    proportion = Time.daysElapsedInYear(this.d2);
                    proportion = proportion / Time.daysInYear(this.d2.year());
                    if (this.verbose) { console.log('LOG: proportion = ' + Time.daysElapsedInYear(this.d2) + '/' + Time.daysInYear(this.d2.year()) + ' = ' + proportion); }

                } else { //somewhere in the middle

                    proportion = 1;
                    if (this.verbose) { console.log('LOG: proportion = ' + proportion); }

                }

                result[i] = new MonthSeparator((
                    this.d1.year() + i).toString(),
                    cumulativeOffset
                );
                if (this.verbose) { console.log('LOG: created new MonthSeparator(' + (this.d1.year() + i) + ', ' + cumulativeOffset + ') at this.ts.monthScale[' + i + ']'); }

                cumulativeOffset += Time.daysInYear(this.d1.year()) * this.dayScale * proportion;
            }


        }
        console.log(result);
        console.log('LOG: MonthSeparator array generation complete.');
        return result;
    }

    ////////////////////////////////////////////////////////////////
    //  Support Functions
    ////////////////////////////////////////////////////////////////

    private updateScaleFactors() {
        this.weekScale = this.dayScale * 7;
        this.yearScale = this.dayScale * 365;
        for (let i = 0; i < 12; i++) { this.monthScale[i] = this.dayScale[i] * Time.daysInMonth[i]; }
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

export class TimeScale {
    yearScale: YearSeparator[];
    monthScale: MonthSeparator[];

    constructor() {
        this.yearScale = [];
        this.monthScale = [];
    }
}