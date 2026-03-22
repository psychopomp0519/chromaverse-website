/**
 * returnTo 파라미터를 검증하여 안전한 내부 경로만 반환.
 * 외부 URL, 프로토콜 상대 경로, 잘못된 값은 "/" 로 대체.
 */
export function getSafeReturnTo(value: string | null): string {
  if (!value) return "/";

  // 내부 경로만 허용: "/" 로 시작하고, "//" 로 시작하지 않아야 함
  if (!value.startsWith("/") || value.startsWith("//")) return "/";

  // 프로토콜이 포함된 경우 거부 (예: /\evil.com)
  if (/[\\]/.test(value)) return "/";

  try {
    // URL 생성 시도로 절대 URL 여부 확인
    const url = new URL(value, "http://localhost");
    if (url.hostname !== "localhost") return "/";
  } catch {
    return "/";
  }

  return value;
}
