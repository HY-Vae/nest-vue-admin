export interface IUploadService {
  upload(file: Express.Multer.File): Promise<IUploadResult>;
  delete(key: string): Promise<void>;
}

export interface IUploadResult {
  name: string;
  url: string;
  key: string;
  size: number;
  mime: string;
  tag: string;
}
