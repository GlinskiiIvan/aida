export enum AuthCodes {
  USER_ALREADY_EXISTS = "auth.user.already_exists",
  INVALID_CREDENTIALS = "auth.invalid_credentials",
  REFRESH_TOKEN_MISSING = "auth.refresh_token.missing",
  REFRESH_TOKEN_INVALID = "auth.refresh_token.invalid",
  ACCESS_DENIED = "auth.access_denied",
  AUTHENTICATION_REQUIRED = "auth.authentication_required",

  REGISTRATION_SUCCESS = "auth.registration.success",
  REGISTRATION_ERROR = "auth.registration.error",

  LOGIN_SUCCESS = "auth.login.success",
  LOGIN_ERROR = "auth.login.error",

  REFRESH_SUCCESS = "auth.refresh.success",
  REFRESH_ERROR = "auth.refresh.error",

  LOGOUT_SUCCESS = "auth.logout.success",
  LOGOUT_ERROR = "auth.logout.error",
}
