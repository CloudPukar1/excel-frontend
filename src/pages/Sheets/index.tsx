import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { createSheet, getSheetList, removeSheetById } from "@/services/Sheet";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { debounce, getStaticUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { ISheetList } from "@/types/Sheets";

export default function Sheets() {
  const containerRef = useRef<HTMLTableElement>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [isLoading, setIsLoading] = useState(true);
  const [pageMeta, setPageMeta] = useState({} as any);
  const [sheets, setSheets] = useState<ISheetList>([]);
  const [page, setPage] = useState(+(searchParams.get("page") || 1));

  const navigate = useNavigate();

  const search = searchParams.get("search") || "";

  const getSheetDetails = async () => {
    try {
      const {
        data: {
          data: { sheets, pageMeta },
        },
      } = await getSheetList({ limit: 15, search, page: +page });
      setSheets(sheets);
      setPageMeta(pageMeta);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const {
        data: {
          data: { sheetId },
        },
      } = await createSheet();
      navigate(`/sheet/${sheetId}`);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleDeleteDocument = async (sheetId: string) => {
    if (!window.confirm("Are you sure you want to delete this sheet?")) return;

    try {
      await removeSheetById(sheetId);
      getSheetDetails();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const navigateToSheet = (sheetId: string, newTab: boolean = false) => {
    const path = `/sheet/${sheetId}`;
    newTab ? window.open(path) : navigate(path);
  };

  const handleChange = debounce<ChangeEvent<HTMLInputElement>>(
    ({ target: { value } }) => {
      navigate({ search: value ? `?search=${value}` : "" });
    },
    500
  );

  useEffect(() => {
    getSheetDetails();
  }, [search, page]);

  useEffect(() => {
    const handlePageChange = (page: number) => {
      if (!containerRef.current) return;

      navigate({
        search:
          page !== 0 ? `?page=${page}${search ? `&search=${search}` : ""}` : "",
      });

      containerRef.current.scrollIntoView({ behavior: "smooth" });
    };
    handlePageChange(page);
  }, [page]);

  if (isLoading) {
    return "Loading";
  }

  return (
    <div className="container mx-auto">
      <Input type="text" onChange={handleChange} />
      <Table ref={containerRef}>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Create at</TableHead>
            <TableHead>Last Opened by me</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sheets.map(({ title, _id, createdAt, lastOpenedAt }) => (
            <TableRow
              className="cursor-pointer"
              key={_id}
              onClick={() => navigateToSheet(_id)}
            >
              <TableCell>{title}</TableCell>
              <TableCell>{createdAt}</TableCell>
              <TableCell>{lastOpenedAt}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                      size="icon"
                    >
                      <MoreVerticalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToSheet(_id, true);
                      }}
                    >
                      Open in new tab
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(_id);
                      }}
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {true && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem
                className="cursor-pointer"
                onClick={() => setPage((prev) => prev - 1)}
              >
                <PaginationPrevious />
              </PaginationItem>
            )}
            {/* <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem> */}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            {page < 5 && (
              <PaginationItem
                className="cursor-pointer"
                onClick={() => setPage((prev) => prev + 1)}
              >
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
      <button
        className="cursor-pointer fixed flex items-center justify-center shadow-[0px_2px_10px_rgba(0,0,0,0.3),0px_0px_1px_rgba(0,0,0,0.1),inset_0px_1px_0px_rgba(255,255,255,0.25),inset_0px_-1px_0px_rgba(0,0,0,0.15)] w-14 h-14 bg-white rounded-[50%] border-[none] right-[25px] bottom-[30px]"
        onClick={handleCreateDocument}
      >
        <img className="w-6 h-6" src={getStaticUrl("/plus.svg")} />
      </button>
    </div>
  );
}
