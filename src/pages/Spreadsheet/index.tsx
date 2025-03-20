import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { cn } from "@/lib/utils";
import { initialColumns } from "@/lib/constants";

import { Input } from "@/components/ui/input";

interface ICell {
  col: number;
  row: number;
  editable: boolean;
}

const addSpreadsheet = async () => {
  const response = await axios.get("<api_url>");
  return response.data;
};

export default function Spreadsheet() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");

  const retreiveSpreadsheets = async () => {
    console.log("fetching");
    const {
      data: { data },
    } = await axios.get("http://localhost:3000/api/v1/sheet/5");
    setCellValues(data);
    console.log(data);
    return data;
  };

  const {
    data: spreadsheets,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["spreadsheetData", { search }],
    queryFn: () => retreiveSpreadsheets(search),
  });

  const { mutateAsync: addSpreadsheetMutation } = useMutation({
    mutationFn: addSpreadsheet,
    onSuccess: () => {
      queryClient.invalidateQueries(["spreadsheetData"]);
    },
  });

  const [selectedCell, setSelectedCell] = useState({
    row: 1,
    col: 1,
    editable: false,
  });
  const [columns, setColumns] = useState(initialColumns);
  const [cellValues, setCellValues] = useState([]);

  const handleCellClick = ({ row, col, editable }: ICell) => {
    setSelectedCell({ row, col, editable });
  };

  useEffect(() => {
    const getColumns = () => {
      setColumns(initialColumns);
    };
    getColumns();
  }, []);

  if (isLoading) return <div>Fetching spreadsheets...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  console.log(spreadsheets);

  return (
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
                {selectedCell.editable &&
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
  );
}
