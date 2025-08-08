import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  // The SDK will automatically mount the following routes:
  // /auth/login
  // /auth/logout
  // /auth/callback
  // /auth/profile
  // /auth/access-token
  // /auth/backchannel-logout
}); 