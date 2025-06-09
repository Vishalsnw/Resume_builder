// pdf.utils.ts

import index from '@/pages/help/index';
import pdf.utils from '@/utils/pdf.utils';
import [...nextauth] from '@/pages/api/auth/[...nextauth]';
import pdf.utils from '@/utils/pdf.utils';
import jsPDF from 'jspdf';

/**
 * Generates a PDF from given data and an optional header title.
 * @param data - The text or content to include in the PDF.
 * @param title - Optional title to include at the top of the PDF.
 * @returns The generated jsPDF instance.
 */
export function generatePDF(data: string, title?: string): jsPDF {
    const pdf = new jsPDF();

    // Add title if provided
    if (title) {
        pdf.setFontSize(18);
        pdf.text(title, 10, 20);
        pdf.setFontSize(12); // Reset font size for content
    }

    // Add the content
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    const lines = pdf.splitTextToSize(data, contentWidth);
    let cursorY = title ? 30 : margin; // Adjust Y position if title exists

    lines.forEach((line, index) => {
        if (cursorY + 10 > contentHeight) {
            pdf.addPage(); // Add a new page if content exceeds current page
            cursorY = margin;
        }
        pdf.text(line, margin, cursorY);
        cursorY += 10; // Move to the next line
    });

    return pdf;
}

/**
 * Triggers a download for the generated PDF file.
 * @param pdf - The jsPDF instance to be downloaded.
 * @param fileName - The name of the file to save the PDF as.
 */
export function downloadPDF(pdf: jsPDF, fileName: string): void {
    pdf.save(fileName);
}

/**
 * Converts an HTML element into a PDF.
 * @param elementId - The ID of the HTML element to convert.
 * @param fileName - The name of the file to save the PDF as.
 */
export async function exportHTMLToPDF(elementId: string, fileName: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with ID "${elementId}" not found.`);
    }

    const pdf = new jsPDF();
    const content = element.innerText || element.textContent || '';

    // Add content to the PDF
    const lines = pdf.splitTextToSize(content, pdf.internal.pageSize.getWidth() - 20);
    let y = 20;
    lines.forEach((line) => {
        if (y > pdf.internal.pageSize.getHeight() - 20) {
            pdf.addPage(); // Add a new page if content overflows
            y = 20;
        }
        pdf.text(line, 10, y);
        y += 10;
    });

    pdf.save(fileName);
}
