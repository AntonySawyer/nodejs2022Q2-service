import * as fs from 'fs/promises';
import { join, relative } from 'path';

export const LOG_FILE_DEFAULT = {
  SIZE_IN_BYTES: 1048576, // 1mb
  FILE_PREFIX: 'log',
  ERROR_FILE_PREFIX: 'error-log',
  FILE_DELIMETER: '-',
  FILE_ABSOLUTE_PATH_TO_DIR: 'logs/',
};

const FILE_EXTENSION = '.txt';

export class LogFileWorker {
  constructor(filePrefix: string) {
    const {
      LOG_FILE_SIZE_IN_BYTES,
      LOG_FILE_INDEX_DELIMETER,
      LOG_FILE_ABSOLUTE_PATH_TO_DIR,
    } = process.env;

    this.fileSizeLimitInBytes = LOG_FILE_SIZE_IN_BYTES
      ? Number(LOG_FILE_SIZE_IN_BYTES)
      : LOG_FILE_DEFAULT.SIZE_IN_BYTES;
    this.fileNamePrefix = filePrefix;
    this.fileIndexDelimeter =
      LOG_FILE_INDEX_DELIMETER ?? LOG_FILE_DEFAULT.FILE_DELIMETER;
    this.fileDir =
      LOG_FILE_ABSOLUTE_PATH_TO_DIR ??
      LOG_FILE_DEFAULT.FILE_ABSOLUTE_PATH_TO_DIR;
  }

  private fileSizeLimitInBytes: number;

  private currentFileIndex: number;

  private fileNamePrefix: string;

  private fileIndexDelimeter: string;
  private fileDir: string;

  public async init() {
    try {
      await this.createDirIfNotExist();

      const lastIndex = await this.getLastIndex();

      if (lastIndex === null) {
        this.currentFileIndex = 0;
        await this.createNewFile();
      } else {
        this.currentFileIndex = lastIndex;
      }
    } catch (error) {
      throw error;
    }
  }

  private async createNewFile() {
    try {
      const filePath = this.getFullFilePath();

      await fs.writeFile(filePath, '', { encoding: 'utf-8' });
    } catch (error) {
      throw new Error(error);
    }
  }

  async addToFile(data: string): Promise<void> {
    try {
      const filePath = this.getFullFilePath();

      await fs.appendFile(filePath, `${data}\n`);

      await this.checkSize(filePath);
    } catch (error) {
      throw error;
    }
  }

  private async checkSize(filePath: string): Promise<number> {
    try {
      const currentFileStat = await fs.stat(filePath);
      const fileSizeInBytes = currentFileStat.size;

      if (fileSizeInBytes > this.fileSizeLimitInBytes) {
        this.currentFileIndex += 1;
        await this.createNewFile();
      }

      return this.currentFileIndex;
    } catch (error) {
      throw error;
    }
  }

  private async getLastIndex(): Promise<number | null> {
    let lastIndex: number;

    try {
      const folderPath = this.getFullFilePathToFolder();
      const fileNames = await fs.readdir(folderPath);

      fileNames.forEach((fileName) => {
        const fileIndex = fileName.split(this.fileIndexDelimeter)[1];

        if (typeof fileIndex !== 'number') {
          return;
        }

        if (!lastIndex || Number(fileIndex) > lastIndex) {
          lastIndex = Number(fileIndex);
        }
      });
    } catch (error) {
      throw error;
    }

    if (lastIndex === undefined) {
      return null;
    }

    return lastIndex;
  }

  private async createDirIfNotExist(): Promise<void> {
    const folderPath = this.getFullFilePathToFolder();

    try {
      await fs.access(folderPath);

      return;
    } catch (error) {
      fs.mkdir(folderPath, { recursive: true }).catch((err) => {
        if (err) throw err;
      });
    }
  }

  private getFullFilePathToFolder(): string {
    const relativePathToFolder = relative(__dirname, this.fileDir);
    const pathToFolder = join(__dirname, relativePathToFolder);

    return pathToFolder;
  }

  private getFullFilePath(): string {
    const pathToFolder = this.getFullFilePathToFolder();
    const relativePathToFile = `${pathToFolder}/${this.fileNamePrefix}${this.fileIndexDelimeter}${this.currentFileIndex}${FILE_EXTENSION}`;

    return relativePathToFile;
  }
}
