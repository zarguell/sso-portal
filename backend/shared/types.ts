export interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  iconUrl: string;
  ssoUrl: string;
  tags: string[];
}

export interface User {
  email: string;
  displayName: string;
}

export interface GetAppsResponse {
  user: User;
  apps: App[];
}
