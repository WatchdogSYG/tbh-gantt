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
    test_monthsBetween(true);

    ////////////////////////////////////////////////////////////////
    console.log('LOG: The file /src/time.ts passed ' +
        passed.toString() +
        ' unit tests out of ' +
        total.toString() +
        ' unit tests. Pass rate: ' +
        (100 * passed / total).toString() + '%');

    return passed / total;
}

//example
export function test_totalDaysPerYear(verbose: boolean): number {
    return 0;
}

export function test_monthsBetween(verbose: boolean): number {
    let total: number = 0;
    let passed: number = 0;

    ////////////////////////////////////////////////////////////////
    let d1: Date = new Date(2000, 0, 1);
    let d2: Date = new Date(2000, 1, 1);
    console.log('TESTCASE: monthsBetween 1-Jan-2000 and 1-Feb-2000')

    if (verbose) {
        console.log('RESULT: ' + Time.monthsBetween(d1, d2).toString())
    }

    total++;
    if (Time.monthsBetween(d1, d2) == 12) {
        passed++;
        console.log("PASSED");
    } else {
        console.log("FAILED");
    }
    ////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////
    return passed / total;
}
