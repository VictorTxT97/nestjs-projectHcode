"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const file_service_1 = require("./file.service");
const get_photo_mock_1 = require("../testing/get-photo.mock");
describe('FileService', () => {
    let fileService;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [file_service_1.FileService]
        }).compile();
        fileService = module.get(file_service_1.FileService);
    });
    test('validar a definição', () => {
        expect(fileService).toBeDefined();
    });
    '';
    describe('teste do File Service', () => {
        test('upload method', async () => {
            const photo = await (0, get_photo_mock_1.getPhoto)();
            const filename = 'photo-test.png';
            fileService.upload(photo, filename);
        });
    });
});
