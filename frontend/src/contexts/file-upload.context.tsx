import { createContext, ReactNode, useContext, useState } from "react";

type UploadContextType = {
  files: File[];
  uploading: boolean;

  addFiles: (files: FileList | File[]) => void;
  removeFile: (fileName: string) => void;
};

const FileUploadContext = createContext<UploadContextType | undefined>(
  undefined
);

export const FileUploadProvider = ({ children }: { children?: ReactNode }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading /* TODO setUploading */] = useState(false);

  const addFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    setFiles((prev) => [...prev, ...fileArray]);
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  return (
    <FileUploadContext.Provider
      value={{ uploading, files, addFiles, removeFile }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUpload = () => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};
