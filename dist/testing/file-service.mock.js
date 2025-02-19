"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileServiceMock = void 0;
const file_service_1 = require("../file/file.service");
exports.fileServiceMock = {
    provide: file_service_1.FileService,
    useValue: {
        getDestinationpath: jest.fn(),
        upload: jest.fn().mockResolvedValue(''),
    }
};
