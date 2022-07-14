//Unit tests for time.ts

import * as dayjs from 'dayjs';
import * as Time from './../src/time'

/**
 * Runs unit tests for the file src/time.ts.
 * @param verbose Console shows verbose output if true
 * @returns The proportion of successful tests to failed tests
 */
export function runUnitTests(verbose: boolean): number {
    let total: number = 0;
    let passed: number = 0;
    ////////////////////////////////////////////////////////////////
    //total++;
    //passed += test_totalDaysPerYear();

    console.log('UNIT TEST: Time.isLeapYear()');
    total++;
    if (test_isLeapYear(false) == 1) { passed++; };

    console.log('UNIT TEST: Time.totalDaysPerYear()');
    total++;
    if (test_totalDaysPerYear(false) == 1) { passed++; };

    console.log('UNIT TEST: Time.spanMonths()');
    total++;
    if (test_spanMonths(true) == 1) { passed++; };

    ////////////////////////////////////////////////////////////////
    console.log('LOG: The file /src/time.ts passed ' +
        passed.toString() +
        ' unit tests out of ' +
        total.toString() +
        ' unit tests. Pass rate: ' +
        (100 * passed / total).toString() + '%');

    return passed / total;
}


////////////////////////////////////////////////////////////////
// TESTS
////////////////////////////////////////////////////////////////

export function test_isLeapYear(verbose: boolean): number {
    let total: number = 0;
    let passed: number = 0;

    let testArgs: number[] = [0, 1, 4, 1900, 2000, 2100, 2022, 2024, -1, -4, -400, -100, -69];
    let testAns: boolean[] = [true, false, true, false, true, false, false, true, false, true, true, false, false];

    for (let i = 0; i < testArgs.length; i++) {
        console.log('TESTCASE: year = ' + testArgs[i].toString())
        if (verbose) {
            console.log('RESULT: ' + Time.isLeapYear(testArgs[i]))
        }

        total++;
        if (Time.isLeapYear(testArgs[i]) == testAns[i]) {
            passed++;
            console.log("PASSED");
        } else {
            console.log("FAILED");
        }
    }

    return passed / total;
}

////////////////////////////////////////////////////////////////

export function test_totalDaysPerYear(verbose: boolean): number {
    let total: number = 0;
    let passed: number = 0;

    let testArgs: number[] = [2, 4, 2000, 2001, -1, -4];
    let testAns: number[] = [365, 366, 366, 365, 365, 366];

    for (let i = 0; i < testArgs.length; i++) {
        console.log('TESTCASE: year = ' + testArgs[i].toString())
        if (verbose) {
            console.log('RESULT: ' + Time.daysInYear(testArgs[i]))
        }

        total++;
        if (Time.daysInYear(testArgs[i]) == testAns[i]) {
            passed++;
            console.log("PASSED");
        } else {
            console.log("FAILED");
        }
    }

    return passed / total;
}

////////////////////////////////////////////////////////////////
export function test_spanMonths(verbose: boolean): number {
    var dayjs = require('dayjs');
    var utc = require('dayjs/plugin/utc');
    dayjs.extend(utc);

    let total: number = 0;
    let passed: number = 0;

    let testArgs: dayjs.Dayjs[][] = [
        [dayjs(new Date(2000, 0, 1)), dayjs(new Date(2000, 0, 1))],   //01 //identical dates
        [dayjs(new Date(2000, 0, 1)), dayjs(new Date(2001, 0, 1))],   //02 //exactly one year apart
        [dayjs(new Date(2000, 0, 1)), dayjs(new Date(2000, 5, 1))],   //03 //exactly 6 months apart
        [dayjs(new Date(2040, 4, 12)), dayjs(new Date(2040, 10, 7))], //04 //same year, arbitrary dates
        [dayjs(new Date(2000, 10, 1)), dayjs(new Date(2001, 1, 1))],  //05 //consecutive years
        [dayjs(new Date(2000, 10, 30)), dayjs(new Date(2001, 1, 1))], //06 //consecutive years && non-start of month
        [dayjs(new Date(2000, 9, 27)), dayjs(new Date(2001, 1, 3))],  //07 //consecutive years && arbitrary dates
        [dayjs(new Date(1999, 1, 1)), dayjs(new Date(2003, 1, 1))],   //08 //exactly n years apart, int n >=2
        [dayjs(new Date(1998, 5, 2)), dayjs(new Date(2004, 7, 19))],  //09 //more than 1 year apart && arbitrary dates

        [dayjs(new Date(2040, 9, 7)), dayjs(new Date(2040, 4, 12))],  //10 //reversed args, same year, arbitrary dates
        [dayjs(new Date(2001, 1, 3)), dayjs(new Date(2000, 9, 27))],  //11 //reversed args, consecutive years && arbitrary dates
        [dayjs(new Date(2004, 7, 19)), dayjs(new Date(1998, 5, 2))],  //12 //reversed args, more than 1 year apart && arbitrary dates
    ];

    let testAns: number[] = [
        1,  //01
        13, //02
        6,  //03
        7,  //04
        4,  //05
        4,  //06
        5,  //07
        49, //08
        75, //09

        6,  //10
        5,  //11
        75  //12
    ];


    for (let i = 0; i < testArgs.length; i++) {
        
        let a : dayjs.Dayjs = testArgs[i][0];
        let b : dayjs.Dayjs = testArgs[i][1];

        dayjs.utc().format();

        console.log('TESTCASE: date = ' + a.format() + ','+b.format());
        if (verbose) {
            console.log('RESULT: ' + Time.spanMonths(testArgs[i][0], testArgs[i][1]))
        }

        total++;
        if (Time.spanMonths(testArgs[i][0], testArgs[i][1]) == testAns[i]) {
            passed++;
            console.log("PASSED");
        } else {
            console.log("FAILED");
        }
    }

    return passed / total;
}

////////////////////////////////////////////////////////////////
