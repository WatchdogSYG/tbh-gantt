//A header lib for date and time fns

const month : string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export class TimeConversions {

    private static monthArray: string[] = [
        'January',

        'February',

        'March',

        'April',

        'May',

        'June',

        'July',

        'August',

        'September',

        'October',

        'November',

        'December'];

    private static mmmArray: string[] = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'];

    private static mArray: string[] = [
        'J',
        'F',
        'M',
        'A',
        'M',
        'J',
        'J',
        'A',
        'S',
        'O',
        'N',
        'D'
    ];

    private static daysPerMonthArray: number[] = [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31];

    private static hoursPerDay(): number {
        return 24;
    }
    private static daysPerMonth(index): number {
        return this.daysPerMonthArray[parseInt(index.toString())];
    }
    private static monthsPerYear(): number {
        return 12;
    }

    public static daysPerYear(): number {
        return 365;
    }

    private static month(index: number): string {
        return this.monthArray[parseInt(index.toString())];
    }

    private static mmm(index: number): string {
        return this.mmmArray[parseInt(index.toString())];
    }
    private static m(index: number): string {
                return this.mArray[parseInt(index.toString())];
    }
}