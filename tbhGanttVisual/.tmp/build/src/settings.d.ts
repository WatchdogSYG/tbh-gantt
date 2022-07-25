import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;
export declare class VisualSettings extends DataViewObjectsParser {
    userFormatting: userFormattingSettings;
}
export declare class userFormattingSettings {
    defaultColor: string;
    showAllDataPoints: boolean;
    fill: string;
    fontSize: number;
}
