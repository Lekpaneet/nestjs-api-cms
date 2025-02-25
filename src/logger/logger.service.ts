import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DateTz } from '../commons/helpers/DateTz';
@Injectable()
export class LoggerService {
  async getLogs() {
    const dirPath = await this.readdir();
    console.log({
      dirPath,
    });
    return '';
  }

  private async readdir() {
    return new Promise((resolve, reject) => {
      const dirPath = path.join(__dirname, '..', '..', 'logs');
      if (fs.existsSync(dirPath)) {
        const folders: string[] = [];
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
          const date = file.replace('log_', '');
          if (DateTz.checkFormat(date, 'YYYY-MM-DD')) {
            folders.push(file);
          }
        }

        return resolve(folders);
      }

      return reject(null);
    });
  }
}
