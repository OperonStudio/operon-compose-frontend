import type {
  AppConfig,
  PageContent,
  SidebarContent,
  StatCardConfig,
} from "./api/interfaces";

export const ProjectDetailsPage: PageContent = {
  page: {
    title: "Project Details",
    subtitle: "Manage your project collections and settings",
    actions: [
      {
        id: "add-new-collection",
        label: "Add Collection",
        icon: "Plus",
        variant: "primary",
      },
    ],
  },
  content: {},
};

export const AppConfigData: AppConfig = {
  orgName: "Operon Studio",
  appName: "Operon Compose",
  productName: "Compose",
  meta: {
    title: "Operon Compose",
    charset: "utf-8",
  },
  theme: {
    defaultMode: "light",
    primaryFont: "Inter, sans-serif",
  },
};

export const SidebarData: SidebarContent = {
  groups: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
        { label: "Projects", icon: "FolderGit2", href: "/projects" },
      ],
    },
    {
      title: "Configuration",
      items: [
        { label: "Environments", icon: "Layers", href: "/environments" },
        { label: "API Keys", icon: "KeyRound", href: "/api-keys" },
        { label: "Context", icon: "Braces", href: "/context" },
      ],
    },
    {
      title: "Logic",
      items: [
        { label: "Rule Engine", icon: "GitBranch", href: "/rule-engine" },
        { label: "Routing Flow", icon: "Workflow", href: "/flow" },
      ],
    },
    {
      title: "Workspace",
      items: [
        { label: "Settings & Team", icon: "Settings", href: "/settings" },
      ],
    },
  ],
};

export const DashboardPage: PageContent<{ statCards: StatCardConfig[] }> = {
  page: {
    title: "Dashboard",
    subtitle: "Overview of your workspace usage and metrics",
    icon: "LayoutDashboard",
  },
  content: {
    statCards: [
      {
        key: "api_calls",
        title: "API Calls",
        icon: "Activity",
        color: "blue",
        bg: "blue.50",
      },
      {
        key: "bandwidth",
        title: "Bandwidth Used",
        icon: "Database",
        color: "purple",
        bg: "purple.50",
        format: "bytes",
      },
      {
        key: "active_projects",
        title: "Active Projects",
        icon: "FolderGit2",
        color: "green",
        bg: "green.50",
      },
    ],
  },
};

export const ProjectsPage: PageContent = {
  page: {
    title: "Projects",
    subtitle: "Manage your Operon projects",
    actions: [
      {
        id: "create",
        label: "Create Project",
        icon: "Plus",
        variant: "primary",
      },
    ],
  },
  content: {
    emptyState: {
      icon: "FolderGit2",
      title: "No projects found",
      description: "Get started by creating your first project.",
      actionLabel: "Create Project",
    },
  },
  modals: {
    createProject: {
      title: "Create Project",
      submitLabel: "Create",
      cancelLabel: "Cancel",
      fields: [
        { name: "name", label: "Project Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
      ],
    },
  },
};

export const EnvironmentsPage: PageContent = {
  page: {
    title: "Environments",
    subtitle: "Manage deployment environments",
    actions: [
      {
        id: "create-environment-button",
        label: "Create Environment",
        icon: "Plus",
        variant: "primary",
      },
    ],
  },
  content: {
    emptyState: {
      icon: "Layers",
      title: "No environments yet",
      description:
        "Environments represent deployment targets like <strong>development</strong>, <strong>staging</strong>, or <strong>production</strong>. You must create at least one environment before you can generate API keys for your projects.",
      actionLabel: "Create First Environment",
    },
  },
};

export const ApiKeysPage: PageContent = {
  page: {
    title: "API Keys",
    subtitle: "Manage API keys for your projects and environments",
  },
  content: {
    emptyState: {
      icon: "Key",
      title: "No API keys found",
      description: "Generate API keys to authenticate your applications.",
    },
  },
};

export const ContextModulePage: PageContent = {
  page: {
    title: "Context Variables",
    subtitle: "Define global context variables for your rules",
    actions: [
      {
        id: "add-context-button",
        label: "Add Variable",
        icon: "Plus",
        variant: "primary",
      },
    ],
  },
  content: {
    emptyState: {
      icon: "Braces",
      title: "No context variables",
      description: "Create context variables to use in your rule conditions.",
      actionLabel: "Add Variable",
    },
  },
};

export const RuleEnginePage: PageContent = {
  page: {
    title: "Rule Engine",
    subtitle: "Configure business rules and logic",
  },
  content: {
    emptyState: {
      icon: "GitBranch",
      title: "No rules defined",
      description: "Create rules to dynamically control your content delivery.",
    },
  },
};

export const FlowPage: PageContent = {
  page: {
    title: "Routing Flow",
    subtitle: "Visualize your content delivery rules",
  },
  content: {
    emptyState: {
      icon: "Workflow",
      title: "No Selection Made",
      description:
        "Select a project and collection from the dropdowns above to visualize its routing flow.",
    },
  },
};

export const SettingsStaticPage: PageContent = {
  page: {
    title: "Settings",
    subtitle: "Manage workspace team members and configuration",
    icon: "Settings",
  },
  content: {},
};
