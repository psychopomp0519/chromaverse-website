/** Common types shared across the application */

export interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}
