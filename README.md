# Lead Generation Dashboard

A real-time analytics dashboard for tracking and analyzing leads from your n8n workflow. Features webhook integration, live metrics, sortable data tables, and Excel/CSV export capabilities.

![Dashboard](https://img.shields.io/badge/Stack-React%20%2B%20Express-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- 📊 **Real-time Metrics**: Track total leads, 24-hour activity, high/low score distribution
- 🔄 **Webhook Integration**: Automatic data collection from n8n workflow
- 📋 **Sortable Data Table**: View all lead details with sorting by name, score, or timestamp
- 📥 **Export Options**: Download data as Excel (.xlsx) or CSV formats
- ⚡ **Auto-refresh**: Dashboard updates every 5 seconds for real-time insights
- 🎨 **Professional UI**: Clean, responsive design built with Tailwind CSS and shadcn/ui

## Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **TanStack Query** - Data fetching
- **Wouter** - Routing
- **date-fns** - Date formatting

### Backend
- **Express.js** - Web server
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **ExcelJS** - Excel export
- **In-memory Storage** - Fast data persistence

## Quick Start

### Prerequisites
- Node.js 18+ or Node.js 20+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lead-generation-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the dashboard**
   Open your browser to `http://localhost:5000`

## Webhook Configuration

### Setting up n8n Workflow

Your n8n workflow needs to send POST requests to the webhook endpoint with lead data.

**Webhook URL**: `http://your-domain.com/api/webhook/lead`

**Request Format**:
```json
{
  "name": "John Smith",
  "email": "john.smith@company.com",
  "phone": "+1 (555) 123-4567",
  "company": "Tech Corp Solutions",
  "role": "Sales Director",
  "location": "New York, US",
  "score": 92
}
```

### Required Fields
- `name` (string) - Lead's full name
- `email` (string) - Lead's email address
- `company` (string) - Company name
- `role` (string) - Job title/role
- `location` (string) - Geographic location
- `score` (number) - Lead score (0-100)

### Optional Fields
- `phone` (string) - Phone number

### Example n8n HTTP Request Node Configuration

1. Add an **HTTP Request** node to your n8n workflow
2. Configure as follows:
   - **Method**: POST
   - **URL**: `http://your-dashboard-url/api/webhook/lead`
   - **Headers**: 
     - `Content-Type`: `application/json`
   - **Body**: Map your workflow data to the required format above

## API Endpoints

### Webhook Endpoint
```
POST /api/webhook/lead
```
Receives lead data from n8n workflow and stores it.

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "company": "string",
  "role": "string",
  "location": "string",
  "score": number
}
```

**Response**:
```json
{
  "success": true,
  "lead": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    ...
  }
}
```

### Get All Leads
```
GET /api/leads
```
Returns all stored leads.

### Export to Excel
```
GET /api/export/excel
```
Downloads all leads as an Excel file.

### Export to CSV
```
GET /api/export/csv
```
Downloads all leads as a CSV file.

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment**
   - Set `NODE_ENV=production` in Vercel dashboard
   - Update your n8n webhook URL to point to your Vercel deployment

### Deploy to Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Deploy**
   ```bash
   git push heroku main
   ```

3. **Update n8n Webhook**
   Point your n8n workflow to: `https://your-app-name.herokuapp.com/api/webhook/lead`

### Deploy to Railway

1. **Connect GitHub Repository**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repo

2. **Configure**
   - Railway will auto-detect the Node.js app
   - Set environment variable: `NODE_ENV=production`

3. **Deploy**
   - Railway auto-deploys on git push

### Deploy to DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Create app from GitHub repository

2. **Configure Build**
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`

3. **Deploy**
   - App Platform handles deployment automatically

## Environment Variables

Create a `.env` file in the root directory (optional for development):

```env
NODE_ENV=development
PORT=5000
```

For production, set:
```env
NODE_ENV=production
PORT=5000
```

## Project Structure

```
lead-generation-dashboard/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express application
│   ├── routes.ts          # API route handlers
│   ├── storage.ts         # In-memory data storage
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Zod schemas and TypeScript types
└── package.json
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Type check the codebase

### Adding Features

The codebase is structured for easy extension:

1. **Add new metrics**: Edit `client/src/pages/Dashboard.tsx`
2. **Modify table columns**: Edit `client/src/components/LeadsTable.tsx`
3. **Add API endpoints**: Edit `server/routes.ts`
4. **Change data schema**: Edit `shared/schema.ts`

## Testing Webhook Locally

Use curl to test the webhook endpoint:

```bash
curl -X POST http://localhost:5000/api/webhook/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "email": "test@example.com",
    "phone": "+1 555-0000",
    "company": "Test Company",
    "role": "Manager",
    "location": "New York, US",
    "score": 85
  }'
```

## Data Persistence

Currently, the application uses in-memory storage, which means:
- ✅ Fast performance
- ✅ Simple setup
- ⚠️ Data is lost when the server restarts

For production use with persistent storage, you can:
1. Integrate with PostgreSQL/MySQL database
2. Use the built-in Replit database
3. Connect to external database services (Supabase, PlanetScale, etc.)

## Troubleshooting

### Webhook not receiving data
- Verify your n8n workflow is sending to the correct URL
- Check that the request body matches the required schema
- Review server logs for validation errors

### Dashboard not updating
- Ensure the development server is running
- Check browser console for API errors
- Verify the webhook is successfully POSTing data

### Export not working
- Check that leads data exists in the system
- Verify browser isn't blocking downloads
- Review server logs for export errors

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the n8n workflow configuration
3. Verify all required fields are being sent in webhook requests

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
