/** Supabase auth 에러 메시지를 한국어로 변환 */
const ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "Email not confirmed": "이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.",
  "User already registered": "이미 가입된 이메일입니다.",
  "Password should be at least 6 characters": "비밀번호는 6자 이상이어야 합니다.",
  "Signup requires a valid password": "유효한 비밀번호를 입력해주세요.",
  "Email rate limit exceeded": "잠시 후 다시 시도해주세요.",
  "For security purposes, you can only request this after": "보안을 위해 잠시 후 다시 시도해주세요.",
};

export function translateAuthError(message: string): string {
  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (message.includes(key)) return value;
  }
  return "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}
