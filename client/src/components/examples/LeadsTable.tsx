import LeadsTable from '../LeadsTable';
import { Lead } from '@shared/schema';

//todo: remove mock functionality
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Solutions',
    role: 'Sales Director',
    location: 'New York, US',
    score: 92,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sjohnson@innovate.io',
    phone: '+44 20 7123 4567',
    company: 'Innovate Technologies',
    role: 'VP of Marketing',
    location: 'London, UK',
    score: 87,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'm.chen@globalventures.com',
    phone: '+1 (555) 987-6543',
    company: 'Global Ventures Inc',
    role: 'Chief Technology Officer',
    location: 'San Francisco, US',
    score: 75,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: '4',
    name: 'Emma Williams',
    email: 'ewilliams@startup.co',
    phone: '',
    company: 'Startup Accelerator',
    role: 'Business Development Manager',
    location: 'Austin, US',
    score: 68,
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
];

export default function LeadsTableExample() {
  return (
    <div className="p-8 bg-background">
      <LeadsTable leads={mockLeads} />
    </div>
  );
}
