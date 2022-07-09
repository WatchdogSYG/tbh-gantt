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
export declare function toPxNumber(numberPx: string): string;
