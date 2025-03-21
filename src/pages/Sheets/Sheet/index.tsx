import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { cn, generateMatrix, range } from "@/lib/utils";
import { initialColumns } from "@/lib/constants";

import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ICell {
  col: number;
  row: number;
}

export default function Sheet() {
  const { sheetId } = useParams();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const retreiveSheet = async (search: string) => {
    console.log("fetching");
    const {
      data: { data },
    } = await axios.get(
      `http://localhost:3000/api/v1/sheet/${sheetId}?search=${search}`
    );
    setCellValues(data.data);
    return data.data;
  };

  const updateSheet = async () => {
    const sheetData = JSON.parse(localStorage.getItem("cellValues")!);
    const {
      data: { data },
    } = await axios.put(
      `http://localhost:3000/api/v1/sheet/${sheetId}`,
      sheetData
    );
    console.log("sheet data polled");
    return data;
  };

  const {
    data: sheets,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["sheetData", { search }],
    queryFn: () => retreiveSheet(search),
  });

  const { mutateAsync: updateSheetMutation } = useMutation({
    mutationFn: updateSheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sheetData"] });
    },
  });

  const [selectedCell, setSelectedCell] = useState<ICell>({
    row: 1,
    col: 1,
  });
  const [cols, setCols] = useState(1);
  const [rows, setRows] = useState(1);
  const [matrix, setMatrix] = useState<any[][]>([]);
  const [columns, setColumns] = useState(initialColumns);
  const [cellValues, setCellValues] = useState<any[][]>([]);
  const [editableCell, setEditableCell] = useState<ICell | null>();

  const handleCellClick = ({
    row,
    col,
    editable,
  }: ICell & { editable: boolean }) => {
    setSelectedCell({ row, col });
    if (editable) {
      setEditableCell({ row, col });
    } else {
      setEditableCell(null);
    }
  };

  useEffect(() => {
    const getColumns = () => {
      setColumns((prev) => [
        ...prev,
        ...initialColumns.map((col) => initialColumns[cols - 2] + col),
      ]);
    };
    if (cols > 1) {
      getColumns();
    }
  }, [cols]);

  useEffect(() => {
    localStorage.setItem("cellValues", JSON.stringify(cellValues));
  }, [cellValues]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     updateSheetMutation();
  //   }, 10000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);
  useEffect(() => {
    console.log("called");
    setMatrix(
      generateMatrix(cols, rows).map((data, index) =>
        data.map((_, i) =>
          cellValues.length > index ? cellValues[index][i] : ""
        )
      )
    );
  }, [rows, cols]);

  if (isLoading) return <div>Fetching sheets...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  console.log(matrix);
  return (
    <div>
      <Input type="text" onChange={(e) => setSearch(e.target.value)} />
      <Button
        className="absolute right-1 top-0 z-50"
        onClick={() => setCols((prev) => prev + 1)}
      >
        Add 26 more columns
      </Button>
      <Button
        className="absolute left-1 bottom-0 z-50"
        onClick={() => setRows((prev) => prev + 1)}
      >
        Add 1000 more rows
      </Button>
      <table>
        <thead className="sticky top-0 bg-white">
          <tr className="text-center h-8">
            <th className="min-w-20"></th>
            {columns.map((column, index) => (
              <th
                className={cn(
                  "min-w-20",
                  index + 1 === selectedCell.col && "bg-blue-400"
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((cellRowValues, rowIndex) => (
            <tr>
              <th
                scope="row"
                className={cn(
                  "h-8 sticky left-0 bg-white z-10",
                  rowIndex + 1 === selectedCell.row && "bg-blue-400"
                )}
              >
                {rowIndex + 1}
              </th>
              {cellRowValues.map((cellRowValue, colIndex) => (
                <td
                  onClick={() =>
                    handleCellClick({
                      row: rowIndex + 1,
                      col: colIndex + 1,
                      editable: false,
                    })
                  }
                  onDoubleClick={() =>
                    handleCellClick({
                      row: rowIndex + 1,
                      col: colIndex + 1,
                      editable: true,
                    })
                  }
                  className={cn(
                    "h-8",
                    selectedCell.row === rowIndex + 1 &&
                      selectedCell.col === colIndex + 1
                      ? "border-blue-700! border-2"
                      : ""
                  )}
                >
                  {editableCell?.row === selectedCell.row &&
                  editableCell?.col === selectedCell.col &&
                  selectedCell.row === rowIndex + 1 &&
                  selectedCell.col === colIndex + 1 ? (
                    <Input
                      autoFocus
                      className="h-8 w-20 p-0 rounded-none border-none"
                      type="text"
                      value={cellRowValue}
                      onChange={(e) =>
                        setCellValues((prevCellValues) => {
                          const arr = JSON.parse(
                            JSON.stringify(prevCellValues)
                          );
                          arr[rowIndex][colIndex] = e.target.value;
                          return arr;
                        })
                      }
                    />
                  ) : (
                    cellRowValue
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
