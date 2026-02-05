import { PDFDocument, rgb } from 'pdf-lib';

export async function createDummyPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  
  page.drawText('Petrolord Brochure', {
    x: 50,
    y: height - 100,
    size: 50,
    color: rgb(0.1, 0.5, 0.8),
  });

  page.drawText('Placeholder Content - The official brochure is coming soon!', {
    x: 50,
    y: height / 2,
    size: 20,
    color: rgb(0.2, 0.2, 0.2),
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}