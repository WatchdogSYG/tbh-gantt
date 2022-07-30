import * as dayjs from "dayjs";

export class Activity {

    private name: string;
    private level: number;
    private start: dayjs.Dayjs;
    private end: dayjs.Dayjs;
    private globalStatus: dayjs.Dayjs;

    public getName(): string { return this.name; }
    public getLevel(): number { return this.level; }
    public getLevelString(): string { 
        console.log('getLevelString(): ',this.getName(), this.level, 'indent'.concat(this.level.toString()));
        
        
        return 'indent'.concat(this.level.toString()); } //required for workaround, search for @indentTypeMismatch in visual.ts
    public getStart(): dayjs.Dayjs { return this.start; }
    public getEnd(): dayjs.Dayjs { return this.end; }
    public getGlobalStatus(): dayjs.Dayjs { return this.globalStatus; }

    public getTableText(): string[] { return [this.name, this.start.format('DD/MM/YY'), this.end.format('DD/MM/YY')]; }

    public setLevel(level: number) { this.level = level; }
    public setStart(date: dayjs.Dayjs) { this.start = date; }
    public setEnd(date: dayjs.Dayjs) { this.end = date; }
    public setGlobalStatus(date: dayjs.Dayjs) { this.globalStatus = date; }

    constructor(name: string, level: number, start: dayjs.Dayjs, end: dayjs.Dayjs, globalStatus: dayjs.Dayjs) {
        this.name = name;
        this.level = level;
        this.start = start;
        this.end = end;
        this.globalStatus = globalStatus;
    }
}

export class ActivityStyle {

    //TODO: get the styles at runtume
    private fillArray: string[] = [
        '#2A588E',
        '#3B6064',
        '#55828B',
        '#87BBA2',
        '#A4E1C9',
        'gray'
    ];

    constructor() {
    }

    public fill(level: number): string {
        return this.fillArray[Math.min(Math.floor(level), this.fillArray.length)];
    }
}