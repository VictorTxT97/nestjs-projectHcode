"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const somar_1 = require("./utils/somar");
test('Este é o meu primeiro teste', () => {
    const resultado = (0, somar_1.somar)(2, 3);
    expect(resultado).toEqual(5);
});
