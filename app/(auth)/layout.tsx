import React from "react";
import Image from "next/image";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="hidden w-1/2 items-center justify-center bg-brand p-10 lg:flex">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="Logo"
            width={224}
            height={82}
            className="h-auto"
          />
          <div className="text-white">
            <h1 className="h1"> Manage your files the best way</h1>
            <p className="body-1">
              This is a plce you can store all your documents
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="Files"
            width={324}
            height={324}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>
      <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="Logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>
        {children}
      </section>
    </div>
  );
};

export default Layout;
