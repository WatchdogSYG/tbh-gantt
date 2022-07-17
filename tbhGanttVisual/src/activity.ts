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


    constructor(start: dayjs.Dayjs, end: dayjs.Dayjs, name: string) {
        this.start = start;
        this.end = end;
        this.name = name;


    }



}