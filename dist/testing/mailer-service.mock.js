"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailerServiveMock = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
exports.mailerServiveMock = {
    provide: mailer_1.MailerService,
    useValue: {
        sendMail: jest.fn(),
    },
};
