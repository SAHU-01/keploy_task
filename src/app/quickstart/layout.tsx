import StripeLayout from "@/features/layout/components/stripe-layout";
import { CodePane } from "@/features/code-explorer/components/code-pane";

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
