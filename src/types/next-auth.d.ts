import { DefaultSession } from "next-auth";

// https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin: boolean;
      roles: string[]; // ✅ Add this line
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin: boolean;
    roles: string[]; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean;
    roles: string[];
  }
}
