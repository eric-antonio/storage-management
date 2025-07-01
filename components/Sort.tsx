"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
const Sort = () => {
  const router = useRouter();
  const path = usePathname();
  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };
  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="sort-select-content bg-slate-100">
        {sortTypes.map((sortType) => (
          <SelectItem
            className="shad-selecr-item"
            key={sortType.value}
            value={sortType.value}
          >
            {sortType.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
