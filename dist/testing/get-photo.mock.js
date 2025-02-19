"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhoto = void 0;
const path_1 = require("path");
const file_to_buffer_1 = require("./file-to-buffer");
const getPhoto = async () => {
    const { buffer, stream } = await (0, file_to_buffer_1.getFileToBuffer)((0, path_1.join)(__dirname, 'photo.png'));
    const photo = {
        fieldname: 'file',
        originalname: 'photo.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024 * 50,
        destination: '',
        filename: 'file-name',
        path: 'file-path',
        buffer,
        stream
    };
    return photo;
};
exports.getPhoto = getPhoto;
