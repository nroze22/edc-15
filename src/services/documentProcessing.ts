import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  
  try {
    if (fileType === 'application/pdf') {
      return await extractTextFromPDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               fileType === 'application/msword') {
      return await extractTextFromWord(file);
    } else {
      // For plain text files
      return await file.text();
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from document');
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const numPages = pdfDoc.getPageCount();
  let text = '';

  for (let i = 0; i < numPages; i++) {
    const page = pdfDoc.getPage(i);
    const textContent = await page.doc.getText();
    text += textContent + '\n\n';
  }

  return text.trim();
}

async function extractTextFromWord(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

export function preprocessText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Normalize newlines
    .replace(/\n+/g, '\n')
    // Remove control characters
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    // Normalize quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Remove duplicate punctuation
    .replace(/([.!?])\1+/g, '$1')
    // Ensure proper spacing after punctuation
    .replace(/([.!?])(\w)/g, '$1 $2')
    // Remove multiple spaces between words
    .replace(/\s{2,}/g, ' ')
    // Final trim
    .trim();
}