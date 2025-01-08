"use client";

import classNames from "classnames";
import Link from "next/link";

interface IPaginationProps {
  path: string;
  page: number;
  limit: number;
  length: number;
}

const Pagination = ({ path, page, limit, length }: IPaginationProps) => {
  if (!(page > 1) && !(length === limit)) return null;

  return (
    <div className="flex mt-12 gap-x-4 gap-y-2">
      {page > 1 && (
        <Link href={`${path}?limit=${limit}&page=${page - 1}`} className="btn">
          Prev
        </Link>
      )}
      {length === limit && (
        <Link href={`${path}?limit=${limit}&page=${page + 1}`} className="btn">
          Next
        </Link>
      )}
    </div>
  );
};

export default Pagination;
