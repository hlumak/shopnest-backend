export interface FileResponse {
  url: string;
  name: string;
}

export interface CleanupStats {
  totalFiles: number;
  usedFiles: number;
  unusedFiles: number;
  unusedFilesList?: string[];
}
