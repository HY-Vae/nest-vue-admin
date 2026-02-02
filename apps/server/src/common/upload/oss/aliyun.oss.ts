import { AliyunConfig } from '@/common/types/config.type';
import { IUploadResult, IUploadService } from '@/common/types/upload.type';
import OSS from 'ali-oss';
import path from 'node:path';

export class AliyunOssService implements IUploadService {
  private client: OSS;
  constructor(private readonly ossConfig: AliyunConfig) {
    const { region, accessKeyId, accessKeySecret, bucket } = this.ossConfig;
    this.client = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket,
    });
  }
  generateFileName(fileName: string): string {
    // 获取年月日
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const filePath = [year, month, day, `${Date.now()}-${fileName}`];
    if (this.ossConfig.folder) {
      filePath.unshift(this.ossConfig.folder);
    }
    return filePath.join('/');
  }

  async upload(file: Express.Multer.File): Promise<IUploadResult> {
    const key = this.generateFileName(file.originalname);
    const result = await this.client.put(key, file.buffer);
    const tag = path.extname(file.originalname).slice(1);
    return {
      name: file.originalname,
      url: result.url,
      key,
      size: file.size,
      mime: file.mimetype,
      tag,
    };
  }

  async delete(fileUrl: string): Promise<void> {
    let delUrl = fileUrl;
    if (fileUrl.startsWith('http')) {
      const url = new URL(fileUrl);
      delUrl = url.pathname;
    }
    await this.client.delete(delUrl);
  }
}
