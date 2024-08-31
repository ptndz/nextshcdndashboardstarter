import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  type UserSession = DefaultSession['user'];
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      username: string;
      role_id: string;
      updatedAt: Date;
    };
    error: string;
  }
  interface User {
    accessToken: string;
    refreshToken: string;
    id: string;
    email: string;
    name: string;
    image: string;
    username: string;
    role_id: string;
    updatedAt: Date;
    expires_in: number;
  }
  interface JWT {
    accessTokenExpires: number;
    accessToken: string;
    refreshToken: string;
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}
