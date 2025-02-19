"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileToBuffer = void 0;
const fs_1 = require("fs");
const getFileToBuffer = (filename) => {
    const readStream = (0, fs_1.createReadStream)(filename);
    const chunks = [];
    return new Promise((resolve, reject) => {
        readStream.on('data', chunk => {
            if (typeof chunk === 'string') {
                chunks.push(Buffer.from(chunk));
            }
            else {
                chunks.push(chunk);
            }
        });
        readStream.on('error', (err) => reject(err));
        readStream.on('close', () => {
            resolve({
                buffer: Buffer.concat(chunks),
                stream: readStream
            });
        });
    });
};
exports.getFileToBuffer = getFileToBuffer;
