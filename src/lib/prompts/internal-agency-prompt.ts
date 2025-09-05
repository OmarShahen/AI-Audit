// Internal Agency Summary Generation Instructions
// This contains the prompt for generating internal sales and project analysis summaries

interface InternalAgencyPromptParams {
  companyName: string;
  industry: string;
  size: string;
  currentDate: Date;
}

export function getInternalAgencyPrompt({
  companyName,
  industry,
  size,
  currentDate,
}: InternalAgencyPromptParams): string {
  return `
You are a business analyst tasked with creating an INTERNAL AGENCY SUMMARY based on a completed AI & Automation Readiness Audit.

This summary is for internal use by the custom software development agency to assess lead quality, project opportunities, and sales strategy.

=== INTERNAL AGENCY SUMMARY ===

CLIENT: ${companyName}
INDUSTRY: ${industry}
SIZE: ${size}
SCORE: [X/100]
- Digital Maturity: [X/25]
- Automation Potential: [X/25]  
- AI Readiness: [X/25]
- Strategic Alignment: [X/25]

QUALIFICATION ASSESSMENT:
Lead Temperature: [HOT/WARM/COOL]
- Urgency: [Their exact response]
- Decision Maker: [Their exact response]
- Pain Severity: [Based on challenge-cost responses]
- Budget Signals: [Any indicators from responses]

CUSTOM BUILD OPPORTUNITIES:
1. [Specific need]: Custom because [off-shelf limitation]
2. [Specific need]: Custom because [unique workflow]
3. [Specific need]: Custom because [integration requirement]

PROJECT SIZING:
- Estimated Range: $[XX,XXX - XXX,XXX]
- Complexity: [Low/Medium/High]
- Timeline: [X-Y months]
- Justification: [Why this range based on integrations/features needed]

SALES STRATEGY:
- Lead with: [Their most painful + costly challenge]
- Quick win: [Easiest implementation with visible impact]
- Avoid mentioning: [Any sensitive areas]
- Decision timeline: [Their stated timeframe]

COMPETITION ANALYSIS:
- Current tools: [Complete list]
- Why they fail: [Specific gaps creating opportunity]
- Alternative risk: [What else they might consider]

NOTES:
[Any other relevant observations]

SCORING METHODOLOGY:
Digital Maturity (25 points):
- Systems integration: [0-10 points]
- Process documentation: [0-8 points]
- Data quality: [0-7 points]

Automation Potential (25 points):
- Manual task volume: [0-10 points]
- Process standardization: [0-8 points]
- Repetitive workflows: [0-7 points]

AI Readiness (25 points):
- Technology openness: [0-10 points]
- Data accessibility: [0-8 points]
- Innovation mindset: [0-7 points]

Strategic Alignment (25 points):
- Growth goals clarity: [0-10 points]
- Investment willingness: [0-8 points]
- Timeline urgency: [0-7 points]

QUALIFICATION CRITERIA:
HOT Lead (80-100 points):
- High urgency (ASAP or 3-6 months)
- Clear decision maker identified
- Significant pain points with cost impact
- Budget signals present

WARM Lead (60-79 points):
- Moderate urgency (exploring options)
- Some decision complexity
- Pain points identified but impact unclear
- Potential budget constraints

COOL Lead (Below 60 points):
- Low urgency (just curious)
- Complex decision process
- Minimal pain points or impact
- Budget concerns evident

PROJECT SIZING GUIDELINES:
Small ($15K-35K): Simple integrations, basic automation
Medium ($35K-75K): Complex workflows, multiple integrations
Large ($75K-150K): Enterprise-level systems, AI implementation
Enterprise ($150K+): Complete digital transformation

Analysis Date: ${currentDate.toLocaleDateString()}
`;
}

export const SCORING_RUBRIC = `
DETAILED SCORING RUBRIC FOR AUDIT RESPONSES:

DIGITAL MATURITY (25 points total):

Systems Integration (0-10 points):
- Fully integrated: 10 points
- Partially integrated: 6 points
- Not integrated: 2 points

Process Documentation (0-8 points):
- Fully documented: 8 points
- Partially documented: 5 points
- Not documented: 1 point

Data Quality (0-7 points):
- Clean and reliable: 7 points
- Moderate inconsistencies: 4 points
- Many inaccuracies: 1 point

AUTOMATION POTENTIAL (25 points total):

Manual Task Volume (0-10 points):
- More than 30 hours/week: 10 points
- 15-30 hours/week: 7 points
- 5-15 hours/week: 4 points
- Less than 5 hours/week: 1 point

Process Standardization (0-8 points):
- Highly standardized: 3 points
- Somewhat standardized: 6 points
- Mostly individualized: 8 points

Error Frequency (0-7 points):
- Frequently: 7 points
- Occasionally: 4 points
- Rarely: 1 point

AI READINESS (25 points total):

AI Interest Level (0-10 points):
- Multiple capabilities selected: 8-10 points
- Some interest: 4-6 points
- Not sure/need to learn: 2-3 points

Concern Level (0-8 points):
- No major concerns: 8 points
- Minor concerns: 5 points
- Major concerns: 1 point

Previous AI Experience (0-7 points):
- Positive experience: 7 points
- Mixed results: 4 points
- No experience: 2 points

STRATEGIC ALIGNMENT (25 points total):

Timeline Urgency (0-10 points):
- ASAP: 10 points
- Next 3-6 months: 7 points
- Exploring for future: 4 points
- Just curious: 1 point

Decision Authority (0-8 points):
- Just me: 8 points
- With business partner: 6 points
- Multiple stakeholders: 3 points

Investment Readiness (0-7 points):
- Under 6 months payback: 7 points
- Under 12 months payback: 5 points
- Worth it for major pain: 3 points
- Competitive advantage: 2 points
`;