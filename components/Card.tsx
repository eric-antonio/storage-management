import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import { constructDownloadUrl, convertFileSize } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";
import ActionDropDown from "./ActionDropDown";

const Card = ({ file }: { file: Models.Document }) => {
  console.log("Ther url is here", file.url);
  const fileUrl = constructDownloadUrl(file.bucketFileId);

  return (
    <Link href={fileUrl} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={fileUrl}
          className="!size-20"
          imageClassName="!size-20"
        />
        <div className="flex flex-col items-end justify-between">
          <ActionDropDown file={file} />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>
      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1"> {file.name}</p>
        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          By: {file.ownerId.fullName || file.ownerId.email}
        </p>
      </div>
    </Link>
  );
};

export default Card;
