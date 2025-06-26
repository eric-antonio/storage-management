"use client";
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";

const ActionDropDown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [action, setAction] = React.useState<ActionType | null>(null);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionsItem) => (
            <DropdownMenuItem
              key={actionsItem.value}
              onClick={() => {
                setAction(actionsItem);

                if (
                  ["rename", "delete", "share", "delete", "details"].includes(
                    actionsItem.value
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionsItem.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-cemter gap-2"
                >
                  <Image
                    src={actionsItem.icon}
                    alt={actionsItem.label}
                    width={20}
                    height={20}
                  />
                  {actionsItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  {" "}
                  <Image
                    src={actionsItem.icon}
                    alt={actionsItem.label}
                    width={20}
                    height={20}
                  />
                  {actionsItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
};

export default ActionDropDown;
