export interface Usage {
  id: string;
  workspaceId: string;
  month: string;
  apiRequests: number;
  storageBytes: number;
  bandwidthBytes: number;
  activeUsers: number;
  projects: number;
  collections: number;
  apiKeys: number;
  createdAt: Date;
  updatedAt: Date;
}
