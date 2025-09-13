const { db } = require('../src/lib/db');
const { 
  companies, 
  forms, 
  questionCategories, 
  questions, 
  submissions, 
  answers, 
  reports 
} = require('../src/lib/db/schema');
const fs = require('fs');
const path = require('path');

async function exportData() {
  try {
    console.log('Starting data export...');

    // Create exports directory
    const exportsDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFile = path.join(exportsDir, `data_export_${timestamp}.json`);

    // Export all tables
    const data = {
      companies: await db.select().from(companies),
      forms: await db.select().from(forms),
      questionCategories: await db.select().from(questionCategories),
      questions: await db.select().from(questions),
      submissions: await db.select().from(submissions),
      answers: await db.select().from(answers),
      reports: await db.select().from(reports),
      exportDate: new Date().toISOString(),
      totalRecords: 0
    };

    // Calculate total records
    data.totalRecords = Object.values(data)
      .filter(Array.isArray)
      .reduce((sum, arr) => sum + arr.length, 0);

    // Write to file
    fs.writeFileSync(exportFile, JSON.stringify(data, null, 2));

    console.log(`Data exported successfully to: ${exportFile}`);
    console.log(`Total records exported: ${data.totalRecords}`);
    console.log('Export summary:');
    console.log(`- Companies: ${data.companies.length}`);
    console.log(`- Forms: ${data.forms.length}`);
    console.log(`- Question Categories: ${data.questionCategories.length}`);
    console.log(`- Questions: ${data.questions.length}`);
    console.log(`- Submissions: ${data.submissions.length}`);
    console.log(`- Answers: ${data.answers.length}`);
    console.log(`- Reports: ${data.reports.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

exportData();