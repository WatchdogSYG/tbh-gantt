import * as dayjs from "dayjs";
export declare class Activity {
    private level;
    private name;
    private start;
    private end;
    getStart(): dayjs.Dayjs;
    getEnd(): dayjs.Dayjs;
    getName(): string;
    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs, name: string);
}
