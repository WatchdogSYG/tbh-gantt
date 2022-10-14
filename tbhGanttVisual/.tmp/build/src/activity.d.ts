import * as dayjs from "dayjs";
export declare class Activity {
    private name;
    private level;
    private start;
    private end;
    private globalStatus;
    private baselineStart;
    private baselineFinish;
    getName(): string;
    getLevel(): number;
    getLevelString(): string;
    getStart(): dayjs.Dayjs;
    getEnd(): dayjs.Dayjs;
    getGlobalStatus(): dayjs.Dayjs;
    getTableText(): string[];
    setLevel(level: number): void;
    setStart(date: dayjs.Dayjs): void;
    setEnd(date: dayjs.Dayjs): void;
    setGlobalStatus(date: dayjs.Dayjs): void;
    constructor(name: string, level: number, start: dayjs.Dayjs, end: dayjs.Dayjs, globalStatus: dayjs.Dayjs);
}
export declare class ActivityStyle {
    private fillArray;
    constructor();
    fill(level: number): string;
}
