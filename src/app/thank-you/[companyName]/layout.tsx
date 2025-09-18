import type { Metadata } from "next";

interface Props {
  params: { companyName: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const companyName = decodeURIComponent(params.companyName);

  return {
    title: `${companyName} - Thank You | AI & Automation Readiness Audit`,
    description: `Thank you for completing the AI & Automation Readiness Assessment with ${companyName}`,
  };
}

export default function ThankYouLayout({
  children,
  params,
}: Props) {
  return <>{children}</>;
}