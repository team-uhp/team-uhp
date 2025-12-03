import { compare } from 'bcrypt';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Username or Email',
      credentials: {
        identifier: {
          label: 'Username or Email',
          type: 'text',
          placeholder: 'john@hawaii.edu',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) {
          return null;
        }

        // Try to find user by email OR username
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          },
        });

        if (!user) {
          return null;
        }

        // Require account to be validated
        if (!user.validation) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: `${user.id}`,
          email: user.email,
          username: user.username,
          randomKey: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    session: ({ session, token }) => {
      // Inject id, role, and username into session.user
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
          username: token.username,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as { id: string; email: string; username: string; randomKey: string };
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
          username: u.username,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
