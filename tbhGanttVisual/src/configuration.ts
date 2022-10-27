//TODO

/**
 * Handle when more fields than roles
 * 
 */

import * as dayjs from "dayjs";
import powerbi from "powerbi-visuals-api";

export enum ValueFields {
    //Ensure that the order of the ValueFields enums are the same as defined in the dataRoles array
    //in the capabilities.json file.
    START = 'Start',
    END = 'Finish',
    BASELINESTART = 'BaselineStart',
    BASELINEFINISH = 'BaselineFinish',
    ISMILESTONE = 'IsMilestone',
    ISCRITICAL = 'IsCritical',
    STATUSDATE = 'StatusDate'

}

export class Configuration {

    private verbose = true;

    private bool_start: boolean; //start      
    private bool_end: boolean; //end        
    private bool_isMilestone: boolean; //isMilestone
    private bool_isCritical: boolean; //isCritical 
    private bool_statusDate: boolean; //statusDate
    private bool_baselineStart: boolean; //baselineStart  
    private bool_baselineFinish: boolean; //baselineFinish

    private valueMap: Map<ValueFields, number>;

    private vs: powerbi.DataViewMetadataColumn[];

    constructor() {
        this.bool_start = false;
        this.bool_end = false;
        this.bool_isMilestone = false;
        this.bool_isCritical = false;
        this.bool_statusDate = false;
        this.bool_baselineStart = false;
        this.bool_baselineFinish = false;
        this.vs = [];
        this.valueMap = new Map<ValueFields, number>;
    }

    /**
     * 
     * @param field the ValueFields to check or set
     * @param set if this variable is not null, set the corresponding boolean in the configuration
     * @returns the boolean value associated with the ValueFields (singular) provided
     */
    public field(field: ValueFields, set?: boolean): boolean {
        if (set != null) {
            switch (field) {
                case ValueFields.START: this.bool_start = set; break;
                case ValueFields.END: this.bool_end = set; break;
                case ValueFields.ISMILESTONE: this.bool_isMilestone = set; break;
                case ValueFields.ISCRITICAL: this.bool_isCritical = set; break;
                case ValueFields.STATUSDATE: this.bool_statusDate = set; break;
                case ValueFields.BASELINESTART: this.bool_baselineStart = set; break;
                case ValueFields.BASELINEFINISH: this.bool_baselineFinish = set; break;
            }
        }
        switch (field) {
            case ValueFields.START: return this.bool_start;
            case ValueFields.END: return this.bool_end;
            case ValueFields.ISMILESTONE: return this.bool_isMilestone;
            case ValueFields.ISCRITICAL: return this.bool_isCritical;
            case ValueFields.STATUSDATE: return this.bool_statusDate;
            case ValueFields.BASELINESTART: return this.bool_baselineStart;
            case ValueFields.BASELINEFINISH: return this.bool_baselineFinish;
        }
    }

    /**
     * returns a Configuration object with members set based on the vs (valueSource of a DataView.matrix object).
     * @param vs a powerbi.DataViewMetadataColumn array
     * @returns a configured Configuration object
     */
    public checkRoles(vs: powerbi.DataViewMetadataColumn[]): Configuration {
        this.vs = vs;

        if (this.verbose) { console.log('LOG: number of valuesource items: ' + vs.length); }
        let r: ValueFields[] = this.valueRoles();
        let valueSourceIndex = 0;

        for (let i = 0; (i < r.length) && (valueSourceIndex < vs.length); i++) {
            console.log('vs[' + valueSourceIndex + '] = ' + vs[valueSourceIndex].roles + ', r[' + i + '] = ' + r[i]);
            if (vs[valueSourceIndex].roles[r[i]] == true) {
                this.field(r[i], true);
                this.valueMap.set(r[valueSourceIndex], valueSourceIndex);
                valueSourceIndex++;
            } else {
                this.field(r[i], false);//must explicitly set in case a field is removed
            }

            this.logConfig();

        }

        if (this.verbose) {
            console.log(this.valueMap.get(ValueFields.START));
            console.log(this.valueMap.get(ValueFields.END));
            console.log(this.valueMap.get(ValueFields.BASELINESTART));
            console.log(this.valueMap.get(ValueFields.BASELINEFINISH));
            console.log(this.valueMap.get(ValueFields.ISCRITICAL));
            console.log(this.valueMap.get(ValueFields.ISMILESTONE));
            console.log(this.valueMap.get(ValueFields.STATUSDATE));
        }

        return this;
    }

    public getValueMap(key: ValueFields): number {
        return this.valueMap.get(key);
    }

    public printConfig(): string {
        return ValueFields.START + ' = ' + this.bool_start + '\n' +
            ValueFields.END + ' = ' + this.bool_end + '\n' +
            ValueFields.BASELINESTART + ' = ' + this.bool_baselineStart + '\n' +
            ValueFields.BASELINEFINISH + ' = ' + this.bool_baselineFinish +
            ValueFields.ISMILESTONE + ' = ' + this.bool_isMilestone + '\n' +
            ValueFields.ISCRITICAL + ' = ' + this.bool_isCritical + '\n' +
            ValueFields.STATUSDATE + ' = ' + this.bool_statusDate + '\n';
    }

    public logConfig() {
        console.log(this.printConfig());
    }

    public drawGraph(): boolean {
        if (this.bool_start && this.bool_end) {
            return true;
        }
        return false;
    }

    public startFilter(start: dayjs.Dayjs): dayjs.Dayjs {
        if (this.bool_start) { return start; } else { return null; }
    }

    public endFilter(end: dayjs.Dayjs): dayjs.Dayjs {
        if (this.bool_end) { return end; } else { return null; }
    }

    public statusFilter(status: dayjs.Dayjs): dayjs.Dayjs {
        if (this.bool_statusDate) { return status; } else { return null; }
    }

    public getDisplayNames(): string[] {
        let s: string[] = ['Activity'];
        if (this.vs.length == 0) {
            console.log('WARN: No values provided to display.')
        } else {
            for (let i = 0; i < this.vs.length; i++) {
                console.log(this.vs[i].displayName);
                s.push(this.vs[i].displayName);
            }
        }
        return s;
    }

    public valueRoles(): ValueFields[] {
        return [
            ValueFields.START,
            ValueFields.END,
            ValueFields.BASELINESTART,
            ValueFields.BASELINEFINISH,
            ValueFields.ISMILESTONE,
            ValueFields.ISCRITICAL,
            ValueFields.STATUSDATE,

        ];
    }

    public configurationBooleans(): boolean[] {
        return [
            this.bool_start,
            this.bool_end,
            this.bool_baselineStart,
            this.bool_baselineFinish,
            this.bool_isMilestone,
            this.bool_isCritical,
            this.bool_statusDate,

        ];
    }
}

/**
 * 1
 * 2
 * 3
 * 4
 * 5
 * 6
 * 
 * 1
 * 2
 * 4
 * 5
 * 
 * 11Y
 * 22Y
 * 34N
 * 44Y
 * 
 * Always tick the r index
 * Tick the valueSourcesIndex when match
 */