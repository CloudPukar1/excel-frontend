import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { cn } from "@/lib/utils";
import { initialColumns } from "@/lib/constants";

import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";

interface ICell {
  col: number;
  row: number;
}

export default function Sheet() {
  const { sheetId } = useParams();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const retreiveSheets = async (search: string) => {
    console.log("fetching");
    const {
      data: { data },
    } = await axios.get(
      `http://localhost:3000/api/v1/sheet/${sheetId}?search=${search}`
    );
    setCellValues(data);
    console.log(data);
    return data;
  };

  const updateSheet = async () => {
    const sheetData = JSON.parse(localStorage.getItem("cellValues")!);
    const { data: { data } } = await axios.put(`http://localhost:3000/api/v1/sheet/${sheetId}`, sheetData);
    console.log("sheet data polled");
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
  const [editableCell, setEditableCell] = useState<ICell | null>();
  const [columns, setColumns] = useState(initialColumns);
  const [cellValues, setCellValues] = useState<any[][]>([]);

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
      setColumns(initialColumns);
    };
    getColumns();
  }, []);

  useEffect(() => {
    localStorage.setItem("cellValues", JSON.stringify(cellValues));
  }, [cellValues]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateSheetMutation();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (isLoading) return <div>Fetching sheets...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  console.log(sheets);

  return (
    <div>
      <Input type="text" onChange={(e) => setSearch(e.target.value)} />
      <table>
        <thead>
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
          {cellValues.map((cellRowValues, rowIndex) => (
            <tr>
              <th
                className={cn(
                  "h-8",
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
                          const arr = [...prevCellValues];
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
