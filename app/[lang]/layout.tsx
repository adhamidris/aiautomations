import { i18n, Locale } from "../../i18n-config";
import { AnalyticsWrapper } from "@/components/analytics-wrapper";
import { getDictionary } from "../../get-dictionary";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { StickyNav } from "@/components/ui/sticky-nav";
import JsonLd from "@/components/seo/json-ld";
import { DodzieChatWidget } from "@/components/chat/dodzie-chat-widget";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  return (
    <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        <JsonLd />
        <GrainOverlay />
        <StickyNav ctaText={dict.nav.bookMeeting} />
        {children}
        <DodzieChatWidget lang={locale} copy={dict.chat} />
        <AnalyticsWrapper
          gaId={process.env.NEXT_PUBLIC_GA_ID || ""}
          consentTitle={dict.cookie.title}
          consentText={dict.cookie.text}
          consentAccept={dict.cookie.accept}
          consentDecline={dict.cookie.decline}
        />
    </div>
  );
}
