export interface Environment {
  id: string;
  name: string;
  description: string;
}

export interface CreateEnvironmentReq {
  name: string;
  description?: string;
}

export interface UpdateEnvironmentReq {
  name?: string;
  description?: string;
}
