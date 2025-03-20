import axios from "axios";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";


export default function Sheets() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const retreiveSheets = async (search: string) => {
    console.log("fetching");
    const {
      data: { data },
    } = await axios.get(
      `http://localhost:3000/api/v1/sheet?search=${search}`
    );
    console.log(data);
    return data;
  };

  const deleteSheet = async () => {
    const sheetData = JSON.parse(localStorage.getItem("cellValues")!);
    const { data: { data } } = await axios.delete(`http://localhost:3000/api/v1/sheet/${sheetId}`, sheetData);
    return data;
  };

  const {
    data: sheets,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["", { search }],
    queryFn: () => retreiveSheets(search),
  });

  const { mutateAsync: deleteSheetMutation } = useMutation({
    mutationFn: deleteSheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheetsData"] });
    },
  });
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
            <TableHead className="text-right">Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}