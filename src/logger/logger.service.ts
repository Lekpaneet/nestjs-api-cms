import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DateTz } from '../commons/helpers/DateTz';

@Injectable()
export class LoggerService {
  async getLogs(path: string) {
    const dirPath = this.getPathRootLogs(path);

    const files = fs.readdirSync(dirPath);
    const logDetails = [];
    for (const file of files) {
      if (file) {
        const data = fs.readFileSync(`${dirPath}/${file}`, 'utf8');
        const logs = data.split('\n').map((e) => this.isValidJSON(e));
        logDetails.push(...logs);
      }
    }

    return logDetails?.sort(
      (a, b) =>
        new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime(),
    );
  }

  isValidJSON(str: string) {
    try {
      const parsed = JSON.parse(str);
      return parsed; // Return parsed JSON if valid
    } catch (error) {
      return str; // Return false if invalid JSON
    }
  }

  async getLists() {
    return await this.readdir();
  }

  private getPathRootLogs(subPath?: string) {
    const dirPath = path.join(__dirname, '..', '..', 'logs', subPath);
    if (!fs.existsSync(dirPath)) {
      throw new BadRequestException('Path directory not found');
    }
    return dirPath;
  }

  private async readdir() {
    return new Promise((resolve, reject) => {
      const dirPath = this.getPathRootLogs();
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
