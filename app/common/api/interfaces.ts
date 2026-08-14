import type { IconProps } from "@operon/icons";

export interface SidebarItem {
  label: string;
  icon: React.ComponentType<IconProps>;
  href: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface PageHeaderData {
  title: string;
  subtitle: string;
  actions?: PageHeaderAction[];
}

export interface PageHeaderAction {
  id: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  variant: "primary" | "secondary";
}

export interface PageAction {
  id: string;
  label: string;
  icon: string;
  variant: "primary" | "secondary";
}

export interface PageSearch {
  enabled: boolean;
  placeholder?: string;
}

export interface PageMeta {
  title: string;
  subtitle?: string;
  icon?: string;
  search?: PageSearch;
  actions?: PageAction[];
}

export interface EmptyState {
  icon?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
}

export interface ModalField {
  name: string;
  label: string;
  type: "text" | "textarea" | "dropdown";
  placeholder?: string;
  required?: boolean;
}

export interface ModalConfig {
  title: string;
  message?: string;
  submitLabel?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  fields?: ModalField[];
  isDestructive?: boolean;
}

export interface PageContent<TContent = Record<string, unknown>> {
  page: PageMeta;
  content: TContent & {
    emptyState?: EmptyState;
    labels?: Record<string, string>;
  };
  modals?: Record<string, ModalConfig>;
}

export interface AppConfig {
  orgName: string;
  appName: string;
  productName: string;
  meta: {
    title: string;
    charset: string;
  };
  theme: {
    defaultMode: string;
    primaryFont: string;
  };
}

export interface SidebarItemData {
  label: string;
  icon: string;
  href: string;
  external?: boolean;
}

export interface SidebarGroupData {
  title: string;
  items: SidebarItemData[];
}

export interface SidebarContent {
  groups: SidebarGroupData[];
}

export interface StatCardConfig {
  key: string;
  title: string;
  icon: string;
  color: string;
  bg: string;
  format?: "bytes";
}
