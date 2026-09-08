import { useLanguage } from "../i18n/LanguageContext";
import LegalPage from "./LegalPage";

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  return <LegalPage title={t.legal.privacy.title} sections={t.legal.privacy.sections} current="privacy" />;
}
