import StripeLayout from "@/components/StripeLayout";
import { CodePane } from "@/features/keploy-tutorial/components/CodePane";

export default function QuickstartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StripeLayout code={<CodePane />}>
      {children}
    </StripeLayout>
  );
}
