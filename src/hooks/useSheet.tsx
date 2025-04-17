import { updateSheetById } from "@/services/Sheet";
import { ISheetDetail } from "@/types/Sheets";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

type ISheetContext = {
  isSheetLoading: boolean;
  sheetDetail: ISheetDetail | null;
  handleTitleChange: (title: string) => void;
};

const SheetContext = createContext({} as ISheetContext);

export default function SheetProvider({ children }: PropsWithChildren) {
  const { sheetId } = useParams();

  const [isSheetLoading] = useState(true);
  const [sheetDetail] = useState<ISheetDetail | null>(null);

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

  return (
    <SheetContext.Provider
      value={{
        sheetDetail,
        isSheetLoading,
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
