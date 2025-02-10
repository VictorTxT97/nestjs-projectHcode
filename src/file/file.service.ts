import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async upload(file: Express.Multer.File, path: string) {
    // Salva o arquivo diretamente, sem recriar o diretório
    await writeFile(path, file.buffer);
    return { message: 'Upload concluído', path };
  }
}
