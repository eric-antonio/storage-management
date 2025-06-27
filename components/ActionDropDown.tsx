"use client";
import React, { useState } from "react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { rename } from "fs";
import { renameFile } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { set } from "zod";

const ActionDropDown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [action, setAction] = React.useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();

  const cleseAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    setIsLoading(false);
  };

  const handldAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let sucsess = false;
    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => console.log("Share action not implemented yet"),
      delete: () => console.log("Delete action not implemented yet"),
      details: () => console.log("Details action not implemented yet"),
    };
    sucsess = await actions[action.value as keyof typeof actions]();
    if (sucsess) cleseAllModals();
    setIsLoading(false);
  };

  const renderDialogContent = () => {
    if (!action) return null;
    const { value, label } = action;
    return (
      <DialogContent className="bg-white shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-ligth-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="rounded-xl border border-gray-300 bg-white p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          )}
        </DialogHeader>
        {["rename", "delete", "share", "details"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={cleseAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handldAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loading"
                  width={24}
                  height={24}
                  className="animate-spin "
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

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

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropDown;
