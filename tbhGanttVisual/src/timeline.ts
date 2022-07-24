//Class that contains properties and functions that deal with timeline and Offset
//FUNCTIONALITY
// Year support
// Month support

//TODO status and data datae lines?

import * as dayjs from 'dayjs';
import * as Lib from './../src/lib';
import * as Time from './../src/time';

export class Timeline {

    ////////////////////////////////////////////////////////////////
    //  Define members
    ////////////////////////////////////////////////////////////////

    //--------DEV--------//
    verbose: boolean = false;

    private d1: dayjs.Dayjs;
    private d2: dayjs.Dayjs;
    private status: dayjs.Dayjs;
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

    //simple getters and setters
    public getStart(): dayjs.Dayjs { return this.d1; }
    public getEnd(): dayjs.Dayjs { return this.d2; }
    public getStatus(): dayjs.Dayjs { return this.status; }
    public getDays(): number { return this.n_days; }
    public getDayScale(): number { return this.dayScale; }
    public getMonths(): number { return this.n_months; }
    public getYears(): number { return this.n_years; }
    public getTimeScale(): TimeScale { return this.ts; }
    public getYearPadding(): number { return this.yearPadding; }
    public getMonthPadding(): number { return this.monthPadding; }

    //getters and setters with updates
    public setYearPadding(padding: number) {

    }

    ////////////////////////////////////////////////////////////////
    //  SVG Style
    ////////////////////////////////////////////////////////////////

    private yearPadding: number;
    private monthPadding: number;

    ////////////////////////////////////////////////////////////////
    //  Constructor
    ////////////////////////////////////////////////////////////////

    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs, status: dayjs.Dayjs) {
        if (this.verbose) { console.log('LOG: Constructing Timeline Object'); }
        this.defineTimeline(start, end, status);
    }


    public defineTimeline(start: dayjs.Dayjs, end: dayjs.Dayjs, status: dayjs.Dayjs) {
        //check which date is larger and round to nearest day
        if (start > end) {
            this.d1 = end.startOf('d');
            this.d2 = start.endOf('d');
        } else {
            this.d1 = start.startOf('d');
            this.d2 = end.endOf('d');
        }

        this.status = status;

        this.n_years = this.d2.diff(this.d1, 'y', true);
        this.n_months = this.d2.diff(this.d1, 'M', true);
        this.n_days = this.d2.diff(this.d1, 'd', true);
        // this.span_days;
        this.span_months = Time.spanMonths(start, end);
        this.span_years = Time.spanYears(start, end);

        this.yearPadding = 5;
        this.dayScale = 2;


        this.updateScaleFactors();
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
        if (this.verbose) { console.log('LOG: Created TimeScale ts'); }

        this.ts.yearScale = this.generateYears();
        this.ts.monthScale = this.generateMonths();
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

    public setDayScaleByContainerWidth(containerWidth: number) {

    }

    ////////////////////////////////////////////////////////////////
    //  Timeline Style Functions
    ////////////////////////////////////////////////////////////////

    /**
     * Returns an array of YearSeparators based on the start and finish dates of the timeline.
     * The text is currently left aligned only. (text-align: start;)
     * TODO: consider if there needs to be start and end date arguments or if it should just read the member variables.
     * 
     * @returns an array of YearSeparators which determine the content and positioning of Year 
     * display elements in the timeline based on the start and finish dates.
     */
    private generateYears(): YearSeparator[] {
        if (this.verbose) { console.log('LOG: Generating YearSeparator array for timeline.'); }

        //console.log(document.body.clientHeight);
        let result: YearSeparator[];
        let cumulativeOffset: number = 0;
        let proportion: number;

        //If the dates are in the same year, the loop will not return the correct value. Handle it here.      
        if (this.span_years == 0) { //same year, return year
            result = [new YearSeparator(this.d1.year().toString(), 0, this.yearPadding)];
            if (this.verbose) {
                console.log(result);
                console.log('LOG: YearScale generation complete.');
            }
            return result;
        }

        //the dates are not in the same year, run this loop
        result = [];
        for (let i = 0; i < this.span_years; i++) {
            if (this.verbose) { console.log('LOG: year index = ' + i); }

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
                cumulativeOffset,
                this.yearPadding
            );
            if (this.verbose) { console.log('LOG: created new YearSeparator(' + (this.d1.year() + i) + ', ' + cumulativeOffset + ') at this.ts.yearScale[' + i + ']'); }

            cumulativeOffset += Time.daysInYear(this.d1.year() + i) * this.dayScale * proportion;
        }

        if (this.verbose) {
            console.log(result);
            console.log('LOG: YearScale generation complete.');
        }

        return result;
    }

    /**
 * Returns an array of MonthSeparators based on the start and finish dates of the timeline. 
 * The text is currently middle aligned only. (text-align: middle;)
 * TODO: consider if there needs to be start and end date arguments or if it should just read the member variables.
 * 
 * @returns an array of MonthSeparators which determine the content and positioning of Month 
 * display elements in the timeline based on the start and finish dates.
 */
    private generateMonths(): MonthSeparator[] {
        if (this.verbose) { console.log('LOG: Generating MonthSeparator array for timeline.'); }

        let result: MonthSeparator[];
        let cumulativeOffset: number = 0;
        let proportion: number;

        //If the dates are in the same year, the loop will not return the correct value. Handle it here.      
        if (this.span_months == 0) { //same month, return month
            result = [new MonthSeparator(Time.month(this.d1.month()), 0, Time.daysInMonth(this.d1.month(), this.d1.year()) / 2)];
            if (this.verbose) {
                console.log(result);
                console.log('LOG: MonthSeparator array generation complete.');
            }
            return result;
        }

        //the dates are not in the same month, run this loop
        result = [];
        for (let i = 0; i < this.span_months; i++) {

            //check if we are considering the first or last month and calc the proportion of the section we want
            if (i == 0) {//this is the first month, take the portion of that month and create the offset. TODO check if the text will overlap

                proportion = Time.remainingDaysInMonth(this.d1);
                proportion = proportion / Time.daysInMonth(this.d1.month(), this.d1.year());
                if (this.verbose) { console.log('LOG: first proportion = ' + Time.remainingDaysInMonth(this.d1) + '/' + Time.daysInMonth(this.d1.month(), this.d1.year()) + ' = ' + proportion); }

            } else if (i == (this.span_months - 1)) { //this is the last year, take the last proportion to the beginning of the year. Same todo as above

                proportion = Time.daysElapsedInMonth(this.d2);
                proportion = proportion / Time.daysInMonth(this.d2.month(), this.d1.year());
                if (this.verbose) { console.log('LOG: last proportion = ' + Time.daysElapsedInMonth(this.d2) + '/' + Time.daysInMonth(this.d2.month(), this.d1.year()) + ' = ' + proportion); }

            } else { //somewhere in the middle

                proportion = 1;
                if (this.verbose) { console.log('LOG: proportion = ' + proportion); }

            }

            result[i] = new MonthSeparator(
                Time.m(this.d1.month() + i),
                cumulativeOffset,
                Time.daysInMonth(this.d1.month() + i, this.d1.year()) / 2
            );
            if (this.verbose) { console.log('LOG: created new MonthSeparator(' + Time.month(this.d1.month() + i) + ', ' + cumulativeOffset + ') at this.ts.monthScale[' + i + '] with dOffset ' + (Time.daysInMonth(this.d1.month() + i, this.d1.year()) * this.dayScale * proportion) + 'px'); }

            cumulativeOffset += Time.daysInMonth(this.d1.month() + i, this.d1.year()) * this.dayScale * proportion;
        }

        //check small month dimension
        if (result[1].offset < (0.75 * this.dayScale * Time.daysInMonth(this.d1.month() + 1, this.d1.year()))) {
            result[0].text = '';
        }

        if (this.verbose) {
            console.log(result);
            console.log('LOG: MonthSeparator array generation complete.');
        }

        return result;
    }

    ////////////////////////////////////////////////////////////////
    //  Support Functions
    ////////////////////////////////////////////////////////////////

    /**
     * Updates the weekScale, quarterScale, and yearScale member variables based on the dayScale member variable.
     */
    private updateScaleFactors() {
        this.weekScale = this.dayScale * 7;
        this.yearScale = this.dayScale * 365;
        this.monthScale = [];
        for (let i = 0; i < 12; i++) { this.monthScale[i] = this.dayScale[i] * Time.daysInMonth[i]; }
        this.quarterScale = [];
        this.quarterScale[0] = this.monthScale[0] + this.monthScale[1] + this.monthScale[2];
        this.quarterScale[1] = this.monthScale[3] + this.monthScale[4] + this.monthScale[5];
        this.quarterScale[2] = this.monthScale[6] + this.monthScale[7] + this.monthScale[8];
        this.quarterScale[3] = this.monthScale[9] + this.monthScale[10] + this.monthScale[11];
    }

    /**
     * Converts a Day.js date to a horizontal offset on the chart based on the Timeline scale.
     * @param date the date to convert
     * @returns the location from the left edge of the chart the input date corresponds to
     */
    public dateLocation(date: dayjs.Dayjs): number {
        return date.diff(this.d1, 'd', true) * this.dayScale;
    }

    /**
     * Converts the status date to a horizontal offset on the chart based on the Timeline scale. Similar to Timeline.dateLocation(date: dayjs.Dayjs).
     * @returns The location from the left edge of the chart the current status date corresponds to
     */
    public statusDateLocation(): number {
        return this.dateLocation(this.status);
    }
}

////////////////////////////////////////////////////////////////
//  Support Classes and Interfaces
////////////////////////////////////////////////////////////////

export interface ISeparator {
    text: string;
    offset: number;
    textAnchorOffset: number;
}

export class YearSeparator implements ISeparator {
    text: string;
    offset: number;
    textAnchorOffset: number;

    constructor(yearText: string, yearOffset: number, textAnchorOffset: number) {
        this.text = yearText;
        this.offset = yearOffset;
        this.textAnchorOffset = textAnchorOffset;
    }
}

export class MonthSeparator implements ISeparator {
    text: string;
    offset: number;
    textAnchorOffset: number;
    constructor(monthText: string, monthOffset: number, textAnchorOffset: number) {
        this.text = monthText;
        this.offset = monthOffset;
        this.textAnchorOffset = textAnchorOffset;

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