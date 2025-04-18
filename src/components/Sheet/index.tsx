import { useSheet } from "@/hooks/useSheet";
import { Loader } from "lucide-react";
import Header from "./Header";
import ToolBar from "./ToolBar";
import Grid from "./Grid";
import BottomBar from "./BottomBar";

export default function Sheet() {
  const { isSheetLoading } = useSheet();
  console.log("here");
  return (
    <div className="w-full h-full">
      {isSheetLoading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <ToolBar />
          <Grid />
          <BottomBar />
        </>
      )}
    </div>
  );
}
