import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en, ru, kz } from './translations';

i18n
	.use(LanguageDetector)
	.init({
		debug: true,
		fallbackLng: 'ru',
		interpolation: {
			escapeValue: false
		},
		resources: {
			ru: {translation: ru},
			en: {translation: en},
			kz: {translation: kz},
		},
	});

export default i18n;