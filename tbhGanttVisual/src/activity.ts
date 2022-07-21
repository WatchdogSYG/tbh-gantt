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
    public getLevelString(): string { return 'indent'.concat(this.level.toString()); } //required for workaround, search for @indentTypeMismatch in visual.ts
    public getTableText(): string[] { return [this.name, this.start.format('DD/MM/YY'), this.end.format('DD/MM/YY')]; }

    public setStart(date: dayjs.Dayjs) { this.start = date; }
    public setEnd(date: dayjs.Dayjs) { this.end = date; }
    public setLevel(level: number) { this.level = level; }

    constructor(name: string, start: dayjs.Dayjs, end: dayjs.Dayjs, level: number) {
        this.start = start;
        this.end = end;
        this.name = name;
        this.level = level;
    }
}