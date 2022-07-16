/**
 * Converts a number into a string with the units 'px' suffixed on it.
 * @param pixels the number of pixels
 * @returns the string representation of the number with 'px' suffixed
 */
export declare function px(pixels: number): string;
/**
 * For now this doesnt work and because the return value never comes back... keep this in visual.ts for now
 * Returns the number representation of a CSS measurement with pixel units.
 * @param numberPx the string containing the number of pixels to extract eg. '40.2px'
 * @returns the number of pixels specified
 */
export declare function pxToNumber(numberPx: string): number;
/**
 * Returns a number rounded up, down, or not at all, to the nearest integer.
 * @param x The number to round.
 * @param round Rounds x to the nearest integer. Rounds up if > 0, does not round if == 0, rounds down otherwise.
 * @returns The number rounded as specified.
 */
export declare function roundOptions(x: number, round?: number): number;
