import type { ListResult, Result } from '@/types/global.ts'
import request from '@/utils/request.ts'
import type {
  CreateFileUploadType,
  FileUploadListType,
  QueryFileUploadType,
  UpdateFileUploadType,
} from './fileUpload.type'

export function getFileUploadApi(
  params: QueryFileUploadType,
): Promise<ListResult<FileUploadListType>> {
  return request('/upload/file', {
    method: 'GET',
    params,
  })
}

export function getFileUploadOneApi(id: string): Promise<Result<FileUploadListType>> {
  return request(`/upload/file/${id}`, {
    method: 'GET',
  })
}

export function addFileUploadApi(data: CreateFileUploadType): Promise<Result> {
  return request('/upload/file', {
    method: 'POST',
    data,
  })
}

export function updateFileUploadApi(data: UpdateFileUploadType): Promise<Result> {
  return request(`/upload/file/${data.id}`, {
    method: 'PATCH',
    data,
  })
}

export function deleteFileUploadApi(id: string): Promise<Result> {
  return request(`/upload/file/${id}`, {
    method: 'DELETE',
  })
}

export function deleteFileUploadsApi(ids: string[]): Promise<Result> {
  return request(`/upload/file`, {
    method: 'DELETE',
    data: {
      ids,
    },
  })
}
