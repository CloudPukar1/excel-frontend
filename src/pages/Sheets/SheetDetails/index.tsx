import Sheet from "@/components/Sheet";
import SheetProvider from "@/hooks/useSheet";

export default function SheetDetails() {
  return (
    <SheetProvider>
      <Sheet />
    </SheetProvider>
  );
}
