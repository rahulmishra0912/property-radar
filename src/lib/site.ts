export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const STATIC_HOST = process.env.NEXT_PUBLIC_STATIC_HOST === "1";

export function withBasePath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
