import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import ExcelJS from "exceljs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Webhook endpoint to receive lead data from n8n workflow
  app.post("/api/webhook/lead", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      res.json({ success: true, lead });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Invalid lead data" 
      });
    }
  });

  // Get all leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Export leads to Excel
  app.get("/api/export/excel", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Leads");

      // Add header row
      worksheet.columns = [
        { header: "Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone", key: "phone", width: 20 },
        { header: "Company", key: "company", width: 30 },
        { header: "Role", key: "role", width: 30 },
        { header: "Location", key: "location", width: 25 },
        { header: "Score", key: "score", width: 10 },
        { header: "Timestamp", key: "timestamp", width: 25 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };

      // Add data rows
      leads.forEach((lead) => {
        worksheet.addRow({
          name: lead.name,
          email: lead.email,
          phone: lead.phone || "",
          company: lead.company,
          role: lead.role,
          location: lead.location,
          score: lead.score,
          timestamp: new Date(lead.timestamp).toLocaleString(),
        });
      });

      // Set response headers
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=leads-${Date.now()}.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      res.status(500).json({ error: "Failed to export to Excel" });
    }
  });

  // Export leads to CSV
  app.get("/api/export/csv", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();

      // Create CSV content
      const headers = ["Name", "Email", "Phone", "Company", "Role", "Location", "Score", "Timestamp"];
      const csvRows = [headers.join(",")];

      leads.forEach((lead) => {
        const row = [
          `"${lead.name}"`,
          `"${lead.email}"`,
          `"${lead.phone || ""}"`,
          `"${lead.company}"`,
          `"${lead.role}"`,
          `"${lead.location}"`,
          lead.score.toString(),
          `"${new Date(lead.timestamp).toLocaleString()}"`,
        ];
        csvRows.push(row.join(","));
      });

      const csvContent = csvRows.join("\n");

      // Set response headers
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=leads-${Date.now()}.csv`
      );

      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      res.status(500).json({ error: "Failed to export to CSV" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
