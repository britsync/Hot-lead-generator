import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonsProps {
  onExportExcel: () => void;
  onExportCSV: () => void;
}

export default function ExportButtons({ onExportExcel, onExportCSV }: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onExportExcel}
        variant="outline"
        className="gap-2"
        data-testid="button-export-excel"
      >
        <Download className="h-4 w-4" />
        Export Excel
      </Button>
      <Button
        onClick={onExportCSV}
        variant="outline"
        className="gap-2"
        data-testid="button-export-csv"
      >
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
