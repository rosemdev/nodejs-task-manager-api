const {calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add} = require("../src/math")

test('Should calculate total with tip', () => {
    const total = calculateTip(10, 0.3);
    expect(total).toBe(13);
});

test('Should calculate total with the default tip', () => {
    const total = calculateTip(10);
    expect(total).toBe(12.5);
});

test('Should convert Fahrenheit To Celsius', () => {
    const tempCelsius = fahrenheitToCelsius(40);
    expect(tempCelsius).toBeGreaterThanOrEqual(4.4);
});

test('Should convert Celsius to Fahrenheit', () => {
    const tempCelsius = celsiusToFahrenheit(25);
    expect(tempCelsius).toBeGreaterThanOrEqual(77);
});

test('Should add positive numbers', async() => {
    const sum = await add(15, 25);
    expect(sum).toBe(40);
});





