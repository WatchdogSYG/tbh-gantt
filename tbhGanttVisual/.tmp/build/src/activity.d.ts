import * as dayjs from "dayjs";
export declare class Activity {
    name: string;
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs, name: string);
    getName(): string;
    getStart(): dayjs.Dayjs;
    getEnd(): dayjs.Dayjs;
}
