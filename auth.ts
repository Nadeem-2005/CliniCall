//reference : - https://youtu.be/ay-atEUGIc4?feature=shared
import NextAuth, { User } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma"; // your prisma client import

// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation
import { DefaultSession} from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string,
      role: string,
    } & DefaultSession["user"]
  }
  interface User {
    id: string,
    name?: string | null,
    email?: string | null,
    image?: string | null,
    role: string, // Add role to User interface
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string,
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      profile(profile) {
        // console.log("Google profile object:", profile); // log profile on sign-in
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user" // Default role for new users
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token when user signs in
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    }
  }
});