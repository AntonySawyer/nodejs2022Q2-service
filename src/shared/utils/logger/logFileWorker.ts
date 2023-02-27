import * as fs from 'fs/promises';
import { join, relative } from 'path';

export const LOG_FILE_DEFAULT = {
  SIZE_IN_BYTES: 1048576, // 1mb
  FILE_PREFIX: 'log',
  ERROR_FILE_PREFIX: 'error-log',
  FILE_DELIMETER: '-',
  FILE_ABSOLUTE_PATH_TO_DIR: 'logs/',
};

const FILE_EXTENSION = 'txt';

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
    this.filePostfixDelimeter =
      LOG_FILE_INDEX_DELIMETER ?? LOG_FILE_DEFAULT.FILE_DELIMETER;
    this.fileDir =
      LOG_FILE_ABSOLUTE_PATH_TO_DIR ??
      LOG_FILE_DEFAULT.FILE_ABSOLUTE_PATH_TO_DIR;
  }

  private fileSizeLimitInBytes: number;

  private currentFilePostfix: number;

  private fileNamePrefix: string;

  private filePostfixDelimeter: string;
  private fileDir: string;

  public async init() {
    try {
      await this.createDirIfNotExist();

      const lastIndex = await this.getLastIndex();

      if (lastIndex === null) {
        this.currentFilePostfix = 0;
        const filePath = await this.getFullFilePath();

        await this.createNewFile(filePath);
      } else {
        this.currentFilePostfix = lastIndex;
      }
    } catch (error) {
      throw error;
    }
  }

  private async createNewFile(filePath: string) {
    try {
      await fs.writeFile(filePath, '', { encoding: 'utf-8', flag: 'a+' });
    } catch (error) {
      throw new Error(error);
    }
  }

  async addToFile(data: string): Promise<void> {
    try {
      const filePath = await this.getFullFilePath();
      const isFileExist = await this.isFileExist(filePath);

      if (!isFileExist) {
        await this.createNewFile(filePath);
        await this.addToFile(data);

        return;
      }

      const fileSize = await this.getFileSizeInBytes(filePath);
      const stringSizeInBytes = Buffer.from(`${data}\n\n`).length;

      if (fileSize + stringSizeInBytes > this.fileSizeLimitInBytes) {
        const checkedPostfix = this.getPostfixFromPath(filePath);
        const isFileCreationInProcess =
          checkedPostfix !== this.currentFilePostfix;

        if (isFileCreationInProcess) {
          await this.addToFile(data);

          return;
        }

        const newPostfix = this.currentFilePostfix + 1;

        this.currentFilePostfix = newPostfix;
        const newFilePath = this.updatePostfixInPath(filePath, newPostfix);

        await this.createNewFile(newFilePath);
        await this.addToFile(data);

        return;
      }

      await fs.appendFile(filePath, `${data}\n\n`);
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
        const fileIndex = fileName.split(this.filePostfixDelimeter)[1];

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

  private async isFileExist(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);

      return true;
    } catch (error) {
      return false;
    }
  }

  private async getFileSizeInBytes(filePath: string): Promise<number> {
    const currentFileStat = await fs.stat(filePath);
    const fileSizeInBytes = currentFileStat.size;

    return fileSizeInBytes;
  }

  private async getFullFilePath(): Promise<string> {
    const pathToFolder = this.getFullFilePathToFolder();
    const fileName = `${this.fileNamePrefix}${this.filePostfixDelimeter}${this.currentFilePostfix}`;
    const filePath = `${pathToFolder}/${fileName}.${FILE_EXTENSION}`;

    return filePath;
  }

  private updatePostfixInPath(filePath: string, newPostfix: number): string {
    const [fileNameBeforePostfix] = filePath.split(this.filePostfixDelimeter);
    const newFilePath = `${fileNameBeforePostfix}${this.filePostfixDelimeter}${newPostfix}.${FILE_EXTENSION}`;

    return newFilePath;
  }

  private getPostfixFromPath(filePath: string): number {
    const fileNameWithExtension = filePath.split(this.filePostfixDelimeter)[1];
    const [filePostfixString] = fileNameWithExtension.split(FILE_EXTENSION);

    const postfix = parseInt(filePostfixString);

    return postfix;
  }
}
