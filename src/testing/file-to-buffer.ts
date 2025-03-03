import { createReadStream, ReadStream } from "fs";

export const getFileToBuffer = (filename: string) =>{
    
    const readStream = createReadStream(filename);
    const chunks: Buffer[] = [];
    
    return new Promise<{buffer: Buffer, stream: ReadStream}>((resolve, reject) => {
        readStream.on('data', chunk => {
            if (typeof chunk === 'string') {
                chunks.push(Buffer.from(chunk));
            } else {
                chunks.push(chunk);
            }
        });
        readStream.on('error', (err) => reject(err));
        readStream.on('close', () => {
            resolve({
                buffer: Buffer.concat(chunks) as Buffer,
                stream: readStream
            })
        })    

    });
}

