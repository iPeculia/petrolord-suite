import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
    import { supabase } from '@/lib/customSupabaseClient';

    const PETROLORD_LOGO_URL = 'https://i.imgur.com/p1Q2i5g.png';
    const PETROLORD_GOLD = rgb(245 / 255, 184 / 255, 0 / 255);
    const BLACK = rgb(0, 0, 0);
    const WHITE = rgb(1, 1, 1);
    const GREY = rgb(0.3, 0.3, 0.3);
    const LIGHT_GREY = rgb(0.85, 0.85, 0.85);
    const TABLE_HEADER_BG = rgb(0.95, 0.95, 0.95);

    const COMPANY_ADDRESS = 'Lordsway Energy\n8, Providence Street, Lekki Phase 1, Lagos, NG.';
    const COMPANY_TIN = 'TIN: 1078983598';
    const VAT_RATE = 0.075;

    async function embedAssets(pdfDoc) {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const logoBytes = await fetch(PETROLORD_LOGO_URL).then(res => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoBytes);
      return { font, boldFont, logoImage };
    }

    function drawFooter(page, font) {
      const { width } = page.getSize();
      const footerText = 'Petrolord Suite by Lordsway Energy • www.lordswayenergy.com';
      const footerTextWidth = font.widthOfTextAtSize(footerText, 8);
      page.drawText(footerText, {
        x: (width - footerTextWidth) / 2,
        y: 30,
        font,
        size: 8,
        color: GREY,
      });
    }

    function drawWrappedText(page, text, { x, y, font, size, color, maxWidth, lineHeight }) {
        if (!text) return y;
        const lines = text.split('\n');
        let currentY = y;
        
        lines.forEach(line => {
            const words = line.split(' ');
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;
                const testWidth = font.widthOfTextAtSize(testLine, size);

                if (testWidth > maxWidth && currentLine.length > 0) {
                    page.drawText(currentLine, { x, y: currentY, font, size, color });
                    currentLine = word;
                    currentY -= lineHeight;
                } else {
                    currentLine = testLine;
                }
            }
            page.drawText(currentLine, { x, y: currentY, font, size, color });
            currentY -= lineHeight;
        });

        return currentY + lineHeight - (lines.length * lineHeight);
    }

    const drawRow = (page, y, columns, fonts, colWidths, tableX, rowHeight = 20) => {
        let lineY = y;
        let maxLineHeight = 0;

        columns.forEach((col, i) => {
            if (col.text) {
                const lines = col.text.toString().split('\n');
                let textY = lineY - (rowHeight - col.font.heightAtSize(col.size)) / 2 - 4;
                lines.forEach((line, lineIndex) => {
                    page.drawText(line, {
                        x: tableX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + (col.align === 'right' ? colWidths[i] - fonts.font.widthOfTextAtSize(line, col.size) - 5 : 5),
                        y: textY - (lineIndex * (col.size + 2)),
                        font: col.font,
                        size: col.size,
                        color: col.color,
                    });
                });
                maxLineHeight = Math.max(maxLineHeight, lines.length * (col.size + 2) + 8);
            }
        });

        const finalRowHeight = Math.max(rowHeight, maxLineHeight);
        page.drawLine({ start: { x: tableX, y: y - finalRowHeight }, end: { x: tableX + colWidths.reduce((a, b) => a + b, 0), y: y - finalRowHeight }, thickness: 0.5, color: LIGHT_GREY });
        return y - finalRowHeight;
    };

    async function ensureBucketExists(bucketName) {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        if (error) {
            throw new Error(`Could not list buckets: ${error.message}`);
        }

        const bucketExists = buckets.some(bucket => bucket.name === bucketName);
        if (!bucketExists) {
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true,
                allowedMimeTypes: ['application/pdf'],
            });
            if (createError) {
                throw new Error(`Could not create bucket '${bucketName}': ${createError.message}`);
            }
        }
    }

    export const renderQuotePDF = async (quote, org, bank, terms) => {
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage(PageSizes.A4);
      const { width, height } = page.getSize();
      const { font, boldFont, logoImage } = await embedAssets(pdfDoc);
      const margin = 50;
      let y = height - margin;

      const breakdown = quote.breakdown;
      const subtotal = breakdown.totals.after_discounts + breakdown.addons.reduce((sum, a) => sum + a.value, 0);
      const vat = breakdown.totals.vat;

      const logoDims = logoImage.scale(0.25);
      page.drawImage(logoImage, {
        x: margin,
        y: y - logoDims.height,
        width: logoDims.width,
        height: logoDims.height,
      });

      page.drawText('Quote', { x: width - margin - 150, y: y - 20, font: boldFont, size: 28, color: PETROLORD_GOLD });
      y -= 45;
      page.drawText(`# ${quote.id}`, { x: width - margin - 150, y: y, font, size: 10, color: GREY });
      y -= 15;
      page.drawText(`Date: ${new Date(quote.created_at).toLocaleDateString()}`, { x: width - margin - 150, y: y, font, size: 10, color: GREY });
      
      y = height - margin - logoDims.height - 20;

      page.drawText('Client:', { x: margin, y, font: boldFont, size: 10 });
      page.drawText(org.name, { x: margin + 90, y, font, size: 10, color: GREY });
      y -= 15;
      page.drawText('Contact Email:', { x: margin, y, font: boldFont, size: 10 });
      page.drawText(org.contact_email, { x: margin + 90, y, font, size: 10, color: GREY });
      y -= 30;

      const summaryChips = [
        { label: 'Plan Size', value: breakdown.size.charAt(0).toUpperCase() + breakdown.size.slice(1) },
        { label: 'Modules', value: breakdown.modules },
        { label: 'User Limit', value: breakdown.users },
        { label: 'Term', value: breakdown.term },
      ];

      let x = margin;
      summaryChips.forEach(chip => {
        const text = `${chip.label}: ${chip.value}`;
        const textWidth = boldFont.widthOfTextAtSize(text, 9);
        page.drawRectangle({ x, y: y - 2, width: textWidth + 20, height: 24, color: rgb(0.1, 0.1, 0.2), borderRadius: 12 });
        page.drawText(text, { x: x + 10, y: y + 6, font: boldFont, size: 9, color: WHITE });
        x += textWidth + 30;
      });
      y -= 40;

      const tableHeaders = ['Description', 'Amount'];
      const colWidths = [425, 90];
      const tableX = margin;
      const tableWidth = colWidths.reduce((a, b) => a + b, 0);

      let currentX = tableX;
      page.drawRectangle({ x: tableX, y: y - 5, width: tableWidth, height: 20, color: TABLE_HEADER_BG });
      tableHeaders.forEach((header, i) => {
        page.drawText(header, { x: currentX + 5, y: y, font: boldFont, size: 10 });
        currentX += colWidths[i];
      });
      y -= 25;
      page.drawLine({ start: { x: tableX, y: y + 20 }, end: { x: tableX + tableWidth, y: y + 20 }, thickness: 0.5, color: LIGHT_GREY });
      
      const termLabel = breakdown.term === 'triennial' ? '3-year' : '1-year';
      y = drawRow(page, y, [
        { text: `Petrolord Suite License (${breakdown.modules} modules, ${termLabel})`, font, size: 9, color: GREY },
        { text: `$${breakdown.totals.license_subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`, font, size: 9, color: GREY, align: 'right' },
      ], { font, boldFont }, colWidths, tableX);

      breakdown.discounts.forEach(d => {
        y = drawRow(page, y, [
          { text: d.label, font, size: 9, color: GREY },
          { text: `-$${Math.abs(d.value).toLocaleString(undefined, {minimumFractionDigits: 2})}`, font, size: 9, color: GREY, align: 'right' },
        ], { font, boldFont }, colWidths, tableX);
      });
      
      breakdown.addons.forEach(a => {
          y = drawRow(page, y, [
            { text: a.label, font, size: 9, color: GREY },
            { text: `$${a.value.toLocaleString(undefined, {minimumFractionDigits: 2})}`, font, size: 9, color: GREY, align: 'right' },
          ], { font, boldFont }, colWidths, tableX);
      });

      y -= 10;
      
      const totalsX = width - margin - 220;
      page.drawText('Subtotal', { x: totalsX, y, font, size: 10, color: GREY });
      page.drawText(`$${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`, { x: width - margin - 90, y, font, size: 10, color: GREY, align: 'right' });
      y -= 20;

      page.drawText(`VAT (${VAT_RATE * 100}%)`, { x: totalsX, y, font, size: 10, color: GREY });
      page.drawText(`$${vat.toLocaleString(undefined, {minimumFractionDigits: 2})}`, { x: width - margin - 90, y, font, size: 10, color: GREY, align: 'right' });
      y -= 15;

      page.drawLine({ start: { x: totalsX, y }, end: { x: width - margin, y }, thickness: 0.5, color: GREY });
      y -= 25;

      page.drawText('Total Amount Due', { x: totalsX, y, font: boldFont, size: 14 });
      page.drawText(`$${breakdown.totals.grand_total.toLocaleString(undefined, { minimumFractionDigits: 2})}`, { x: width - margin - 90, y, font: boldFont, size: 14, color: PETROLORD_GOLD, align: 'right' });
      y -= 20;
      
      const bankY = y > 250 ? y - 30 : height - margin - 40;
      if (bankY < y) y = bankY;

      page.drawText('Payment Details', { x: margin, y, font: boldFont, size: 11 });
      y -= 15;
      y = drawWrappedText(page, `${bank.account_name} at ${bank.bank_name}`, { x: margin, y, font, size: 9, color: GREY, maxWidth: 220, lineHeight: 12 });
      y -= 12;
      y = drawWrappedText(page, `Account: ${bank.account_number} (${bank.currency})`, { x: margin, y, font, size: 9, color: GREY, maxWidth: 220, lineHeight: 12 });
      y -= 12;
      y = drawWrappedText(page, `SWIFT/BIC: ${bank.swift}`, { x: margin, y, font, size: 9, color: GREY, maxWidth: 220, lineHeight: 12 });
      y -= 12;
      y = drawWrappedText(page, `Note: ${bank.notes}`, { x: margin, y, font, size: 9, color: GREY, maxWidth: 220, lineHeight: 12 });
      
      y = bankY;
      page.drawText('Terms', { x: margin + 250, y, font: boldFont, size: 11 });
      y -= 15;
      y = drawWrappedText(page, `Payment: ${terms.payment}`, { x: margin + 250, y, font, size: 8, color: GREY, maxWidth: width - (margin*2) - 250, lineHeight: 11 });
      y -= 12;
      y = drawWrappedText(page, `Licensing: ${terms.licensing}`, { x: margin + 250, y, font, size: 8, color: GREY, maxWidth: width - (margin*2) - 250, lineHeight: 11 });
      
      drawFooter(page, font);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const filename = `quote-${quote.id}.pdf`;
      const bucket = 'billing-docs';
      
      await ensureBucketExists(bucket);

      const path = `${org.id || quote.organization_name}/quotes/${filename}`;

      const { error } = await supabase.storage.from(bucket).upload(path, blob, { cacheControl: '3600', upsert: true });
      if (error) throw new Error(`Failed to upload PDF: ${error.message}`);
      
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
      return { publicUrl: publicUrlData.publicUrl, filename, blob };
    };

    export const renderInvoicePDF = async (invoice, org, bank, terms, title = "Invoice") => {
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage(PageSizes.A4);
        const { width, height } = page.getSize();
        const { font, boldFont, logoImage } = await embedAssets(pdfDoc);
        const margin = 50;
        let y = height - margin;

        const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
        const vat = subtotal * VAT_RATE;

        const logoDims = logoImage.scale(0.25);
        page.drawImage(logoImage, {
            x: margin,
            y: y - logoDims.height,
            width: logoDims.width,
            height: logoDims.height,
        });

        y -= logoDims.height - 15;
        drawWrappedText(page, COMPANY_ADDRESS, { x: margin, y, font, size: 9, color: GREY, maxWidth: 200, lineHeight: 12 });
        y -= 24;
        page.drawText(COMPANY_TIN, { x: margin, y: y, font, size: 9, color: GREY });


        let headerX = width - margin - 200;
        let headerY = height - margin - 20;
        page.drawText(title, { x: headerX, y: headerY, font: boldFont, size: 28, color: PETROLORD_GOLD });
        headerY -= 25;
        page.drawText(`No: ${invoice.id}`, { x: headerX, y: headerY, font, size: 10, color: GREY });
        headerY -= 15;
        page.drawText(`Issued: ${new Date(invoice.issued_date).toLocaleDateString()}`, { x: headerX, y: headerY, font, size: 10, color: GREY });
        headerY -= 15;
        if(title === "Invoice") {
          page.drawText(`Due: ${new Date(invoice.due_date).toLocaleDateString()}`, { x: headerX, y: headerY, font, size: 10, color: GREY });
        } else {
          const { data: transaction } = await supabase.from('transactions').select('payment_date').eq('invoice_id', invoice.id).single();
          if(transaction) {
              page.drawText(`Paid: ${new Date(transaction.payment_date).toLocaleDateString()}`, { x: headerX, y: headerY, font, size: 10, color: GREY });
          }
        }
        
        y = height - margin - logoDims.height - 70;

        page.drawText('Bill To:', { x: margin, y, font: boldFont, size: 10 });
        y -= 15;
        page.drawText(org.name, { x: margin, y, font, size: 10, color: GREY });
        y -= 15;
        page.drawText(org.contact_email, { x: margin, y, font, size: 10, color: GREY });
        y -= 30;

        const tableHeaders = ['Description', 'Amount'];
        const colWidths = [425, 90];
        const tableX = margin;
        const tableWidth = colWidths.reduce((a, b) => a + b, 0);

        let currentX = tableX;
        page.drawRectangle({ x: tableX, y: y - 5, width: tableWidth, height: 20, color: TABLE_HEADER_BG });
        tableHeaders.forEach((header, i) => {
            page.drawText(header, { x: currentX + 5, y: y, font: boldFont, size: 10 });
            currentX += colWidths[i];
        });
        y -= 25;
        page.drawLine({ start: { x: tableX, y: y + 20 }, end: { x: tableX + tableWidth, y: y + 20 }, thickness: 0.5, color: LIGHT_GREY });

        (invoice.items || []).forEach(item => {
            y = drawRow(page, y, [
                { text: item.label, font, size: 9, color: GREY },
                { text: `$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2})}`, font, size: 9, color: GREY, align: 'right' },
            ], { font, boldFont }, colWidths, tableX);
        });

        y -= 10;
        
        const totalsX = width - margin - 220;
        page.drawText('Subtotal', { x: totalsX, y, font, size: 11, color: GREY });
        page.drawText(`$${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`, { x: width - margin - 90, y, font, size: 11, color: GREY, align: 'right' });
        y -= 20;
        page.drawText(`VAT (${VAT_RATE * 100}%)`, { x: totalsX, y, font, size: 11, color: GREY });
        page.drawText(`$${vat.toLocaleString(undefined, {minimumFractionDigits: 2})}`, { x: width - margin - 90, y, font, size: 11, color: GREY, align: 'right' });
        y -= 20;

        page.drawLine({ start: { x: totalsX, y }, end: { x: width - margin, y }, thickness: 0.5, color: GREY });
        y -= 25;

        const amountDueText = title === "Invoice" ? "Amount Due" : "Amount Paid";
        page.drawText(amountDueText, { x: totalsX, y, font: boldFont, size: 14 });
        page.drawText(`$${invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}`, { x: width - margin - 90, y, font: boldFont, size: 14, color: PETROLORD_GOLD, align: 'right' });
        y -= 40;

        if(title === "Invoice"){
            const bankY = y;
            page.drawText('Payment Details', { x: margin, y, font: boldFont, size: 11 });
            y -= 15;
            y = drawWrappedText(page, `${bank.account_name} at ${bank.bank_name}`, { x: margin, y, font, size: 9, color: GREY, maxWidth: 220, lineHeight: 12 });
            y -= 12;
            y = drawWrappedText(page, `Account: ${bank.account_number} (${bank.currency})`, { x: margin, y, font, size: 9, color: GREY, maxWidth: 220, lineHeight: 12 });
            y -= 12;
            y = drawWrappedText(page, `SWIFT/BIC: ${bank.swift}`, { x: margin, y, font, size: 9, color: GREY, maxWidth: 220, lineHeight: 12 });
            y -= 12;
            y = drawWrappedText(page, `Reference: ${bank.notes.replace('invoice number', `Invoice No ${invoice.id}`)}`, { x: margin, y, font, size: 9, color: GREY, maxWidth: 220, lineHeight: 12 });

            y = bankY;
            page.drawText('Terms', { x: margin + 250, y, font: boldFont, size: 11 });
            y -= 15;
            y = drawWrappedText(page, `Payment: ${terms.payment}`, { x: margin + 250, y, font, size: 8, color: GREY, maxWidth: width - (margin*2) - 250, lineHeight: 11 });
        } else {
            page.drawText('Thank you for your business!', { x: margin, y, font: boldFont, size: 11, color: PETROLORD_GOLD });
        }
        
        drawFooter(page, font);

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const filename = `${title.toLowerCase()}-${invoice.id}.pdf`;
        const bucket = 'billing-docs';
        
        await ensureBucketExists(bucket);

        const path = `${org.id}/${title === 'Invoice' ? 'invoices' : 'receipts'}/${filename}`;

        const { error } = await supabase.storage.from(bucket).upload(path, blob, { cacheControl: '3600', upsert: true });

        if (error) {
            throw new Error(`Failed to upload ${title} PDF: ${error.message}`);
        }

        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

        return { publicUrl: publicUrlData.publicUrl, filename, blob };
    };