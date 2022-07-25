/**
 * Handle when more fields than roles
 *
 */
import * as dayjs from "dayjs";
import powerbi from "powerbi-visuals-api";
export declare class Configuration {
    private verbose;
    private bool_start;
    private bool_end;
    private bool_isMilestone;
    private bool_isCritical;
    private bool_statusDate;
    private valueMap;
    private vs;
    constructor();
    field(field: ValueFields, set?: boolean): boolean;
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
export declare enum ValueFields {
    START = "Start",
    END = "Finish",
    ISMILESTONE = "IsMilestone",
    ISCRITICAL = "IsCritical",
    STATUSDATE = "StatusDate"
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
