import { createGrid } from "@/services/Grid";
import { getSheetById, updateSheetById } from "@/services/Sheet";
import { ISheetDetail } from "@/types/Sheets";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type ISheetContext = {
  isSheetLoading: boolean;
  sheetDetail: ISheetDetail | null;
  handleCreateGrid: () => void;
  handleTitleChange: (title: string) => void;
};

const SheetContext = createContext({} as ISheetContext);

export default function SheetProvider({ children }: PropsWithChildren) {
  const { sheetId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const gridId = searchParams.get("gridId");

  const [isSheetLoading, setIsSheetLoading] = useState(true);
  const [sheetDetail, setSheetDetail] = useState<ISheetDetail | null>(null);

  const handleTitleChange = async (title: string) => {
    if (!sheetId) {
      return;
    }

    try {
      await updateSheetById(sheetId, { title });
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const getSheetDetails = async () => {
    if (!sheetId) return;

    setIsSheetLoading(true);
    try {
      const {
        data: {
          data: { _id, grids, title },
        },
      } = await getSheetById(sheetId);
      setSheetDetail({
        _id,
        grids,
        title,
      });
      if (!gridId) {
        navigate(
          { search: `gridId=${grids[0]._id}` },
          { replace: !sheetDetail }
        );
      }

      setIsSheetLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleCreateGrid = async () => {
    if (!sheetDetail) return;

    try {
      const {
        data: { data },
      } = await createGrid(sheetDetail._id);
      const sheetData = { ...sheetDetail };
      sheetData.grids.push(data);
      setSheetDetail(sheetData);
      navigate({ search: `gridId=${data._id}` });
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    getSheetDetails();
  }, []);

  return (
    <SheetContext.Provider
      value={{
        sheetDetail,
        isSheetLoading,
        handleCreateGrid,
        handleTitleChange,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
}

export const useSheet = () => {
  return useContext(SheetContext);
};
