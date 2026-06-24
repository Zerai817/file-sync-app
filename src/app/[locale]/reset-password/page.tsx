import { setRequestLocale } from "next-intl/server";
import { ResetPasswordPageContent } from "@/components/auth/AuthPages";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  setRequestLocale(locale);
  return <ResetPasswordPageContent token={token || ""} />;
}
