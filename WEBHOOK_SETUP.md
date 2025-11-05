# n8n Webhook Setup Guide

This guide explains how to configure your n8n workflow to send lead data to the dashboard.

## Overview

Your n8n workflow needs to send HTTP POST requests to the dashboard's webhook endpoint with lead information. The dashboard will automatically receive, store, and display this data in real-time.

## Webhook Endpoint

```
POST https://your-dashboard-url/api/webhook/lead
```

Replace `your-dashboard-url` with your actual deployment URL:
- **Local Development**: `http://localhost:5000/api/webhook/lead`
- **Production**: `https://your-domain.com/api/webhook/lead`

## Data Format

### Required Fields

The webhook expects a JSON payload with the following structure:

```json
{
  "name": "John Smith",
  "email": "john.smith@company.com",
  "phone": "+1 (555) 123-4567",
  "company": "Tech Corporation",
  "role": "Sales Director",
  "location": "New York, US",
  "score": 92
}
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `name` | string | ✅ Yes | Lead's full name | "Sarah Johnson" |
| `email` | string | ✅ Yes | Lead's email address | "sarah@company.com" |
| `phone` | string | ❌ No | Phone number | "+44 20 7123 4567" |
| `company` | string | ✅ Yes | Company name | "Innovate Tech Ltd" |
| `role` | string | ✅ Yes | Job title/role | "VP of Marketing" |
| `location` | string | ✅ Yes | City and country | "London, UK" |
| `score` | number | ✅ Yes | Lead score (0-100) | 87 |

## n8n Configuration

### Method 1: Using HTTP Request Node

This is the most common approach for sending data to the webhook.

#### Step 1: Add HTTP Request Node

1. In your n8n workflow, add an **HTTP Request** node after your lead scoring/processing
2. Name it something like "Send to Dashboard"

#### Step 2: Configure HTTP Request

**Authentication**: None (unless you add custom auth)

**Request Method**: POST

**URL**: `https://your-dashboard-url/api/webhook/lead`

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body**: JSON

**Body Parameters**:
```json
{
  "name": "={{ $json.name }}",
  "email": "={{ $json.email }}",
  "phone": "={{ $json.phone }}",
  "company": "={{ $json.company }}",
  "role": "={{ $json.role }}",
  "location": "={{ $json.location }}",
  "score": "={{ $json.score }}"
}
```

#### Step 3: Map Your Data

Adjust the expressions (e.g., `{{ $json.name }}`) to match your workflow's data structure. For example:

If your previous node outputs data like:
```json
{
  "contacts": {
    "full_name": "John Smith",
    "email": {
      "value": "john@company.com"
    },
    "phones": [
      {
        "sanitized_number": "+1 555 1234"
      }
    ]
  },
  "company": {
    "name": "Tech Corp"
  },
  "role": {
    "title": "Director"
  },
  "location": {
    "city": "New York",
    "country": "US"
  },
  "lead_score": 95
}
```

Your mapping would be:
```json
{
  "name": "={{ $json.contacts.full_name }}",
  "email": "={{ $json.contacts.email.value }}",
  "phone": "={{ $json.contacts.phones[0].sanitized_number }}",
  "company": "={{ $json.company.name }}",
  "role": "={{ $json.role.title }}",
  "location": "={{ $json.location.city }}, {{ $json.location.country }}",
  "score": "={{ $json.lead_score }}"
}
```

### Method 2: Using Webhook Node (Receive)

If you want the dashboard to trigger n8n workflows:

1. Add a **Webhook** node (trigger)
2. Set **HTTP Method**: POST
3. Set **Path**: `/lead-webhook` (or your choice)
4. Configure your workflow to process and then send to dashboard

### Method 3: Using Code Node

For advanced transformations:

```javascript
// Code node to transform and send data
const webhookUrl = 'https://your-dashboard-url/api/webhook/lead';

const leadData = {
  name: $input.item.json.full_name,
  email: $input.item.json.email_address,
  phone: $input.item.json.phone_number || null,
  company: $input.item.json.company_name,
  role: $input.item.json.job_title,
  location: `${$input.item.json.city}, ${$input.item.json.country}`,
  score: parseInt($input.item.json.lead_score)
};

const response = await $http.post(webhookUrl, {
  body: leadData,
  headers: {
    'Content-Type': 'application/json'
  }
});

return { json: response };
```

## Example n8n Workflow

Here's a complete example workflow structure:

```
1. [Trigger] Schedule/Webhook
   ↓
2. [HTTP Request] Fetch leads from Apollo.io
   ↓
3. [Split In Batches] Loop through leads
   ↓
4. [AI] Score the lead (Claude/OpenAI)
   ↓
5. [IF] Check if score meets threshold
   ↓
6. [HTTP Request] Send to Dashboard ← You are here!
   ↓
7. [Google Sheets] Also log to sheets (optional)
```

## Testing Your Configuration

### Test in n8n

1. Click "Execute Workflow" in n8n
2. Check the HTTP Request node output
3. Look for a successful response:
   ```json
   {
     "success": true,
     "lead": {
       "id": "uuid-here",
       "name": "Test Lead",
       ...
     }
   }
   ```

### Test with Sample Data

Use n8n's "Manual Execution" feature with sample data:

```json
{
  "name": "Test Lead",
  "email": "test@example.com",
  "phone": "+1 555-0000",
  "company": "Test Company Inc",
  "role": "Test Manager",
  "location": "Test City, US",
  "score": 85
}
```

### Test with curl

You can also test the webhook directly:

```bash
curl -X POST https://your-dashboard-url/api/webhook/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manual Test",
    "email": "manual@test.com",
    "phone": "+1 555-9999",
    "company": "Manual Test Co",
    "role": "Tester",
    "location": "Test Location",
    "score": 90
  }'
```

Expected response:
```json
{
  "success": true,
  "lead": {
    "id": "generated-uuid",
    "name": "Manual Test",
    "email": "manual@test.com",
    "phone": "+1 555-9999",
    "company": "Manual Test Co",
    "role": "Tester",
    "location": "Test Location",
    "score": 90,
    "timestamp": "2024-11-05T18:30:00.000Z"
  }
}
```

## Error Handling

### Common Errors and Solutions

#### 400 Bad Request
**Cause**: Missing required fields or invalid data format

**Solution**: 
- Verify all required fields are present
- Check that `score` is a number, not a string
- Ensure JSON is properly formatted

#### 404 Not Found
**Cause**: Wrong URL or endpoint path

**Solution**:
- Verify the URL is correct
- Ensure `/api/webhook/lead` path is included
- Check for typos

#### 500 Internal Server Error
**Cause**: Server-side error processing the data

**Solution**:
- Check dashboard server logs
- Verify data types match expected schema
- Ensure all required fields are provided

### n8n Error Handling

Add error handling to your workflow:

1. **Add "On Error" workflow branch**
   - Right-click the HTTP Request node
   - Select "Add Error Workflow"

2. **Log errors**
   - Add a node to log failed requests
   - Store in Google Sheets or send alert

3. **Retry logic**
   - Configure HTTP Request node retry settings:
     - Max Attempts: 3
     - Wait Between Tries: 1000ms

## Verification

After setting up the webhook, verify it's working:

1. ✅ **Execute your n8n workflow**
2. ✅ **Check the dashboard** - new lead should appear within 5 seconds
3. ✅ **Verify metrics updated** - Total Leads, Last 24 Hours counters
4. ✅ **Check lead appears in table** - with correct score badge
5. ✅ **Test exports** - Excel and CSV should include new lead

## Advanced Configuration

### Adding Authentication

To secure your webhook endpoint, you can add a secret token:

**In n8n HTTP Request headers**:
```json
{
  "Content-Type": "application/json",
  "X-Webhook-Secret": "your-secret-token-here"
}
```

Then modify the server code to validate this header.

### Batch Processing

If you're sending multiple leads, send them one at a time in a loop rather than as an array. The webhook endpoint processes one lead per request.

### Custom Field Mapping

If your workflow uses different field names, map them in the HTTP Request body:

```json
{
  "name": "={{ $json.your_name_field }}",
  "email": "={{ $json.your_email_field }}",
  "phone": "={{ $json.your_phone_field }}",
  "company": "={{ $json.your_company_field }}",
  "role": "={{ $json.your_role_field }}",
  "location": "={{ $json.your_location_field }}",
  "score": "={{ $json.your_score_field }}"
}
```

## Support

If you encounter issues:

1. Check the dashboard server logs
2. Verify the webhook URL is accessible
3. Test with curl to isolate n8n vs server issues
4. Review n8n node execution output for error details
5. Ensure all required fields are being sent

## Example from Your Workflow

Based on your provided n8n workflow JSON, here's how to add the webhook:

**After your "SCORE THE LEAD" node**, add an HTTP Request node with:

**URL**: `https://your-dashboard-url/api/webhook/lead`

**Body mapping** (based on your workflow structure):
```json
{
  "name": "={{ $('Loop Over Items').item.json.name.full }}",
  "email": "={{ $('Loop Over Items').item.json.contacts.email.value }}",
  "phone": "={{ $('Loop Over Items').item.json.contacts.phones[0].sanitized_number }}",
  "company": "={{ $('Loop Over Items').item.json.company.name }}, {{ $('Loop Over Items').item.json.company.industry }}",
  "role": "={{ $('Loop Over Items').item.json.role.title }}",
  "location": "={{ $('Loop Over Items').item.json.location.city }}, {{ $('Loop Over Items').item.json.location.country }}",
  "score": "={{ $('SCORE THE LEAD').item.json.output[0].content[0].text.score }}"
}
```

This will send each lead to your dashboard as it's processed!
