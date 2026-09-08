import { useLanguage } from "../i18n/LanguageContext";
import LegalPage from "./LegalPage";

export default function TermsAndConditions() {
  const { t } = useLanguage();
  return <LegalPage title={t.legal.terms.title} sections={t.legal.terms.sections} current="terms" />;
}
