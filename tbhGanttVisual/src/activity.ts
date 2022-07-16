import * as dayjs from "dayjs";


export class Activity {
    name: string;
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;

    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs, name: string) {
        this.name = name;
        this.start = start;
        this.end = end;
    }

    public getName() { return this.name; }
    public getStart() { return this.start; }
    public getEnd() { return this.end; }
}