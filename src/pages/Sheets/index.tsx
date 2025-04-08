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
import { debounce } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { ISheetList } from "@/types/Sheets";

export default function Sheets() {
  const containerRef = useRef<HTMLTableElement>(null);

  const [sheets, setSheets] = useState<ISheetList>([]);
  const [pageMeta, setPageMeta] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const search = searchParams.get("search") || "";
  const page = searchParams.get("page") || 1;

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

  const handlePageChange = (page: number) => {
    if (!containerRef.current) return;

    navigate({
      search:
        page !== 0
          ? `?page=${page + 1}${search ? `&search=${search}` : ""}`
          : "",
    });

    containerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const navigateToSheet = (sheetId: string, newTab: boolean = false) => {
    const path = `/sheet/${sheetId}`;
    newTab ? window.open(`#${path}`) : navigate(path);
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

  if (isLoading) {
    return "Loading";
  }

  return (
    <div className="container mx-auto">
      <Input type="text" onChange={handleChange} />
      <Table>
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
            <TableRow key={_id} onClick={() => navigateToSheet(_id)}>
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
                      onClick={() => navigateToSheet(_id, true)}
                    >
                      Open in new tab
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleDeleteDocument(_id)}>
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pageMeta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
