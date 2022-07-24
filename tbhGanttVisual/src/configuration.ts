//TODO

/**
 * Handle more fields than roles
 * 
 */


import powerbi from "powerbi-visuals-api";

export class Configuration {

    private verbose = false;
    private bool_start: boolean; //start      
    private bool_end: boolean; //end        
    private bool_isMilestone: boolean; //isMilestone
    private bool_isCritical: boolean; //isCritical 
    private bool_statusDate: boolean; //statusDate 


    constructor() {
        this.bool_start = false;
        this.bool_end = false;
        this.bool_isMilestone = false;
        this.bool_isCritical = false;
        this.bool_statusDate = false;
    }

    public field(field: ValueFields, set?: boolean): boolean {
        if (set != null) {
            switch (field) {
                case ValueFields.START: this.bool_start = set; break;
                case ValueFields.END: this.bool_end = set; break;
                case ValueFields.ISMILESTONE: this.bool_isMilestone = set; break;
                case ValueFields.ISCRITICAL: this.bool_isCritical = set; break;
                case ValueFields.STATUSDATE: this.bool_statusDate = set; break;
            }
        }

        switch (field) {
            case ValueFields.START: return this.bool_start;
            case ValueFields.END: return this.bool_end;
            case ValueFields.ISMILESTONE: return this.bool_isMilestone;
            case ValueFields.ISCRITICAL: return this.bool_isCritical;
            case ValueFields.STATUSDATE: return this.bool_statusDate;
        }
    }

    public checkRoles(vs: powerbi.DataViewMetadataColumn[]): Configuration {

        if (this.verbose) { console.log('LOG: number of valuesource items: ' + vs.length); }

        let r: ValueFields[] = this.valueRoles();

        let valueSourceIndex = 0
        for (let i = 0; (i < r.length) && (valueSourceIndex < vs.length); i++) {
            //console.log('vs[' + valueSourceIndex + '] = ' + vs[valueSourceIndex].roles + ', r[' + i + '] = ' + r[i]);

            if (vs[valueSourceIndex].roles[r[i]] == true) {
                this.field(r[i], true);
                valueSourceIndex++;
            }
            //this.logConfig();
        }

        return this;
    }
    public printConfig(): string {
        return 'START       = ' + this.bool_start + '\n' +
            'FINISH      = ' + this.bool_end + '\n' +
            'ISMILESTONE = ' + this.bool_isMilestone + '\n' +
            'ISCRITICAL  = ' + this.bool_isCritical + '\n' +
            'STATUSDATE  = ' + this.bool_statusDate;
    }

    public logConfig() {
        console.log(this.printConfig());
    }

    public valueRoles(): ValueFields[] {
        return [
            ValueFields.START,
            ValueFields.END,
            ValueFields.ISMILESTONE,
            ValueFields.ISCRITICAL,
            ValueFields.STATUSDATE
        ];
    }

    public drawGraph(): boolean {
        if (this.bool_start && this.bool_end) {
            return true;
        }
        return false;
    }
}

export enum ValueFields {
    START = 'Start',
    END = 'Finish',
    ISMILESTONE = 'IsMilestone',
    ISCRITICAL = 'IsCritical',
    STATUSDATE = 'StatusDate'
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