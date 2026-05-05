import nodemailer from "nodemailer";
import { db } from "@workspace/db";
import { usersTable, jobAlertsTable, alertEmailsSentTable, jobsTable } from "@workspace/db/schema";
import { eq, and, or, ilike, inArray } from "drizzle-orm";

// Create transporter for direct email sending (used in cron jobs)
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

/**
 * Send job alert digest email to a user based on their alert preferences
 * @param userId - User ID
 * @param alertId - Job Alert ID
 */
export async function sendJobAlertDigestEmail(userId: number, alertId: number) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      console.log(`User ${userId} not found`);
      return;
    }

    const [alert] = await db
      .select()
      .from(jobAlertsTable)
      .where(and(eq(jobAlertsTable.id, alertId), eq(jobAlertsTable.userId, userId)));

    if (!alert) {
      console.log(`Alert ${alertId} not found for user ${userId}`);
      return;
    }

    // Build query based on filters
    let matchingJobs: any[] = [];

    if (alert.filters) {
      const conditions: any[] = [];

      if (alert.filters.categories && alert.filters.categories.length > 0) {
        conditions.push(inArray(jobsTable.category, alert.filters.categories));
      }

      if (alert.filters.locations && alert.filters.locations.length > 0) {
        const locationConditions = alert.filters.locations.map((loc: string) =>
          ilike(jobsTable.location, `%${loc}%`)
        );
        conditions.push(or(...locationConditions));
      }

      if (alert.filters.keywords && alert.filters.keywords.length > 0) {
        const keywordConditions = alert.filters.keywords.map((keyword: string) =>
          or(
            ilike(jobsTable.title, `%${keyword}%`),
            ilike(jobsTable.description, `%${keyword}%`)
          )
        );
        conditions.push(or(...keywordConditions));
      }

      // Apply conditions if any exist
      matchingJobs = conditions.length > 0
        ? await db
            .select()
            .from(jobsTable)
            .where(and(...conditions))
            .limit(20)
        : [];
    }

    if (matchingJobs.length === 0) {
      console.log(`No matching jobs for alert ${alertId}`);
      return;
    }

    // Generate job items HTML
    let jobsListHtml = "";
    matchingJobs.forEach((job) => {
      jobsListHtml += `
        <div style="margin-bottom: 20px; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937;">
            <a href="${process.env.FRONTEND_URL}/jobs/${job.id}" style="color: #10b981; text-decoration: none; font-weight: bold;">
              ${job.title}
            </a>
          </h3>
          <p style="margin: 0 0 10px 0; color: #666; font-weight: 500;">${job.company}</p>
          <div style="margin-bottom: 10px; font-size: 14px; color: #666;">
            <div><strong>📍 Location:</strong> ${job.location}</div>
            <div><strong>💼 Category:</strong> ${job.category}</div>
            <div><strong>💰 Salary:</strong> ${job.salary}</div>
            <div><strong>🏢 Openings:</strong> ${job.openings}</div>
          </div>
          <p style="margin: 10px 0; color: #555; line-height: 1.5;">${job.description.substring(0, 200)}...</p>
          <a href="${process.env.FRONTEND_URL}/jobs/${job.id}/apply" style="display: inline-block; background-color: #10b981; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px;">
            View & Apply
          </a>
        </div>
      `;
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; text-align: center; }
            .alert-title { background: #ecfdf5; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #10b981; }
            .unsubscribe { margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Your Job Alert: ${alert.name}</h1>
              <p>We found ${matchingJobs.length} new opportunities matching your criteria</p>
            </div>

            <div class="content">
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>Here are the latest job opportunities matching your alert preferences:</p>

              <div class="alert-title">
                <strong>Alert Name:</strong> ${alert.name}<br/>
                <strong>Frequency:</strong> ${alert.frequency === 'daily' ? 'Daily' : 'Weekly'}<br/>
                <strong>Matching Jobs:</strong> ${matchingJobs.length}
              </div>

              ${jobsListHtml}

              <div style="margin-top: 30px; padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 0; color: #065f46;">
                  <strong>💡 Pro Tip:</strong> Apply early to increase your chances of getting selected. Employers often review applications in the order they receive them.
                </p>
              </div>

              <p style="margin-top: 20px; text-align: center;">
                <a href="${process.env.FRONTEND_URL}/job-alerts" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                  Manage Your Alerts
                </a>
              </p>
            </div>

            <div class="footer">
              <p>© 2026 OpportuNet. All rights reserved.</p>
              <p>You're receiving this email because you have an active job alert. <a href="${process.env.FRONTEND_URL}/job-alerts/${alertId}" style="color: #10b981; text-decoration: none;">Modify your alert preferences</a> or <a href="${process.env.FRONTEND_URL}/job-alerts/${alertId}/unsubscribe" style="color: #ef4444; text-decoration: none;">unsubscribe</a>.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "OpportuNet <noreply@opportunet.com>",
        to: user.email,
        subject: `🎯 ${alert.name} - ${matchingJobs.length} New Job Opportunities`,
        html,
      });

      // Log the sent email
      await db.insert(alertEmailsSentTable).values({
        alertId: alert.id,
        userId: user.id,
        recipientEmail: user.email,
        jobCount: matchingJobs.length,
        status: "sent",
      });

      // Update lastSentAt timestamp
      await db
        .update(jobAlertsTable)
        .set({ lastSentAt: new Date() })
        .where(eq(jobAlertsTable.id, alertId));

      console.log(`Job alert digest sent to ${user.email} for alert ${alert.name}`);
    } else {
      console.log(
        `[SIMULATED EMAIL] Job alert digest would be sent to ${user.email} with ${matchingJobs.length} jobs`
      );
    }
  } catch (error) {
    console.error(`Failed to send job alert digest for alert ${alertId}:`, error);

    try {
      // Log failed email
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
      if (user) {
        await db.insert(alertEmailsSentTable).values({
          alertId,
          userId,
          recipientEmail: user.email,
          jobCount: 0,
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } catch (logError) {
      console.error("Failed to log alert email error:", logError);
    }
  }
}

/**
 * Send daily/weekly digests for all active alerts
 * @param frequency - "daily" or "weekly"
 */
export async function sendAllJobAlertDigests(frequency: "daily" | "weekly") {
  try {
    // Get all active alerts with matching frequency
    const alerts = await db
      .select()
      .from(jobAlertsTable)
      .where(
        and(eq(jobAlertsTable.isActive, true), eq(jobAlertsTable.frequency, frequency))
      );

    console.log(`Sending ${frequency} job alert digests to ${alerts.length} users...`);

    for (const alert of alerts) {
      await sendJobAlertDigestEmail(alert.userId, alert.id);
    }

    console.log(`${frequency.charAt(0).toUpperCase() + frequency.slice(1)} job alert digests sent successfully`);
  } catch (error) {
    console.error(`Failed to send ${frequency} job alert digests:`, error);
  }
}
