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
    getLevelString(): string;
    getTableText(): string[];
    setStart(date: dayjs.Dayjs): void;
    setEnd(date: dayjs.Dayjs): void;
    constructor(name: string, start: dayjs.Dayjs, end: dayjs.Dayjs, level: number);
}
