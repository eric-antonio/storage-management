"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { uploadFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const path = usePathname();

  const handleRemoveFilev = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Do something with the files
      setFiles(acceptedFiles);
      const upLoadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) =>
            prevFiles.filter((f) => f.name !== file.name)
          );
          return toast.error(
            <p className="body-2 text-white">
              <span className="font-semibold">{file.name}</span>
              is too large. Max size is 50MB.
            </p>
          );
        }
        return uploadFile({ file, ownerId, accountId, path }).then(
          (uploadFile) => {
            if (uploadFile) {
              if (uploadFile) {
                setFiles((prevFiles) =>
                  prevFiles.filter((f) => f.name !== file.name)
                );
              }
            }
          }
        );
      });
      await Promise.all(upLoadPromises);
      setFiles([]); // Clear files after upload
    },
    [ownerId, accountId, path]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="Upload"
          width={24}
          height={24}
        />
        <p className="text-white">Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  <div className="preview-item-name">
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="loader"
                      width={80}
                      height={80}
                    />
                  </div>
                </div>
                <Image
                  src="/assets/icons/remove.svg"
                  alt="Remove"
                  onClick={(e) => handleRemoveFilev(e, file.name)}
                  width={24}
                  height={24}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
