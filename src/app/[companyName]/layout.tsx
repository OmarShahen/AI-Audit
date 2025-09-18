import type { Metadata } from "next";

interface Props {
  params: { companyName: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const companyName = decodeURIComponent(params.companyName);

  return {
    title: `${companyName} - AI & Automation Readiness Audit`,
    description: `Complete your AI & Automation Readiness Assessment powered by ${companyName}`,
  };
}

export default function CompanyLayout({
  children,
  params,
}: Props) {
  return <>{children}</>;
}