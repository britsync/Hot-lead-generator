import { Lead } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LeadsTableProps {
  leads: Lead[];
}

type SortField = 'name' | 'score' | 'timestamp';
type SortDirection = 'asc' | 'desc';

export default function LeadsTable({ leads }: LeadsTableProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'score') {
      comparison = a.score - b.score;
    } else if (sortField === 'timestamp') {
      comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="text-empty-state">
        <div className="rounded-full bg-muted p-4 mb-4">
          <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No leads received yet</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Waiting for webhook data from your lead generation workflow.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden" data-testid="table-leads">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b">
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="h-8 font-semibold text-sm uppercase tracking-wide hover-elevate"
                  data-testid="button-sort-name"
                >
                  Name
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Company
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                Location
              </th>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('score')}
                  className="h-8 font-semibold text-sm uppercase tracking-wide hover-elevate"
                  data-testid="button-sort-score"
                >
                  Score
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </th>
              <th className="px-6 py-4 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('timestamp')}
                  className="h-8 font-semibold text-sm uppercase tracking-wide hover-elevate"
                  data-testid="button-sort-timestamp"
                >
                  Timestamp
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedLeads.map((lead, index) => (
              <tr
                key={lead.id}
                className="border-b last:border-0 hover-elevate"
                data-testid={`row-lead-${index}`}
              >
                <td className="px-6 py-4 font-medium" data-testid={`text-lead-name-${index}`}>
                  {lead.name}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-primary hover:underline"
                    data-testid={`link-email-${index}`}
                  >
                    {lead.email}
                  </a>
                </td>
                <td className="px-6 py-4">
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-primary hover:underline"
                      data-testid={`link-phone-${index}`}
                    >
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-6 py-4" data-testid={`text-company-${index}`}>
                  {lead.company}
                </td>
                <td className="px-6 py-4 text-muted-foreground" data-testid={`text-role-${index}`}>
                  {lead.role}
                </td>
                <td className="px-6 py-4 text-muted-foreground" data-testid={`text-location-${index}`}>
                  {lead.location}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={lead.score >= 80 ? "default" : "secondary"}
                    className="rounded-full px-3 py-1"
                    data-testid={`badge-score-${index}`}
                  >
                    {lead.score}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground" data-testid={`text-timestamp-${index}`}>
                  <span title={new Date(lead.timestamp).toLocaleString()}>
                    {formatDistanceToNow(new Date(lead.timestamp), { addSuffix: true })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
