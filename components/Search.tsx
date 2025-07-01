"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import { constructDownloadUrl } from "@/lib/utils";
import FormattedDateTime from "./FormattedDateTime";

const Search = () => {
  const [query, setQuery] = React.useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = React.useState<Models.Document[]>([]);
  const [open, setOpen] = React.useState(false);
  const path = usePathname();

  const router = useRouter();
  useEffect(() => {
    const fetchFiles = async () => {
      if (!query) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({ searchText: query });
      setResults(Array.isArray(files.documents) ? files.documents : []);
      setOpen(true);
    };

    fetchFiles();
  }, [query]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, []);

  const handleClickItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);
    router.push(
      `/${file.type === "video" || file.type === "video" ? "media" : file.type + "s"}?query=${query}`
    );
  };
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="assets/icons/search.svg"
          alt="search icon"
          width={20}
          height={20}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />
        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  className="flex items-center justify-between"
                  key={file.$id}
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.typr}
                      extension={file.extension}
                      url={constructDownloadUrl(file.bucketFileId)}
                      className="size-10 min-w-10"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {" "}
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">There is no results</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
