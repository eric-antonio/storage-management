"use client";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { avatarPlaceholderUrl, navItems } from "@/constants";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import FileUploader from "./FileUploader";
import { Button } from "./ui/button";
import { signOutUser } from "@/lib/actions/user.actions";

interface MobileNavigationProps {
  $id: string;
  accountId: string;
  fullName?: string;
  email?: string;
  avatar?: string;
}

const MobileNavigation = ({
  fullName,
  $id: ownerId,
  accountId,
  email,
  avatar,
}: MobileNavigationProps) => {
  const [opnen, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="Logo"
        width={120}
        height={52}
        className="h-auto"
      />
      <Sheet open={opnen} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="Menu"
            width={32}
            height={32}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3 bg-white">
          <SheetTitle>
            {" "}
            <div className="header-user">
              <Image
                src={avatarPlaceholderUrl}
                alt="User Avatar"
                width={40}
                height={40}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map((item) => (
                <Link href={item.url} key={item.name} className="lg:w-full">
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathname === item.url && "shad-active"
                    )}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={24}
                      height={24}
                      className={cn(
                        "nav-icon",
                        pathname === item.url && "nav-icon-active"
                      )}
                    />
                    <p className="">{item.name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
          <Separator className="my-4 bg-light-200/20" />
          <div className="flex flex-col justify-between gap-5 ">
            <FileUploader ownerId={ownerId} accountId={accountId} />
            <Button
              type="submit"
              className="mobile-sign-out-button"
              onClick={async () => await signOutUser()}
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="Sign Out"
                width={24}
                height={24}
              />
              <p>LogOut</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
