import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
import { getSheetList } from "@/services/Sheet";
import { ChangeEvent } from "react";
import { debounce } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function Sheets() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let search = searchParams.get("search") || "";
  let page = searchParams.get("page") || 1;

  const duplicateSheet = async () => {
    const {
      data: { data },
    } = await axios.delete(`http://localhost:3000/api/v1/sheet/${sheetId}`);
    return data;
  };

  const deleteSheet = async (sheetId: string) => {
    console.log("deleting");
    const {
      data: { data },
    } = await axios.delete(`http://localhost:3000/api/v1/sheet/${sheetId}`);
    return data;
  };

  const getSheetDetails = async () => {
    const {
      data: { data },
    } = await getSheetList({ limit: 15, search, page: +page });

    return data;
  };

  const handleChange = debounce<ChangeEvent<HTMLInputElement>>(
    ({ target: { value } }) => {
      navigate({ search: value ? `?search=${value}` : "" });
    },
    500
  );

  const navigateToSheet = (sheetId: string, newTab: boolean = false) => {
    const path = `/sheet/${sheetId}`;
    newTab ? window.open(`#${path}`) : navigate(path);
  };

  const {
    data: { sheets, pageMeta },
    error,
    isLoading,
  } = useQuery({
    queryKey: ["sheetsData", { search, page }],
    queryFn: getSheetDetails,
  });

  const { mutateAsync: deleteSheetMutation } = useMutation({
    mutationFn: deleteSheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheets"] });
    },
  });

  const { mutateAsync: duplicateSheetMutation } = useMutation({
    mutationFn: duplicateSheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheets"] });
    },
  });

  if (isLoading) return <div>Fetching sheet...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  return (
    <div className="container mx-auto">
      <Input type="text" onChange={handleChange} />
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.N.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Create at</TableHead>
            <TableHead>Last Opened by me</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sheets.map(({ title, _id, createdAt, lastOpenedAt }) => (
            <TableRow key={_id} onClick={() => navigateToSheet(_id)}>
              <TableCell className="font-medium">{index + 1}</TableCell>
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
                    <DropdownMenuItem
                      onClick={() => duplicateSheetMutation(_id)}
                    >
                      Make a copy
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteSheetMutation(_id)}>
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
