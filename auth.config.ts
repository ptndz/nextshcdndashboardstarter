import fetch from 'cross-fetch';
import { NextAuthConfig } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken
        })
      }
    );
    const refreshedTokens = await res.json();
    if (!res.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.data.accessToken,
      accessTokenExpires: Date.now() + refreshedTokens.data.expires_in * 1000,
      refreshToken: refreshedTokens.data.refreshToken ?? token.refreshToken
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials');
          }

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: credentials.email,
                password: credentials.password
              })
            }
          );
          const user = await res.json();

          if (!user.success) {
            throw new Error(user.message);
          }

          return user.data;
        } catch (error: any) {
          console.log(error);

          throw new Error(error);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.name = user.name;
        token.email = user.email;
        token.id = user.id;
        token.image = user.image;
        token.updatedAt = user.updatedAt;
        token.username = user.username;
        token.role_id = user.role_id;

        token.accessTokenExpires = Date.now() + user.expires_in * 1000;

        return token;
      }
      const accessTokenExpires = token.accessTokenExpires as unknown as number;

      if (Date.now() < accessTokenExpires) {
        return token;
      }
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.role_id = token.role_id as string;
      session.user.image = token.image as string;
      session.user.updatedAt = token.updatedAt as Date;
      session.error = token.error as string;

      return session;
    }
  },
  pages: {
    signIn: '/' //sigin page
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
} satisfies NextAuthConfig;

export default authConfig;
