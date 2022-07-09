//library of helper functions

/**
 * Converts a number into a string with the units 'px' suffixed on it.
 * @param pixels the number of pixels
 * @returns the string representation of the number with 'px' suffixed
 */
export function px(pixels: number): string {
    return pixels.toString().concat('px');
}

/**
 * For now this doesnt work and because the return value never comes back... keep this in visual.ts for now
 * Returns the number representation of a CSS measurement with pixel units.
 * @param numberPx the string containing the number of pixels to extract eg. '40.2px'
 * @returns the number of pixels specified
 */
export function toPxNumber(numberPx: string): number {
   //if there is only one instance of 'px' and its at the end
   if ((numberPx.lastIndexOf('px') == numberPx.indexOf('px'))
   && (numberPx.length - numberPx.lastIndexOf('px') == 2)) {
   return +numberPx.substring(0, numberPx.length - 2);
} else {
   //otherwise return null since css can have negative, 0, or positive values
   return null;
}
}