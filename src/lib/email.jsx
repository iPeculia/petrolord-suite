import { supabase } from '@/lib/customSupabaseClient';

    const SUPER_ADMIN_BCC = ['info@petrolord.com', 'ayoasaolu@gmail.com', 'ayodejiasaolu1@gmail.com'];

    async function getBase64FromBlob(blob) {
        const reader = new FileReader();
        const promise = new Promise((resolve, reject) => {
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data.split(',')[1]);
            };
            reader.onerror = reject;
        });
        reader.readAsDataURL(blob);
        return promise;
    }

    const sendEmail = async (payload) => {
        const finalPayload = {
          ...payload,
          from: 'Lordsway Quotes <quotes@lordswayenergy.com>', // Branding update
          reply_to: 'sales@lordswayenergy.com', // Branding update
          bcc: Array.from(new Set([...(payload.bcc || []), ...SUPER_ADMIN_BCC])),
        };

        // Assuming 'send-email' function handles the actual SMTP/Provider logic
        const { data, error } = await supabase.functions.invoke('send-email', {
            body: JSON.stringify(finalPayload),
        });

        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent successfully:", data);
        }
        return { data, error };
    }

    export const sendQuoteEmail = async ({ to, quoteId, totalAmount, pdfUrl, pdfBlob, filename }) => {
      if (!to) {
        console.warn("No 'to' address provided for quote email. Skipping sending.");
        return { data: { message: "Email not sent, no recipient." }, error: null };
      }

      const attachmentContent = await getBase64FromBlob(pdfBlob);

      // Updated HTML template with Lordsway Branding
      const emailPayload = {
        to,
        subject: `Lordsway Energy Quote #${quoteId}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="border-bottom: 3px solid #4CAF50; padding-bottom: 10px; margin-bottom: 20px;">
               <h2 style="color: #4CAF50; margin: 0;">Lordsway Energy</h2>
            </div>
            <p>Dear Client,</p>
            <p>Thank you for your interest in our services. Please find the attached quote for your review.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #FFC107; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Quote ID:</strong> ${quoteId}</p>
                <p style="margin: 5px 0;"><strong>Total Amount Due:</strong> $${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
            <p>The detailed quote PDF is attached to this email. You can also download it directly via the link below:</p>
            <p><a href="${pdfUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Download Quote</a></p>
            <br/>
            <p>If you have any questions, please reply to this email.</p>
            <br/>
            <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666;">
                <p><strong>Lordsway Energy</strong><br/>
                Plot 8, The Providence Street, Lekki Phase 1, Lagos, Nigeria<br/>
                <a href="https://www.lordswayenergy.com" style="color: #4CAF50;">www.lordswayenergy.com</a></p>
                <p style="font-style: italic;">Powered by Petrolord Suite</p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: filename,
            content: attachmentContent,
            contentType: 'application/pdf',
          },
        ],
      };

      return sendEmail(emailPayload);
    };


    export const sendInvoiceEmail = async ({ to, invoice, org, pdfUrl, pdfBlob, filename }) => {
        if (!to) {
            console.warn("No 'to' address provided for invoice email. Skipping sending.");
            return { data: { message: "Email not sent, no recipient." }, error: null };
        }

        const attachmentContent = await getBase64FromBlob(pdfBlob);

        const emailPayload = {
            to,
            subject: `Invoice ${invoice.id} from Lordsway Energy`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="border-bottom: 3px solid #4CAF50; padding-bottom: 10px; margin-bottom: 20px;">
                        <h2 style="color: #4CAF50; margin: 0;">Lordsway Energy</h2>
                    </div>
                    <p>Dear ${org.name},</p>
                    <p>Please find attached your invoice for your subscription.</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #FFC107; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Amount Due:</strong> $${invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>
                    </div>
                    <p>
                        <strong>Bank Details for Payment:</strong><br/>
                        Company: Lordsway Energy Tech Ltd<br/>
                        Bank: Providus Bank<br/>
                        Account Number: 1305745085<br/>
                        Reference: Please include Invoice No ${invoice.id}
                    </p>
                    <br/>
                    <p>The invoice PDF is attached.</p>
                    <br/>
                    <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666;">
                        <p><strong>Lordsway Energy</strong><br/>
                        Plot 8, The Providence Street, Lekki Phase 1, Lagos, Nigeria</p>
                    </div>
                </div>
            `,
            attachments: [{ filename, content: attachmentContent, contentType: 'application/pdf' }],
        };

        return sendEmail(emailPayload);
    }

    export const sendLicenseActivationEmail = async ({ to, orgName, subscription }) => {
        if (!to) return;
        const adminUrl = `${window.location.origin}/admin/organizations`;

        const emailPayload = {
            to,
            subject: `Your License is Active - Lordsway Energy`,
            html: `
                <p>Dear ${orgName},</p>
                <p>Your payment has been confirmed and your license is now active.</p>
                <p><strong>Subscription Details:</strong></p>
                <ul>
                    <li><strong>Modules:</strong> ${subscription.quote_details.modules.join(', ')}</li>
                    <li><strong>User Limit:</strong> ${subscription.user_limit}</li>
                    <li><strong>Term Start:</strong> ${new Date(subscription.start_date).toLocaleDateString()}</li>
                    <li><strong>Term End:</strong> ${new Date(subscription.end_date).toLocaleDateString()}</li>
                </ul>
                <p>Your subscription administrator can now <a href="${adminUrl}">manage users</a> and assign module access.</p>
                <br/>
                <p>Thank you for choosing Lordsway Energy,</p>
                <p>The Team</p>
            `,
        };

        return sendEmail(emailPayload);
    };

    export const sendRenewalReminderEmail = async ({ to, orgName, invoice, daysUntilDue }) => {
        if (!to) return;

        const emailPayload = {
            to,
            subject: `Upcoming Renewal for Your Lordsway Energy Subscription`,
            html: `
                <p>Dear ${orgName},</p>
                <p>This is a friendly reminder that your subscription is due for renewal in ${daysUntilDue} days.</p>
                <p>To ensure uninterrupted service, please make a payment for Invoice <a href="${invoice.pdf_url}">${invoice.id}</a>.</p>
                <br/>
                <p>Thank you,</p>
                <p>Lordsway Energy Team</p>
            `,
        };

        return sendEmail(emailPayload);
    };

    export const sendLicenseExpiredEmail = async ({ to, orgName }) => {
        if (!to) return;

        const emailPayload = {
            to,
            subject: `Your Subscription Has Expired - Lordsway Energy`,
            html: `
                <p>Dear ${orgName},</p>
                <p>Your subscription has expired, and access to the modules has been temporarily paused.</p>
                <p>To continue using our services, please contact our sales team to renew your subscription.</p>
                <br/>
                <p><strong>Contact:</strong><br/>
                   Email: sales@lordswayenergy.com</p>
                <br/>
                <p>Regards,</p>
                <p>Lordsway Energy Team</p>
            `,
        };

        return sendEmail(emailPayload);
    };