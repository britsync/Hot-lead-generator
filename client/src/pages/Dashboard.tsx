import { useQuery } from "@tanstack/react-query";
import { Lead } from "@shared/schema";
import MetricCard from "@/components/MetricCard";
import LeadsTable from "@/components/LeadsTable";
import ExportButtons from "@/components/ExportButtons";
import { Users, Clock, TrendingUp, TrendingDown } from "lucide-react";

export default function Dashboard() {
  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads'],
    refetchInterval: 5000, // Refresh every 5 seconds to get new webhook data
  });

  const totalLeads = leads.length;
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  const leadsLast24Hours = leads.filter(
    (lead) => new Date(lead.timestamp).getTime() > twentyFourHoursAgo
  ).length;
  const highScoreLeads = leads.filter((lead) => lead.score >= 80).length;
  const lowScoreLeads = leads.filter((lead) => lead.score < 80).length;

  const handleExportExcel = () => {
    window.open('/api/export/excel', '_blank');
  };

  const handleExportCSV = () => {
    window.open('/api/export/csv', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold" data-testid="text-page-title">
              Lead Generation Dashboard
            </h1>
            <ExportButtons
              onExportExcel={handleExportExcel}
              onExportCSV={handleExportCSV}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Leads"
            value={totalLeads}
            icon={Users}
          />
          <MetricCard
            title="Last 24 Hours"
            value={leadsLast24Hours}
            icon={Clock}
          />
          <MetricCard
            title="High Score (≥80)"
            value={highScoreLeads}
            icon={TrendingUp}
          />
          <MetricCard
            title="Low Score (<80)"
            value={lowScoreLeads}
            icon={TrendingDown}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">All Leads</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <LeadsTable leads={leads} />
          )}
        </div>
      </main>
    </div>
  );
}
