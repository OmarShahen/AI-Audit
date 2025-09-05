// Word document generation service using docx
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TableRow,
  TableCell,
  Table,
  WidthType,
  ShadingType,
  Tab,
  TabStopPosition,
  TabStopType,
  PageBreak,
} from "docx";

export interface WordDocOptions {
  title: string;
  content: string;
  format?: "markdown" | "plain";
}

export async function generateWordFromText(
  text: string,
  title: string,
  format: "markdown" | "plain" = "markdown"
): Promise<Buffer> {
  try {
    const doc = new Document({
      creator: "Revi Audit System",
      title: title,
      description: "AI & Automation Readiness Audit Report",
      styles: {
        default: {
          document: {
            run: {
              font: "Poppins",
              size: 22, // 11pt - better readability
              color: "2c3e50",
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15 line spacing
                after: 120,
              },
            },
          },
        },
        paragraphStyles: [
          {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Poppins",
              size: 36, // 18pt
              bold: true,
              color: "1a365d",
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 0,
                after: 480,
              },
            },
          },
          {
            id: "Subtitle",
            name: "Subtitle",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Poppins",
              size: 24, // 12pt
              color: "4a5568",
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 0,
                after: 360,
              },
            },
          },
          {
            id: "heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Poppins",
              size: 32, // 16pt
              bold: true,
              color: "2d3748",
            },
            paragraph: {
              spacing: {
                before: 480,
                after: 240,
              },
              border: {
                bottom: {
                  color: "e2e8f0",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
            },
          },
          {
            id: "heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Poppins",
              size: 28, // 14pt
              bold: true,
              color: "4a5568",
            },
            paragraph: {
              spacing: {
                before: 360,
                after: 180,
              },
            },
          },
          {
            id: "heading3",
            name: "Heading 3",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Poppins",
              size: 26, // 13pt
              bold: true,
              color: "718096",
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          },
          {
            id: "ListParagraph",
            name: "List Paragraph",
            basedOn: "Normal",
            run: {
              font: "Poppins",
              size: 22,
              color: "2c3e50",
            },
            paragraph: {
              indent: {
                left: 720, // 0.5 inch
              },
              spacing: {
                after: 120,
              },
            },
          },
          {
            id: "Quote",
            name: "Quote",
            basedOn: "Normal",
            run: {
              font: "Poppins",
              size: 22,
              italics: true,
              color: "4a5568",
            },
            paragraph: {
              indent: {
                left: 720,
                right: 720,
              },
              spacing: {
                before: 240,
                after: 240,
              },
              shading: {
                type: ShadingType.SOLID,
                color: "f7fafc",
              },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: parseContentToDocx(text, format, title),
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return Buffer.from(buffer);
  } catch (error) {
    console.error("Error generating Word document:", error);
    throw new Error("Failed to generate Word document");
  }
}

function parseContentToDocx(
  content: string,
  format: "markdown" | "plain",
  title: string
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  if (format === "markdown") {
    // Clean and preprocess the content
    const cleanContent = preprocessMarkdown(content);
    const lines = cleanContent.split("\n");

    // Add document title if it contains "Report"
    if (title.toLowerCase().includes("report")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              font: "Poppins",
              size: 36,
              bold: true,
              color: "1a365d",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 480 },
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Generated on ${new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`,
              font: "Poppins",
              size: 24,
              color: "4a5568",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        })
      );
    }

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (!line) {
        // Add minimal spacing for empty lines
        paragraphs.push(
          new Paragraph({
            children: [new TextRun("")],
            spacing: { after: 120 },
          })
        );
        continue;
      }

      // Skip the title if we already added it
      if (
        line === title ||
        line.includes("Prepared for:") ||
        line.includes("Date:")
      ) {
        continue;
      }

      // Fix any remaining colon spacing issues
      line = line.replace(/([^:\s]):([^\s:])/g, "$1: $2");

      // Parse different markdown elements
      if (line.match(/^#{1}\s/)) {
        // H1 - Main sections
        const text = line.substring(2).trim();
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: text,
                font: "Poppins",
                size: 32,
                bold: true,
                color: "2d3748",
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 480, after: 240 },
            border: {
              bottom: {
                color: "e2e8f0",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          })
        );
      } else if (line.match(/^#{2}\s/)) {
        // H2 - Subsections
        const text = line.substring(3).trim();
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: text,
                font: "Poppins",
                size: 28,
                bold: true,
                color: "4a5568",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 360, after: 180 },
          })
        );
      } else if (line.match(/^#{3}\s/)) {
        // H3 - Sub-subsections
        const text = line.substring(4).trim();
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: text,
                font: "Poppins",
                size: 26,
                bold: true,
                color: "718096",
              }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        // Bullet points
        const text = line.substring(2).trim();
        const children = parseInlineFormatting(text);
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: "• ", color: "4a5568" }),
              ...children,
            ],
            indent: { left: 720 },
            spacing: { after: 120 },
          })
        );
      } else if (line.startsWith("✓ ")) {
        // Checkmark bullets (for "What's Possible" sections)
        const text = line.substring(2).trim();
        const children = parseInlineFormatting(text);
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: "✓ ", color: "38a169", bold: true }),
              ...children,
            ],
            indent: { left: 720 },
            spacing: { after: 120 },
          })
        );
      } else if (line.match(/^\d+\.\s/)) {
        // Numbered lists
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          const children = parseInlineFormatting(match[2]);
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${match[1]}. `,
                  bold: true,
                  color: "4a5568",
                }),
                ...children,
              ],
              indent: { left: 720 },
              spacing: { after: 120 },
            })
          );
        }
      } else if (
        line.includes("Business Readiness Score:") ||
        line.includes("ROI Potential:") ||
        line.includes("Estimated Annual Efficiency Gains:")
      ) {
        // Key metrics - make them stand out with background shading only
        const children = parseInlineFormatting(line);
        paragraphs.push(
          new Paragraph({
            children,
            spacing: { after: 120 },
            shading: {
              type: ShadingType.SOLID,
              color: "f8f9fa",
            },
            indent: { left: 360, right: 360 },
          })
        );
      } else {
        // Regular paragraphs with inline formatting
        const children = parseInlineFormatting(line);
        if (children.length > 0) {
          paragraphs.push(
            new Paragraph({
              children,
              spacing: { after: 120 },
              alignment: AlignmentType.LEFT,
            })
          );
        }
      }
    }
  } else {
    // Plain text format
    const lines = content.split("\n");
    for (const line of lines) {
      if (line.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                font: "Poppins",
                size: 22,
              }),
            ],
            spacing: { after: 120 },
          })
        );
      }
    }
  }

  return paragraphs;
}

function preprocessMarkdown(content: string): string {
  // Remove or convert problematic markdown
  let cleaned = content
    // Remove === dividers
    .replace(/^={3,}.*$/gm, "")
    // Clean up bold markdown that might be broken
    .replace(/\*\*([^*]+)\*\*/g, "**$1**")
    // Remove extra asterisks that aren't part of formatting
    .replace(/\*{3,}/g, "")
    // Fix spacing around colons globally
    .replace(/([^:\s\n]):([^\s\n:])/g, "$1: $2")
    // Clean up line breaks
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    // Remove leading/trailing whitespace from lines
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  return cleaned;
}

function parseInlineFormatting(text: string): TextRun[] {
  const runs: TextRun[] = [];

  // Handle special formatting patterns first
  if (text.includes("→")) {
    // Arrow formatting (often used in lists)
    const parts = text.split("→");
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        runs.push(
          new TextRun({
            text: " → ",
            color: "38a169",
            bold: true,
          })
        );
      }
      if (parts[i].trim()) {
        runs.push(...parseBasicFormatting(parts[i].trim()));
      }
    }
    return runs;
  }

  return parseBasicFormatting(text);
}

function parseBasicFormatting(text: string): TextRun[] {
  const runs: TextRun[] = [];

  // More robust regex for markdown parsing
  const parts = text.split(
    /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\[[^\]]+\])/
  );

  for (const part of parts) {
    if (!part) continue;

    if (part.match(/^\*\*[^*\n]+\*\*$/)) {
      // Bold text - remove the asterisks
      const cleanText = part.slice(2, -2);
      runs.push(
        new TextRun({
          text: cleanText,
          font: "Poppins",
          size: 22,
          bold: true,
          color: "2d3748",
        })
      );
    } else if (part.match(/^\*[^*\n]+\*$/) && !part.includes("**")) {
      // Italic text - single asterisks
      const cleanText = part.slice(1, -1);
      runs.push(
        new TextRun({
          text: cleanText,
          font: "Poppins",
          size: 22,
          italics: true,
          color: "4a5568",
        })
      );
    } else if (part.match(/^`[^`\n]+`$/)) {
      // Code text
      const cleanText = part.slice(1, -1);
      runs.push(
        new TextRun({
          text: cleanText,
          font: "Consolas",
          size: 20,
          color: "d53f8c",
          shading: {
            type: ShadingType.SOLID,
            color: "fdf2f8",
          },
        })
      );
    } else if (part.match(/^\[[^\]]+\]$/)) {
      // Placeholder text like [Business Name]
      runs.push(
        new TextRun({
          text: part,
          font: "Poppins",
          size: 22,
          italics: true,
          color: "805ad5",
        })
      );
    } else if (part.trim()) {
      // Regular text - clean up any remaining asterisks and fix spacing around colons
      let cleanText = part
        // Remove standalone asterisks that aren't part of markdown
        .replace(/\*+$/, "")
        .replace(/^\*+/, "")
        // Fix spacing around colons - add space after colon if missing
        .replace(/([^:\s]):([^\s])/g, "$1: $2")
        // Clean up multiple spaces
        .replace(/\s+/g, " ")
        .trim();

      if (cleanText) {
        runs.push(
          new TextRun({
            text: cleanText,
            font: "Poppins",
            size: 22,
            color: "2c3e50",
          })
        );
      }
    }
  }

  return runs.length > 0
    ? runs
    : [
        new TextRun({
          text: text,
          font: "Poppins",
          size: 22,
          color: "2c3e50",
        }),
      ];
}
