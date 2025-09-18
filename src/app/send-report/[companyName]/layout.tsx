import type { Metadata } from "next";

interface Props {
  params: { companyName: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const companyName = decodeURIComponent(params.companyName);

  return {
    title: `${companyName} - Report Delivery | AI & Automation Readiness Audit`,
    description: `Get your personalized AI & Automation Readiness Report from ${companyName}`,
  };
}

export default function SendReportLayout({
  children,
  params,
}: Props) {
  return <>{children}</>;
}