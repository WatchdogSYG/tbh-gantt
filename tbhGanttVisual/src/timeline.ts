//Class that contains properties and functions that deal with timeline and spacing

import { timeDay } from 'd3';
import * as Lib from './../src/lib';
import * as Time from './../src/time';

export class Timeline {

    ////////////////////////////////////////////////////////////////
    //  Define members
    ////////////////////////////////////////////////////////////////

    //--------DEV--------//
    private verbose: boolean = true;

    private d1: Date;
    private d2: Date;
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

    public getStart(): Date { return this.d1; }
    public getEnd(): Date { return this.d2; }
    public getDays(): number { return this.n_days; }
    public getDayScale(): number { return this.dayScale; }
    public getMonths(): number { return this.n_months; }
    public getyears(): number { return this.n_years; }

    ////////////////////////////////////////////////////////////////
    //  Constructor
    ////////////////////////////////////////////////////////////////

    constructor(start: Date, end: Date) {
        this.d1 = start;
        this.d2 = end;
        console.log(this.d1, this.d2, Time.daysBetween(this.d1, this.d2,1))
        this.n_days = Time.daysBetween(this.d1, this.d2,1);
        this.n_years = Time.yearsBetween(this.d1, this.d2,-1);
        // this.n_months = 
        this.dayScale = 1;

        if (this.verbose) {
            console.log('LOG: Timeline created from ' +
                start.toISOString() + ' to ' +
                end.toISOString() +
                ' spanning ' +
                this.n_days.toString() +
                ' days.');

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