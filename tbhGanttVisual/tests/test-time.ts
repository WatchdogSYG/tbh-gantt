//Unit tests for time.ts

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

    total++;
    if (test_isLeapYear(true) == 1) { passed++; };
    total++;
    if (test_totalDaysPerYear(true) == 1) { passed++; };

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

//example
export function test_totalDaysPerYear(verbose: boolean): number {
    return 0;
}

export function test_isLeapYear(verbose: boolean): number {
    let total: number = 0;
    let passed: number = 0;

    ////////////////////////////////////////////////////////////////

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

    ////////////////////////////////////////////////////////////////
    return passed / total;
}

export function test_totalDaysPeryear(verbose: boolean): number {
    let total: number = 0;
    let passed: number = 0;

    ////////////////////////////////////////////////////////////////

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

    ////////////////////////////////////////////////////////////////
    return passed / total;
}
