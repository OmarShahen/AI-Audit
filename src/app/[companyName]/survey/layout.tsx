import type { Metadata } from "next";
import SurveyLayoutClient from "./layout-client";

interface Props {
  params: { companyName: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const companyName = decodeURIComponent(params.companyName);

  return {
    title: `${companyName} - Survey | AI & Automation Readiness Audit`,
    description: `Complete your comprehensive AI & Automation Readiness Survey powered by ${companyName}`,
  };
}

export default function SurveyLayout({
  children,
  params,
}: Props) {
  return <SurveyLayoutClient>{children}</SurveyLayoutClient>;
}
