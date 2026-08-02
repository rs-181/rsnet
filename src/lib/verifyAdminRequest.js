import { ADMIN_COOKIE_NAME, isValidAdminToken } from "./adminAuthToken";

export function isAuthorizedAdminRequest(request) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isValidAdminToken(token);
}
