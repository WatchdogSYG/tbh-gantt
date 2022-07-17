import * as dayjs from "dayjs";
export declare class Activity {
    private level;
    private name;
    private start;
    private end;
    getStart(): dayjs.Dayjs;
    getEnd(): dayjs.Dayjs;
    getName(): string;
    getLevel(): number;
    constructor(name: string, start: dayjs.Dayjs, end: dayjs.Dayjs, level: number);
}
