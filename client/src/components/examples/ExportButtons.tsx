import ExportButtons from '../ExportButtons';

export default function ExportButtonsExample() {
  return (
    <div className="p-8 bg-background">
      <ExportButtons
        onExportExcel={() => console.log('Export Excel triggered')}
        onExportCSV={() => console.log('Export CSV triggered')}
      />
    </div>
  );
}
