// Questionnaire Specification for AI & Automation Readiness Audit
// This defines the complete structure and questions for the audit questionnaire

export interface QuestionnaireSection {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple-choice' | 'checkbox' | 'conditional';
  options?: string[];
  logic?: string;
  notes?: string;
}

export const QUESTIONNAIRE_SPECIFICATION: QuestionnaireSection[] = [
  {
    id: 'part1',
    title: 'Business Overview & Primary Challenges',
    questions: [
      {
        id: 'business_model',
        text: 'Briefly describe your core business model and services.',
        type: 'text',
        notes: 'What do you do, who are your clients, and how do you deliver value?'
      },
      {
        id: 'business_stage',
        text: 'Where would you say your business is today?',
        type: 'text',
        notes: 'Startup, growing steadily, preparing to scale, or something else?'
      },
      {
        id: 'top_challenges',
        text: 'List your top three biggest workflow or operations challenges right now. (e.g., double data entry, finding information, waiting for approvals)',
        type: 'text',
        notes: 'Format: 1- Challenge:------- Costs us: [Time/money/customers/others]. Add more button available'
      },
      {
        id: 'strategic_goals',
        text: 'What are your top 2–3 strategic goals for the next 12 months?',
        type: 'text',
        notes: 'This could include revenue, client volume, hiring, expanding services, etc.'
      },
      {
        id: 'success_vision',
        text: 'If everything went right this year, how would success look or feel?',
        type: 'text',
        notes: 'Open-ended, emotion-oriented — gives us narrative insight.'
      }
    ]
  },
  {
    id: 'part2',
    title: 'Systems & Tools Overview',
    questions: [
      {
        id: 'current_tools',
        text: 'Which software systems or tools does your business currently use regularly?',
        type: 'text',
        notes: 'Examples: CRM, ERP, project management, spreadsheets, accounting tools, etc.'
      },
      {
        id: 'duplicate_data_entry',
        text: 'Are there tasks or processes where you frequently enter the same data into multiple systems?',
        type: 'multiple-choice',
        options: ['Yes, often', 'Occasionally', 'Rarely or never'],
        logic: 'If yes, show follow-up question'
      },
      {
        id: 'excel_dependency',
        text: 'Do you rely heavily on Excel or other spreadsheets for any critical business processes?',
        type: 'multiple-choice',
        options: ['Yes, extensively', 'Yes, partially', 'No, we have dedicated systems'],
        logic: 'If yes, show follow-up question'
      },
      {
        id: 'tool_integration',
        text: 'Do your software tools share data with each other?',
        type: 'multiple-choice',
        options: ['Fully integrated', 'Partially integrated', 'Not integrated at all'],
        logic: 'If not integrated, show data movement question'
      }
    ]
  },
  {
    id: 'part3',
    title: 'Process & Workflow Maturity',
    questions: [
      {
        id: 'process_documentation',
        text: 'Are your key business processes written down somewhere?',
        type: 'multiple-choice',
        options: ['Fully documented and accessible', 'Partially documented', 'Not documented']
      },
      {
        id: 'process_standardization',
        text: 'Are processes typically standardized across the organization?',
        type: 'multiple-choice',
        options: ['Highly standardized', 'Somewhat standardized', 'Mostly individualized']
      },
      {
        id: 'approval_management',
        text: 'How are approvals and sign-offs typically managed?',
        type: 'multiple-choice',
        options: ['Automated workflows', 'Via email or chat (manual)', 'Verbally or in-person (manual)']
      },
      {
        id: 'handoff_issues',
        text: 'Do you experience delays, errors, or confusion in handoffs between departments or team members?',
        type: 'multiple-choice',
        options: ['Frequently', 'Occasionally', 'Rarely or never'],
        logic: 'If frequently or occasionally, show follow-up questions'
      }
    ]
  },
  {
    id: 'part4',
    title: 'Data Management & Accessibility',
    questions: [
      {
        id: 'data_quality',
        text: 'How would you describe the quality and accuracy of your business data?',
        type: 'multiple-choice',
        options: ['Clean, consistent, and reliable', 'Moderate inconsistencies', 'Many inaccuracies or missing data']
      },
      {
        id: 'data_storage',
        text: 'Where is your data stored?',
        type: 'multiple-choice',
        options: ['Centralized in a database or ERP', 'In multiple systems but somewhat connected', 'In disconnected spreadsheets or isolated systems']
      },
      {
        id: 'reporting_access',
        text: 'Do you have real-time access to critical business reports and analytics?',
        type: 'multiple-choice',
        options: ['Yes, fully automated', 'Partially automated', 'Reports are created manually'],
        logic: 'Follow up with what reports are generated and what they would like'
      }
    ]
  },
  {
    id: 'part5',
    title: 'Automation Potential',
    questions: [
      {
        id: 'repetitive_tasks',
        text: 'Which types of tasks are currently repetitive or done manually? (Select all that apply)',
        type: 'checkbox',
        options: [
          'Data entry & updates',
          'Customer communications (emails, notifications)',
          'Reporting & document generation',
          'Scheduling & reminders',
          'Approvals & authorizations',
          'Other: (Please specify)'
        ]
      },
      {
        id: 'manual_task_hours',
        text: 'Roughly how many hours per week do these repetitive tasks take?',
        type: 'multiple-choice',
        options: ['Less than 5 hours', '5-15 hours', '15-30 hours', 'More than 30 hours']
      },
      {
        id: 'automation_priority',
        text: 'Which area of your business do you think would benefit most from automation?',
        type: 'text'
      },
      {
        id: 'error_prone_processes',
        text: 'Are there specific processes prone to human errors?',
        type: 'multiple-choice',
        options: ['Frequently', 'Occasionally', 'Rarely or never'],
        logic: 'If frequently or occasionally, show follow-up question'
      }
    ]
  },
  {
    id: 'part6',
    title: 'AI Readiness & Opportunities',
    questions: [
      {
        id: 'ai_capabilities_interest',
        text: 'Which of these AI capabilities interest you? (Check any that apply)',
        type: 'checkbox',
        options: [
          'Chatbot that answers customer questions 24/7',
          'Predictions about busy periods or demand',
          'Automatic creation of quotes, proposals, or reports',
          'Analysis of patterns in your business data',
          'Smart scheduling that considers multiple factors',
          'Quality checks using photos or video',
          'Other: _______',
          'Not sure - need to learn more'
        ]
      },
      {
        id: 'ai_assistant_vision',
        text: 'If you had a smart assistant for your business, what would you want it to do?',
        type: 'text'
      },
      {
        id: 'ai_concerns',
        text: "What's your biggest concern about using AI in your business?",
        type: 'multiple-choice',
        options: [
          'Too expensive',
          'Too complicated',
          'Might lose personal touch',
          'Data security worries',
          'Not sure it would actually help',
          'No major concerns',
          'Other: _______'
        ]
      },
      {
        id: 'ai_experience',
        text: 'Have you previously tried using AI tools in your business? If yes, what were the results or challenges?',
        type: 'text'
      }
    ]
  },
  {
    id: 'part7',
    title: 'Scalability & Infrastructure',
    questions: [
      {
        id: 'scalability_readiness',
        text: 'Can your current tools and systems support your business if it grows or becomes more complex?',
        type: 'multiple-choice',
        options: ['Yes, comfortably', 'With some limitations', 'No, scalability is a concern']
      },
      {
        id: 'custom_software_usage',
        text: 'Do you currently use any custom-developed software or internal tools?',
        type: 'multiple-choice',
        options: ['Yes, extensively', 'Some, but limited', 'No, we rely on off-the-shelf tools']
      },
      {
        id: 'custom_tools_interest',
        text: 'Would your business benefit from custom-built internal tools or apps tailored to your operations?',
        type: 'multiple-choice',
        options: ['Definitely', 'Possibly', 'Not needed'],
        logic: 'If definitely or possibly, show follow-up question'
      }
    ]
  },
  {
    id: 'part8',
    title: 'General Readiness & Strategic Vision',
    questions: [
      {
        id: 'tech_roadmap',
        text: 'Do you currently have a technology roadmap or strategic tech plan?',
        type: 'multiple-choice',
        options: ['Yes, clearly defined and documented', 'In progress or informal', 'No roadmap at the moment']
      },
      {
        id: 'top_inefficiency',
        text: 'If you could resolve one business inefficiency today, what would it be?',
        type: 'text'
      },
      {
        id: 'improvement_timeline',
        text: 'When do you need to see improvements?',
        type: 'multiple-choice',
        options: [
          'ASAP - losing money/customers now',
          'Next 3-6 months - planning ahead',
          'Exploring options for future',
          'Just curious what\'s possible'
        ]
      },
      {
        id: 'investment_justification',
        text: 'What would justify investment in new technology?',
        type: 'multiple-choice',
        options: [
          'Must pay back in under 6 months',
          'Must pay back in under 12 months',
          'Worth it if it solves major pain',
          'Looking for competitive advantage'
        ]
      },
      {
        id: 'decision_makers',
        text: 'Who else would be involved in this decision?',
        type: 'multiple-choice',
        options: [
          'Just me',
          'My business partner(s)',
          'Our CFO/financial advisor',
          'Our IT person/consultant',
          'Other: ___'
        ]
      }
    ]
  }
];

export const QUESTIONNAIRE_TITLE = 'Revi AI & Automation Readiness Audit';

export const SECTION_TITLES = [
  'Business Overview & Primary Challenges',
  'Systems & Tools Overview',
  'Process & Workflow Maturity',
  'Data Management & Accessibility',
  'Automation Potential',
  'AI Readiness & Opportunities',
  'Scalability & Infrastructure',
  'General Readiness & Strategic Vision'
];

export const QUESTION_TYPES = {
  TEXT: 'text',
  MULTIPLE_CHOICE: 'multiple-choice',
  CHECKBOX: 'checkbox',
  CONDITIONAL: 'conditional'
} as const;