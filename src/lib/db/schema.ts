import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  pgEnum,
  boolean,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const industryEnum = pgEnum("industry", [
  "technology",
  "healthcare",
  "finance",
  "education",
  "manufacturing",
  "retail",
  "hospitality",
  "construction",
  "real_estate",
  "transportation",
  "logistics",
  "agriculture",
  "media",
  "professional_services",
  "non_profit",
  "other",
]);

export const companySizeEnum = pgEnum("company_size", [
  "startup",
  "small",
  "medium",
  "large",
  "enterprise",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "text",
  "multiple_choice",
  "checkbox",
  "conditional",
]);

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  formId: integer("form_id")
    .references(() => forms.id)
    .notNull(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  industry: industryEnum("industry").notNull(),
  size: companySizeEnum("size").notNull(),
  imageURL: varchar("image_url").notNull(),
  providerEmail: varchar("provider_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionCategories = pgTable("question_categories", {
  id: serial("id").primaryKey(),
  formId: integer("form_id")
    .notNull()
    .references(() => forms.id),
  name: varchar("name", { length: 255 }).notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => questionCategories.id),
  text: text("text").notNull(),
  type: questionTypeEnum("type").notNull(),
  required: boolean("required").default(false).notNull(),
  order: integer("order").default(0),
  options: json("options")
    .$type<
      {
        text: string;
        value: string;
        order: number;
      }[]
    >()
    .default([]),
  conditionals: json("conditionals")
    .$type<
      {
        conditionQuestionId: number;
        conditionValues: string[];
        showQuestion: boolean;
        operator?: "AND" | "OR";
      }[]
    >()
    .default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  formId: integer("form_id").references(() => forms.id),
  companyId: integer("company_id").references(() => companies.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => submissions.id),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => submissions.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  submissions: many(submissions),
}));

export const formsRelations = relations(forms, ({ many }) => ({
  categories: many(questionCategories),
  submissions: many(submissions),
}));

export const questionCategoriesRelations = relations(
  questionCategories,
  ({ one, many }) => ({
    form: one(forms, {
      fields: [questionCategories.formId],
      references: [forms.id],
    }),
    questions: many(questions),
  })
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  category: one(questionCategories, {
    fields: [questions.categoryId],
    references: [questionCategories.id],
  }),
  answers: many(answers),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  form: one(forms, {
    fields: [submissions.formId],
    references: [forms.id],
  }),
  company: one(companies, {
    fields: [submissions.companyId],
    references: [companies.id],
  }),
  answers: many(answers),
  reports: many(reports),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  submission: one(submissions, {
    fields: [answers.submissionId],
    references: [submissions.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  submission: one(submissions, {
    fields: [reports.submissionId],
    references: [submissions.id],
  }),
}));
