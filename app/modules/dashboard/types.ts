export interface Usage {
  id: string;
  workspaceId: string;
  month: string;
  apiRequests: number;
  /**
   * Not measured. The API derives this as apiRequests * 128, so it is an
   * estimate at best and must not be presented as a figure.
   */
  bandwidthBytes: number;
  projects: number;
  collections: number;
  apiKeys: number;
  createdAt: Date;
  updatedAt: Date;
}
