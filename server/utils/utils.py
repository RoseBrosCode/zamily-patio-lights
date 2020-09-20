import bisect


def denormalize_to_range(value, range_min, range_max):
    """Takes a normalized value and denormalizes it into a specified range.
    Args:
        value (float): Normalized value in range [0.0, 1.0].
        range_min (float): The minimum of the range to denormalize into.
        range_max (float): The maximum of the range to denormalize into.
    Returns:
        float: Denormalized value in range [range_min, range_max].
    """
    return (value * (range_max - range_min)) + range_min

def quantize(value, quant):
    """Quantizes a value to the closest value in a list of quantized values.
    Args:
        value (float): Value to be quantized
        quant (List[float]): Quantized value options.
    Returns:
        float: Quantized input value.
    """
    mids = [(quant[i] + quant[i + 1]) / 2.0
            for i in range(len(quant) - 1)]
    ind = bisect.bisect_right(mids, value)
    return quant[ind]
