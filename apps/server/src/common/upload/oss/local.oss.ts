import { LocalFileConfig } from '@/common/types/config.type';
import { IUploadResult, IUploadService } from '@/common/types/upload.type';
import dayjs from 'dayjs';
import fs from 'node:fs';
import path from 'node:path';

export class LocalOssService implements IUploadService {
  constructor(private readonly localConfig: LocalFileConfig) {}

  getFileStorePath() {
    const folder = this.localConfig.folder || 'uploads';
    if (path.isAbsolute(folder)) {
      // 如果 folder 是绝对路径，直接作为基础路径使用
      return folder;
    } else {
      // 如果 folder 是相对路径，解析为相对于当前工作目录的路径
      return path.resolve(process.cwd(), folder);
    }
  }
  generateFileName(fileName: string): string {
    const now = dayjs();
    const year = now.format('YYYY');
    const month = now.format('MM');
    const day = now.format('DD');
    const filePath = [year, month, day, `${Date.now()}-${fileName}`];
    return path.join(...filePath);
  }

  // 有几个路径 uploads/E:uploads
  // 1. 存储路径
  // 2.访问路径 /uploads
  // 3.
  async upload(file: Express.Multer.File): Promise<IUploadResult> {
    const fileNamePath = this.generateFileName(file.originalname);
    const filePath = path.join(this.getFileStorePath(), fileNamePath);
    const dir = path.dirname(filePath);
    const tag = path.extname(file.originalname).slice(1);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(filePath, file.buffer);
    const relativePath = path.join(this.localConfig.prefix, fileNamePath);
    const urlPath = new URL(relativePath, this.localConfig.baseUrl);
    return {
      name: file.originalname,
      url: urlPath.href,
      key: fileNamePath,
      size: file.size,
      mime: file.mimetype,
      tag,
    };
  }

  async delete(fileUrl: string): Promise<void> {
    // 删除文件
    const filePath = path.resolve(this.getFileStorePath(), fileUrl);
    if (!fs.existsSync(filePath)) {
      return;
    }
    await fs.promises.unlink(filePath);
  }
}
