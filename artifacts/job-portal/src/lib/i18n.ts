import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import hi from "@/locales/hi.json";
import kn from "@/locales/kn.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
  hi: { translation: hi },
  kn: { translation: kn },
};

const defaultLanguage = typeof window !== "undefined" ? localStorage.getItem("preferredLanguage") || "en" : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "en",
  supportedLngs: ["en", "es", "hi", "kn"],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
