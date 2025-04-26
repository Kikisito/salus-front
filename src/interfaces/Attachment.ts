import type { User } from './User'

export interface Attachment {
  id: number
  name: string
  contentType: string
  size: number
  filePath: string
  uploadDate: string
  uploadedBy: User
}

export function transformFileDataToAttachmentData(file: File): Attachment {
  return {
    id: -1,
    name: file.name,
    contentType: file.type,
    size: file.size,
    filePath: '',
    uploadDate: undefined as unknown as string,
    uploadedBy: undefined as unknown as User,
  }
}
