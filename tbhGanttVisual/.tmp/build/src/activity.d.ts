import * as dayjs from "dayjs";
export declare class Activity {
    private name;
    private level;
    private start;
    private end;
    private globalStatus;
    private baselineStart;
    private baselineFinish;
    private milestone;
    getName(): string;
    getLevel(): number;
    getLevelString(): string;
    getStart(): dayjs.Dayjs;
    getEnd(): dayjs.Dayjs;
    getBaselineStart(): dayjs.Dayjs;
    getBaselineFinish(): dayjs.Dayjs;
    getGlobalStatus(): dayjs.Dayjs;
    isMilestone(): boolean;
    getTableText(): string[];
    setLevel(level: number): void;
    setStart(date: dayjs.Dayjs): void;
    setEnd(date: dayjs.Dayjs): void;
    setBaselineStart(date: dayjs.Dayjs): void;
    setBaselineFinish(date: dayjs.Dayjs): void;
    setGlobalStatus(date: dayjs.Dayjs): void;
    setMilestone(isMilestone: boolean): void;
    constructor(name: string, level: number, start: dayjs.Dayjs, end: dayjs.Dayjs, globalStatus: dayjs.Dayjs);
}
export declare class ActivityStyle {
    private fillArray;
    constructor();
    fill(level: number): string;
}
