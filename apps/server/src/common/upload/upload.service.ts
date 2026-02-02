import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadModeEnum } from '@/common/enums/config.enum';
import { FileUploadType } from '@/common/types/config.type';
import { IUploadService } from '@/common/types/upload.type';
import { LocalOssService } from '@/common/upload/oss/local.oss';
import { AliyunOssService } from '@/common/upload/oss/aliyun.oss';

@Injectable()
export class UploadCommonService {
  private mode: UploadModeEnum;
  private readonly fileUploadConfig: FileUploadType;
  constructor(private readonly configSerive: ConfigService) {
    const fileUploadConfig = this.configSerive.get<FileUploadType>('upload')!;
    this.mode = fileUploadConfig?.mode || UploadModeEnum.LOCAL;
    this.fileUploadConfig = fileUploadConfig;
  }

  createStorage(): IUploadService {
    switch (this.mode) {
      case UploadModeEnum.LOCAL:
        return new LocalOssService(this.fileUploadConfig[UploadModeEnum.LOCAL]);
      case UploadModeEnum.ALIYUN:
        return new AliyunOssService(
          this.fileUploadConfig[UploadModeEnum.ALIYUN],
        );
    }
  }
}
