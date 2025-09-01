import { marked } from 'marked';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// Create a DOM purifier instance for server-side use
const window = new JSDOM('').window;
const purify = DOMPurify(window as unknown as Window & typeof globalThis);

// Configure marked options for better PDF output
const markedOptions = {
  breaks: true,
  gfm: true,
};

export async function generatePDFFromText(
  text: string, 
  title: string = 'Report', 
  format: 'markdown' | 'plain' | 'auto' = 'auto'
): Promise<Buffer> {
  // Determine if we should treat the text as markdown
  let isMarkdown: boolean;
  
  switch (format) {
    case 'markdown':
      isMarkdown = true;
      break;
    case 'plain':
      isMarkdown = false;
      break;
    case 'auto':
    default:
      isMarkdown = containsMarkdownSyntax(text);
      break;
  }
  
  let htmlContent: string;
  
  if (isMarkdown) {
    // Convert markdown to HTML
    const rawHtml = await marked.parse(text, markedOptions);
    const sanitizedHtml = purify.sanitize(rawHtml);
    htmlContent = createMarkdownPDFTemplate(sanitizedHtml, title);
  } else {
    // Treat as plain text
    htmlContent = createPlainTextPDFTemplate(text, title);
  }

  // Generate PDF using the preferred method
  try {
    // Try to use puppeteer first
    try {
      const puppeteer = await import('puppeteer');
      console.log('Using Puppeteer for PDF generation');
      const browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '20mm',
          right: '20mm'
        }
      });
      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (puppeteerError) {
      console.warn('Puppeteer not available, falling back to simple text PDF:', puppeteerError);
      // Fallback: Create a simple text-based PDF using basic PDF structure
      return createSimplePDF(isMarkdown ? convertHtmlToText(htmlContent) : text, title);
    }
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
}

function containsMarkdownSyntax(text: string): boolean {
  // Check for common markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/m,           // Headers
    /\*\*.*?\*\*/,          // Bold
    /\*.*?\*/,              // Italic
    /`.*?`/,                // Inline code
    /```[\s\S]*?```/,       // Code blocks
    /^\s*[-*+]\s/m,         // Lists
    /^\s*\d+\.\s/m,         // Numbered lists
    /\[.*?\]\(.*?\)/,       // Links
    /!\[.*?\]\(.*?\)/,      // Images
    /^\s*>/m,               // Blockquotes
    /\|.*\|/,               // Tables
    /^---+$/m,              // Horizontal rules
  ];
  
  return markdownPatterns.some(pattern => pattern.test(text));
}

function createMarkdownPDFTemplate(htmlContent: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 40px;
                color: #333;
                background-color: #fff;
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 25px;
                margin-bottom: 40px;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                padding: 30px;
                border-radius: 10px;
                margin: -20px -20px 40px -20px;
            }
            .header h1 {
                margin: 0;
                color: #1e293b;
                font-size: 2.5em;
                font-weight: 700;
            }
            .header p {
                margin: 15px 0 0 0;
                color: #64748b;
                font-size: 1.1em;
            }
            .content {
                max-width: none;
            }
            
            /* Markdown styling */
            h1, h2, h3, h4, h5, h6 {
                color: #1e293b;
                margin-top: 2em;
                margin-bottom: 1em;
                font-weight: 600;
            }
            h1 { font-size: 2.25em; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3em; }
            h2 { font-size: 1.875em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
            h3 { font-size: 1.5em; }
            h4 { font-size: 1.25em; }
            h5 { font-size: 1.125em; }
            h6 { font-size: 1em; }
            
            p {
                margin: 1em 0;
                text-align: justify;
            }
            
            ul, ol {
                margin: 1em 0;
                padding-left: 2em;
            }
            
            li {
                margin: 0.5em 0;
            }
            
            blockquote {
                border-left: 4px solid #3b82f6;
                margin: 1.5em 0;
                padding: 1em 1.5em;
                background-color: #f8fafc;
                border-radius: 0 8px 8px 0;
                font-style: italic;
            }
            
            code {
                background-color: #f1f5f9;
                padding: 0.2em 0.4em;
                border-radius: 3px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 0.9em;
                border: 1px solid #e2e8f0;
            }
            
            pre {
                background-color: #1e293b;
                color: #f1f5f9;
                padding: 1.5em;
                border-radius: 8px;
                overflow-x: auto;
                margin: 1.5em 0;
                border: 1px solid #334155;
            }
            
            pre code {
                background: none;
                padding: 0;
                border: none;
                color: inherit;
            }
            
            table {
                border-collapse: collapse;
                width: 100%;
                margin: 1.5em 0;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                overflow: hidden;
            }
            
            th, td {
                border: 1px solid #e2e8f0;
                padding: 12px;
                text-align: left;
            }
            
            th {
                background-color: #f8fafc;
                font-weight: 600;
                color: #374151;
            }
            
            tr:nth-child(even) {
                background-color: #f9fafb;
            }
            
            strong, b {
                font-weight: 600;
                color: #1e293b;
            }
            
            em, i {
                font-style: italic;
                color: #4b5563;
            }
            
            hr {
                border: none;
                border-top: 2px solid #e2e8f0;
                margin: 2em 0;
            }
            
            .footer {
                margin-top: 60px;
                text-align: center;
                font-size: 0.9em;
                color: #64748b;
                border-top: 2px solid #e2e8f0;
                padding-top: 25px;
                background-color: #f8fafc;
                padding: 25px;
                border-radius: 8px;
                margin-left: -20px;
                margin-right: -20px;
            }
            
            /* Print optimizations */
            @media print {
                body { margin: 0; }
                .header, .footer { break-inside: avoid; }
                h1, h2, h3, h4, h5, h6 { break-after: avoid; }
                pre, blockquote, table { break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${title}</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
        </div>
        <div class="content">
            ${htmlContent}
        </div>
        <div class="footer">
            <p><strong>This report was automatically generated by the Audit System</strong></p>
            <p>For questions or clarifications, please contact your audit team</p>
        </div>
    </body>
    </html>
  `;
}

function createPlainTextPDFTemplate(text: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 40px;
                color: #333;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .content {
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .footer {
                margin-top: 50px;
                text-align: center;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>${title}</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="content">
            ${text.replace(/\n/g, '<br>')}
        </div>
        <div class="footer">
            <p>This report was automatically generated by the Audit System</p>
        </div>
    </body>
    </html>
  `;
}

function convertHtmlToText(html: string): string {
  // Simple HTML to text conversion for fallback
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function createSimplePDF(text: string, title: string): Buffer {
  console.log('Creating simple PDF fallback for:', { title, textLength: text.length });
  
  // Clean and prepare text
  const cleanText = text.replace(/[()\\]/g, '\\$&').substring(0, 2000); // Limit text length
  const cleanTitle = title.replace(/[()\\]/g, '\\$&').substring(0, 100);
  
  // Simple PDF structure
  const lines = cleanText.split('\n').slice(0, 50); // Limit to 50 lines
  
  let contentStream = `BT
/F1 16 Tf
50 750 Td
(${cleanTitle}) Tj
0 -30 Td
/F1 12 Tf`;

  lines.forEach((line) => {
    contentStream += `\n0 -15 Td\n(${line.substring(0, 80)}) Tj`;
  });

  contentStream += `\nET`;
  
  const contentLength = contentStream.length;
  
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length ${contentLength}
>>
stream
${contentStream}
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
0000000${contentLength + 400} 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${contentLength + 500}
%%EOF`;

  return Buffer.from(pdfContent, 'utf-8');
}