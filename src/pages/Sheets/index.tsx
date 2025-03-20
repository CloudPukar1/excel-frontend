import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sheets() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const retreiveSheets = async (search: string) => {
    console.log("fetching");
    const {
      data: { data },
    } = await axios.get(`http://localhost:3000/api/v1/sheet?search=${search}`);
    console.log(data);
    return data;
  };

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

  const {
    data: sheets,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["sheetsData", { search }],
    queryFn: () => retreiveSheets(search),
  });

  const { mutateAsync: deleteSheetMutation } = useMutation({
    mutationFn: deleteSheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheetsData"] });
    },
  });

  const { mutateAsync: duplicateSheetMutation } = useMutation({
    mutationFn: duplicateSheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheetsData"] });
    },
  });

  if (isLoading) return <div>Fetching sheet...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  return (
    <div className="container mx-auto">
      <Input type="text" onChange={(e) => setSearch(e.target.value)} />
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.N.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sheets.map((sheet, index) => (
            <TableRow key={sheet._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{sheet.name}</TableCell>
              <TableCell>{sheet.createdAt}</TableCell>
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
                    <Link to={`/sheet/${sheet._id}`}>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() => duplicateSheetMutation(sheet._id)}
                    >
                      Make a copy
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => deleteSheetMutation(sheet._id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
