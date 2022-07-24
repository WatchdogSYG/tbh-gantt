/**
 * Handle more fields than roles
 *
 */
import powerbi from "powerbi-visuals-api";
export declare class Configuration {
    private verbose;
    private bool_start;
    private bool_end;
    private bool_isMilestone;
    private bool_isCritical;
    private bool_statusDate;
    constructor();
    field(field: ValueFields, set?: boolean): boolean;
    checkRoles(vs: powerbi.DataViewMetadataColumn[]): Configuration;
    printConfig(): string;
    logConfig(): void;
    valueRoles(): ValueFields[];
    drawGraph(): boolean;
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
