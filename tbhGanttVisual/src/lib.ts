//library of helper functions

/**
 * Converts a number into a string with the units 'px' suffixed on it.
 * @param pixels the number of pixels
 * @returns the string representation of the number with 'px' suffixed
 */
function px(pixels: number): string {
    return pixels.toString().concat('px');
}

/**
 * For now this doesnt work and because the return value never comes back... keep this in visual.ts for now
 * Returns the number representation of a CSS measurement with pixel units.
 * @param numberPx the string containing the number of pixels to extract eg. '40.2px'
 * @returns the number of pixels specified
 */
function toPxNumber(numberPx: string): string {
    return numberPx;
    // //if there is only one instance of 'px' and its at the end
    // if ((numberPx.lastIndexOf('px') == numberPx.indexOf('px'))
    //     && (numberPx.length - numberPx.lastIndexOf('px') == 2)) {
    //     return numberPx.substring(0, 3);
    // } else {
    //     //otherwise return null since css can have negative, 0, or positive values
    //     return 'error';
    // }

    // return 'bad';
    // // let s: string = numberPx.lastIndexOf('px').toString();
    // // s = s.concat(numberPx.indexOf('px').toString());
    // // s = s.concat(numberPx.length.toString());
    // // s = s.concat(numberPx.lastIndexOf('px').toString());
    // // return s;
}