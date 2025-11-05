# Deployment Guide

This guide provides detailed instructions for deploying the Lead Generation Dashboard to various platforms.

## Table of Contents
- [Vercel Deployment](#vercel-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Railway Deployment](#railway-deployment)
- [DigitalOcean Deployment](#digitalocean-deployment)
- [Docker Deployment](#docker-deployment)
- [Post-Deployment Setup](#post-deployment-setup)

---

## Vercel Deployment

Vercel is recommended for quick and easy deployment with automatic HTTPS.

### Steps:

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? (accept default or customize)
   - Directory? `./` (current directory)
   - Override settings? **N**

5. **Configure Production Environment**
   ```bash
   vercel env add NODE_ENV production
   ```

6. **Promote to Production**
   ```bash
   vercel --prod
   ```

### Your dashboard will be live at:
`https://your-project-name.vercel.app`

---

## Heroku Deployment

### Prerequisites:
- Heroku account
- Heroku CLI installed

### Steps:

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Add Procfile** (if not exists)
   Create `Procfile` in root directory:
   ```
   web: npm start
   ```

4. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```
   (If your branch is named differently, use: `git push heroku your-branch:main`)

6. **Open your app**
   ```bash
   heroku open
   ```

### Your dashboard will be live at:
`https://your-app-name.herokuapp.com`

---

## Railway Deployment

Railway provides automatic deployments from GitHub with zero configuration.

### Steps:

1. **Push to GitHub**
   - Create a GitHub repository
   - Push your code to GitHub

2. **Connect to Railway**
   - Go to [Railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment**
   - Railway auto-detects Node.js
   - Add environment variable:
     - `NODE_ENV` = `production`

4. **Deploy**
   - Railway automatically builds and deploys
   - Get your URL from the Railway dashboard

### Auto-deployment:
Railway automatically redeploys when you push to GitHub.

---

## DigitalOcean Deployment

### Using App Platform:

1. **Create App**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure App**
   - **Build Command**: `npm install && npm run build`
   - **Run Command**: `npm start`
   - **HTTP Port**: `5000`

3. **Environment Variables**
   ```
   NODE_ENV=production
   ```

4. **Deploy**
   - Review and create the app
   - DigitalOcean handles SSL automatically

### Using Droplet (VPS):

1. **Create Droplet**
   - Choose Ubuntu 22.04
   - Select size (Basic $6/month is sufficient)

2. **SSH into Droplet**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd lead-generation-dashboard
   npm install
   ```

6. **Build and Start**
   ```bash
   npm run build
   pm2 start npm --name "lead-dashboard" -- start
   pm2 save
   pm2 startup
   ```

7. **Setup Nginx (optional, for custom domain)**
   ```bash
   sudo apt-get install nginx
   ```

   Create Nginx config at `/etc/nginx/sites-available/lead-dashboard`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/lead-dashboard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Docker Deployment

### Create Dockerfile:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

### Create .dockerignore:

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
```

### Build and Run:

```bash
# Build image
docker build -t lead-dashboard .

# Run container
docker run -p 5000:5000 -e NODE_ENV=production lead-dashboard
```

### Deploy to Docker Hub:

```bash
docker tag lead-dashboard your-username/lead-dashboard
docker push your-username/lead-dashboard
```

---

## Post-Deployment Setup

After deploying to any platform, complete these steps:

### 1. Test the Deployment

Visit your deployed URL and verify:
- ✅ Dashboard loads correctly
- ✅ Metrics display (will be 0 initially)
- ✅ No console errors

### 2. Configure n8n Webhook

Update your n8n workflow to point to your production webhook URL:

**Webhook URL**: `https://your-deployed-url/api/webhook/lead`

In your n8n HTTP Request node:
- **Method**: POST
- **URL**: Your production webhook URL
- **Headers**: `Content-Type: application/json`
- **Body**: Your lead data mapping

### 3. Test Webhook Integration

Send a test lead from n8n or use curl:

```bash
curl -X POST https://your-deployed-url/api/webhook/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Test",
    "email": "test@example.com",
    "phone": "+1 555-0000",
    "company": "Test Company",
    "role": "Manager",
    "location": "New York, US",
    "score": 90
  }'
```

### 4. Verify Dashboard Updates

- Check your dashboard
- Verify the test lead appears
- Confirm metrics updated
- Test Excel/CSV exports

### 5. Monitor Application

- Check application logs regularly
- Monitor webhook success rates
- Verify data accuracy

---

## Custom Domain Setup

### For Vercel:
```bash
vercel domains add your-domain.com
```

### For Heroku:
```bash
heroku domains:add your-domain.com
```

Then update your DNS:
- Create a CNAME record pointing to your platform's URL

---

## Scaling Considerations

### For High Traffic:

1. **Add Database Persistence**
   - Replace in-memory storage with PostgreSQL/MySQL
   - Prevents data loss on server restart

2. **Add Redis Caching**
   - Cache frequently accessed data
   - Reduce database load

3. **Enable CDN**
   - Serve static assets via CDN
   - Improve load times globally

4. **Add Load Balancing**
   - Distribute traffic across multiple instances
   - Improve reliability

---

## Troubleshooting

### Build Fails
- Verify Node.js version (20+ required)
- Check all dependencies are listed in package.json
- Review build logs for specific errors

### App Crashes on Startup
- Verify NODE_ENV is set to "production"
- Check PORT environment variable
- Review application logs

### Webhook Not Receiving Data
- Verify URL is correct in n8n
- Check firewall/security group settings
- Review webhook endpoint logs

---

## Need Help?

- Check the main README.md
- Review platform-specific documentation
- Verify n8n workflow configuration
