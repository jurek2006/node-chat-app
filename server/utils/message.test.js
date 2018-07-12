const expect = require('expect');

const {generateMessage, generateLocationMessage}= require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        const from = "Jurek";
        const text = "Hello world";
        const message = generateMessage(from, text);
        expect(message.from).toBe(from);
        expect(message.text).toBe(text);
        expect(typeof message.createdAt).toBe('number');
    });
});

describe('generateLocationMessage', () => {
   it('should generate correct location message object', () => {
        const from = "Jurek";
        const latitude = "50.9386357";
        const longtitude = "17.2903046";
        const locationMessage = generateLocationMessage(from, latitude, longtitude);
        expect(locationMessage.from).toBe(from);
        expect(locationMessage.url).toBe(`https://www.google.com/maps?q=${latitude},${longtitude}`);
        expect(typeof locationMessage.createdAt).toBe('number');
   });
});