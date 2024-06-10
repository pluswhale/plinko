export function formatNumber(value: string | undefined) {
    if (!value) return '0';

    const number = parseFloat(value);
    const roundedValue = number.toFixed(2); // Round to 2 decimal places

    const [integerPart, decimalPart] = roundedValue.split('.');

    if (!decimalPart || parseInt(decimalPart) === 0) {
        return integerPart;
    }

    return parseFloat(roundedValue).toString();
}

