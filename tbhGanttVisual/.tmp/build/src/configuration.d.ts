/**
 * Handle when more fields than roles
 *
 */
import * as dayjs from "dayjs";
import powerbi from "powerbi-visuals-api";
export declare enum ValueFields {
    START = "Start",
    END = "Finish",
    BASELINESTART = "BaselineStart",
    BASELINEFINISH = "BaselineFinish",
    ISMILESTONE = "IsMilestone",
    ISCRITICAL = "IsCritical",
    STATUSDATE = "StatusDate"
}
export declare class Configuration {
    private verbose;
    private bool_start;
    private bool_end;
    private bool_isMilestone;
    private bool_isCritical;
    private bool_statusDate;
    private bool_baselineStart;
    private bool_baselineFinish;
    private valueMap;
    private vs;
    constructor();
    /**
     *
     * @param field the ValueFields to check or set
     * @param set if this variable is not null, set the corresponding boolean in the configuration
     * @returns the boolean value associated with the ValueFields (singular) provided
     */
    field(field: ValueFields, set?: boolean): boolean;
    /**
     * returns a Configuration object with members set based on the vs (valueSource of a DataView.matrix object).
     * @param vs a powerbi.DataViewMetadataColumn array
     * @returns a configured Configuration object
     */
    checkRoles(vs: powerbi.DataViewMetadataColumn[]): Configuration;
    getValueMap(key: ValueFields): number;
    printConfig(): string;
    logConfig(): void;
    drawGraph(): boolean;
    startFilter(start: dayjs.Dayjs): dayjs.Dayjs;
    endFilter(end: dayjs.Dayjs): dayjs.Dayjs;
    statusFilter(status: dayjs.Dayjs): dayjs.Dayjs;
    getDisplayNames(): string[];
    valueRoles(): ValueFields[];
    configurationBooleans(): boolean[];
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
