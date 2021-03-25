function bisectRight(array, x) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] > x) return i
    }
    return array.length
}


export function denormalizeToRange(value, rangeMin, rangeMax) {
    /**
     * Takes a normalized value and denormalizes it into a specified range.
     * Args:
     *    value (float): Normalized value in range [0.0, 1.0].
     *    rangeMin (float): The minimum of the range to denormalize into.
     *    rangeMax (float): The maximum of the range to denormalize into.
     * Returns:
     *    float: Denormalized value in range [rangeMin, rangeMax].
     */
    return (value * (rangeMax - rangeMin)) + rangeMin;
}

export function quantize(value, quant) {
    /**
     * Quantizes a value to the closest value in a list of quantized values.
     * Args:
     *    value (float): Value to be quantized
     *    quant (List[float]): Quantized value options.
     * Returns:
     *    float: Quantized input value.
     */
    let mids = [];
    for (let i = 0; i < quant.length - 1; i++) mids[i] = (quant[i] + quant[i + 1]) / 2;
    let ind = bisectRight(mids, value);
    return quant[ind];
}
