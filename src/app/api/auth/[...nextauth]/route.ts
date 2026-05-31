import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@hospitalityos.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@hospitalityos.com" && credentials?.password === "admin123") {
          return {
            id: "owner-1",
            name: "Elena Rostova",
            email: "admin@hospitalityos.com",
            role: "OWNER"
          };
        } else if (credentials?.email === "chef@hospitalityos.com" && credentials?.password === "chef123") {
          return {
            id: "chef-1",
            name: "Master Chef Pierre",
            email: "chef@hospitalityos.com",
            role: "CHEF"
          };
        } else if (credentials?.email === "guest@hospitalityos.com" && credentials?.password === "guest123") {
          return {
            id: "customer-1",
            name: "Julian Vanderbilt",
            email: "guest@hospitalityos.com",
            role: "CUSTOMER"
          };
        }
        
        if (credentials?.email && credentials?.password) {
          return {
            id: "simulated-user-" + Date.now(),
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: "STAFF"
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET || "hospitalityos-secret-super-key-12345"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
