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

    total++;
    passed += test_totalDaysPerYear();




    console.log('LOG: The file /src/time.ts passed ' +
        passed.toString() +
        ' unit tests out of ' +
        total.toString() +
        ' unit tests. Pass rate: ' +
        (100 * passed / total).toString() + '%');

    return passed / total;
}

//example
export function test_totalDaysPerYear(): number {
    return 0;
}
