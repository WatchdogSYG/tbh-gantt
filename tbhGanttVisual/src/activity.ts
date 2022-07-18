import * as dayjs from "dayjs";
import powerbi from "powerbi-visuals-api";


export class Activity {

    private level: number;
    private name: string;
    private start: dayjs.Dayjs;
    private end: dayjs.Dayjs;

    public getStart(): dayjs.Dayjs { return this.start; }
    public getEnd(): dayjs.Dayjs { return this.end; }
    public getName(): string { return this.name; }
    public getLevel(): number { return this.level; }

    constructor(name: string, start: dayjs.Dayjs, end: dayjs.Dayjs, level: number) {
        this.start = start;
        this.end = end;
        this.name = name;
        this.level = level;


    }

    public setStart(date: dayjs.Dayjs) {
        this.start = date;
    }
    public setEnd(date: dayjs.Dayjs) {
        this.end = date;
    }
}