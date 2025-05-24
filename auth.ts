import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma"; // your prisma client import

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      profile(profile) {
        console.log("Google profile object:", profile); // log profile on sign-in
        
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user" // Google profile has no role, so default to 'user'
        };
      }
    })
  ],
  // callbacks: {
  //   async session({ session, user }) {
  //     if (session.user) {
  //       session.user.role = user.role; // add role to session.user
  //     }
  //     return session;
  //   }
  // }
});