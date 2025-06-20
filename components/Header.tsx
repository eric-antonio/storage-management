import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Search from "./Search";
import FileUploader from "./FileUploader";

const Header = () => {
  return (
    <div className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader />
        <form>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="Sign Out"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Header;
