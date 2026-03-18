/**
 * Product app frontend SSO bootstrap.
 * Run this before showing local login form.
 */
import axios from "axios";

const BHIV_AUTH_BASE_URL = "https://auth.blackholeinfiverse.com";
const APP_SLUG = "sampada"; // setu | sampada | niyantran | ...

export async function tryBhivSsoAutoLogin() {
  try {
    const { data } = await axios.get(`${BHIV_AUTH_BASE_URL}/api/auth/sso/session`, {
      params: { app: APP_SLUG },
      withCredentials: true
    });

    if (data?.authenticated && data?.user) {
      // Optional: create your app-local session/token here if needed.
      // For direct JWT-based trust, keep using req.user from middleware server-side.
      return { ok: true, user: data.user };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}
