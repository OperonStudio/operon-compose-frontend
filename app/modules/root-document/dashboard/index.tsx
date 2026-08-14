import { PageHeader } from "#/components/page-header";
import { HeaderActionProvider } from "#/contexts/header-actions";
import { DashboardLayout } from "./dashboard-layout";
import * as classes from "./style";

export const Dashboard = ({ children }: { children?: React.ReactNode }) => {
  return (
    <HeaderActionProvider>
      <DashboardLayout>
        <PageHeader />
        <main {...classes.dashboardStyle}>{children}</main>
      </DashboardLayout>
    </HeaderActionProvider>
  );
};
