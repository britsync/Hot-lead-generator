import MetricCard from '../MetricCard';
import { Users } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="p-8 bg-background">
      <MetricCard title="Total Leads" value={1234} icon={Users} />
    </div>
  );
}
