import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  uz: {
    translation: {
      nav: {
        about: 'Loyiha haqida',
        rights: 'Huquqiy yo\u2019nalishlar',
        disclaimer: 'Ogohlantirish',
        cta: 'Suhbatni boshlash',
      },
      hero: {
        badge: 'Sun\u2019iy intellekt asosida \u2022 24/7 mavjud',
        titleLine1: 'Muammoingizni ayting.',
        titleLine2: 'Madadkor yo\u2018lini ko\u2018rsatadi.',
        subtitle:
          'Muammoni oddiy tilda tushuntiring. Madadkor muammoni aniqlaydi, savollar beradi, CASE yaratadi, hujjat tayyorlashga yordam beradi va keyingi qadamlarni ko\u2018rsatadi.',
        ctaChat: 'Muammomni aytaman',
        ctaVoice: 'Ovozli qo\u2019ng\u2019iroq qilish',
        stat1Value: '24/7',
        stat1Label: 'Uzluksiz faoliyat',
        stat2Value: 'Ovozli + matnli',
        stat2Label: 'Bitta xizmat, ikki usul',
        stat3Value: 'CASE',
        stat3Label: 'Muammo saqlanadi',
      },
      features: {
        eyebrow: 'Qamrov doirasi',
        title: 'AI qaysi sohalarda aniq yordam bera oladi?',
        subtitle:
          'Har bir yo\u2018nalish O\u2018zbekiston Respublikasining amaldagi qonunchiligi asosida tuzilgan bilim bazasiga tayanadi.',
        items: [
          {
            title: 'Oila va Aliment',
            desc: 'Aliment undirish tartibi, nikoh shartnomasi, ajralish jarayoni va yolg\u2018iz onalar uchun qonuniy kafolatlar.',
          },
          {
            title: 'Mehnat Huquqlari',
            desc: 'Noqonuniy ishdan bo\u2018shatish, mehnat shartnomasi, ta\u2019til huquqi va homiladorlik nafaqalari bo\u2018yicha maslahat.',
          },
          {
            title: 'Ijtimoiy Yordam',
            desc: '\u201CAyollar daftari\u201D, subsidiyalar, moddiy yordam va bepul uy-joy olish tartib-qoidalari.',
          },
          {
            title: 'Fuqarolik Huquqi',
            desc: 'Meros masalalari, mulkiy nizolar, shartnomalar va fuqarolik-huquqiy murojaatlarni rasmiylashtirish.',
          },
          {
            title: 'Iste\u2019molchilar Huquqi',
            desc: 'Sifatsiz mahsulot va xizmatlardan himoyalanish, pulni qaytarish va shikoyat yozish tartibi.',
          },
          {
            title: 'Davlat Xizmatlari',
            desc: 'Pasport, ro\u2018yxatga olish, notarial xizmatlar va elektron davlat xizmatlaridan foydalanish bo\u2018yicha yo\u2018riqnoma.',
          },
        ],
      },
      disclaimer: {
        title: 'Muhim huquqiy ogohlantirish',
        text: 'Madadkor AI faqat O\u2018zbekiston Respublikasining ochiq manbalardagi qonun hujjatlari asosida umumiy ma\u2019lumot beradi. Tizim javoblari rasmiy advokatlik xizmati yoki malakali yuridik maslahat o\u2018rnini bosmaydi. Murakkab yoki shaxsiy vaziyatlarda malakali yuristga murojaat qilishni tavsiya qilamiz.',
      },
      chat: {
        eyebrow: 'AI Assistent',
        title: 'Savolingizni yozing yoki gapiring',
        subtitle:
          'Pastki o\u2018ng burchakdagi chat oynasi orqali yozma, chap burchakdagi tugma orqali esa ovozli suhbatni boshlashingiz mumkin.',
        note: 'Suhbat maxfiy saqlanadi va faqat sizga tegishli javob berish uchun ishlatiladi.',
      },
      voice: {
        idle: 'Ovozli qo\u2019ng\u2019iroq',
        connecting: 'Ulanmoqda\u2026',
        active: 'Suhbat davom etmoqda',
        end: 'Suhbatni tugatish',
        hint: 'Madadkor AI bilan jonli ovozli suhbat',
      },
      footer: {
        tagline: 'Muammodan yechimgacha olib boruvchi raqamli huquqiy yordam xizmati.',
        rights: 'Barcha huquqlar himoyalangan.',
        madeWith: 'O\u2018zbekiston fuqarolari uchun \u2764\uFE0F bilan yaratildi',
      },
    },
  },
  ru: {
    translation: {
      nav: {
        about: '\u041E \u043F\u0440\u043E\u0435\u043A\u0442\u0435',
        rights: '\u041F\u0440\u0430\u0432\u043E\u0432\u044B\u0435 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F',
        disclaimer: '\u041F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435',
        cta: '\u041D\u0430\u0447\u0430\u0442\u044C \u0434\u0438\u0430\u043B\u043E\u0433',
      },
      hero: {
        badge: '\u041D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0418\u0418 \u2022 \u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E 24/7',
        titleLine1: '\u0414\u043B\u044F \u0433\u0440\u0430\u0436\u0434\u0430\u043D \u0423\u0437\u0431\u0435\u043A\u0438\u0441\u0442\u0430\u043D\u0430',
        titleLine2: '\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0439 \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0418\u0418-\u043F\u043E\u043C\u043E\u0449\u043D\u0438\u043A',
        subtitle:
          '\u0415\u0441\u0442\u044C \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u043F\u043E \u0430\u043B\u0438\u043C\u0435\u043D\u0442\u0430\u043C, \u0442\u0440\u0443\u0434\u043E\u0432\u044B\u043C \u043F\u0440\u0430\u0432\u0430\u043C, \u0441\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0439 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0435 \u0438\u043B\u0438 \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0441\u043A\u0438\u043C \u0434\u0435\u043B\u0430\u043C? Madadkor AI \u0434\u0430\u0451\u0442 \u043F\u043E\u043D\u044F\u0442\u043D\u044B\u0435, \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0435 \u0438 \u0431\u044B\u0441\u0442\u0440\u044B\u0435 \u0440\u0430\u0437\u044A\u044F\u0441\u043D\u0435\u043D\u0438\u044F \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0433\u043E \u0437\u0430\u043A\u043E\u043D\u043E\u0434\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u0430.',
        ctaChat: '\u041D\u0430\u0447\u0430\u0442\u044C \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u0447\u0430\u0442',
        ctaVoice: '\u0413\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0439 \u0437\u0432\u043E\u043D\u043E\u043A',
        stat1Value: '24/7',
        stat1Label: '\u041D\u0435\u043F\u0440\u0435\u0440\u044B\u0432\u043D\u0430\u044F \u0440\u0430\u0431\u043E\u0442\u0430',
        stat2Value: '3 \u044F\u0437\u044B\u043A\u0430',
        stat2Label: '\u0423\u0437\u0431., \u0420\u0443\u0441., \u0410\u043D\u0433\u043B.',
        stat3Value: 'CASE',
        stat3Label: '\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E',
      },
      features: {
        eyebrow: '\u041E\u0431\u043B\u0430\u0441\u0442\u0438 \u043F\u043E\u043C\u043E\u0449\u0438',
        title: '\u0412 \u043A\u0430\u043A\u0438\u0445 \u0441\u0444\u0435\u0440\u0430\u0445 \u0418\u0418 \u0434\u0430\u0451\u0442 \u0442\u043E\u0447\u043D\u044B\u0435 \u043E\u0442\u0432\u0435\u0442\u044B?',
        subtitle:
          '\u041A\u0430\u0436\u0434\u043E\u0435 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u043F\u0438\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u0431\u0430\u0437\u0443 \u0437\u043D\u0430\u043D\u0438\u0439, \u043F\u043E\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u0443\u044E \u043D\u0430 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u043C \u0437\u0430\u043A\u043E\u043D\u043E\u0434\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u0435 \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0438 \u0423\u0437\u0431\u0435\u043A\u0438\u0441\u0442\u0430\u043D.',
        items: [
          {
            title: '\u0421\u0435\u043C\u044C\u044F \u0438 \u0430\u043B\u0438\u043C\u0435\u043D\u0442\u044B',
            desc: '\u041F\u043E\u0440\u044F\u0434\u043E\u043A \u0432\u0437\u044B\u0441\u043A\u0430\u043D\u0438\u044F \u0430\u043B\u0438\u043C\u0435\u043D\u0442\u043E\u0432, \u0431\u0440\u0430\u0447\u043D\u044B\u0439 \u0434\u043E\u0433\u043E\u0432\u043E\u0440, \u0440\u0430\u0437\u0432\u043E\u0434 \u0438 \u0433\u0430\u0440\u0430\u043D\u0442\u0438\u0438 \u0434\u043B\u044F \u043E\u0434\u0438\u043D\u043E\u043A\u0438\u0445 \u043C\u0430\u0442\u0435\u0440\u0435\u0439.',
          },
          {
            title: '\u0422\u0440\u0443\u0434\u043E\u0432\u044B\u0435 \u043F\u0440\u0430\u0432\u0430',
            desc: '\u041D\u0435\u0437\u0430\u043A\u043E\u043D\u043D\u043E\u0435 \u0443\u0432\u043E\u043B\u044C\u043D\u0435\u043D\u0438\u0435, \u0442\u0440\u0443\u0434\u043E\u0432\u043E\u0439 \u0434\u043E\u0433\u043E\u0432\u043E\u0440, \u043F\u0440\u0430\u0432\u043E \u043D\u0430 \u043E\u0442\u043F\u0443\u0441\u043A \u0438 \u043F\u043E\u0441\u043E\u0431\u0438\u044F \u043F\u043E \u0431\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u043E\u0441\u0442\u0438.',
          },
          {
            title: '\u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430',
            desc: '\u00AB\u0416\u0435\u043D\u0441\u043A\u0430\u044F \u0442\u0435\u0442\u0440\u0430\u0434\u044C\u00BB, \u0441\u0443\u0431\u0441\u0438\u0434\u0438\u0438, \u043C\u0430\u0442\u0435\u0440\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u043E\u043C\u043E\u0449\u044C \u0438 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0431\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E\u0433\u043E \u0436\u0438\u043B\u044C\u044F.',
          },
          {
            title: '\u0413\u0440\u0430\u0436\u0434\u0430\u043D\u0441\u043A\u043E\u0435 \u043F\u0440\u0430\u0432\u043E',
            desc: '\u0412\u043E\u043F\u0440\u043E\u0441\u044B \u043D\u0430\u0441\u043B\u0435\u0434\u0441\u0442\u0432\u0430, \u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u0441\u043F\u043E\u0440\u044B, \u0434\u043E\u0433\u043E\u0432\u043E\u0440\u044B \u0438 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0433\u0440\u0430\u0436\u0434\u0430\u043D\u0441\u043A\u043E-\u043F\u0440\u0430\u0432\u043E\u0432\u044B\u0445 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0439.',
          },
          {
            title: '\u041F\u0440\u0430\u0432\u0430 \u043F\u043E\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043B\u0435\u0439',
            desc: '\u0417\u0430\u0449\u0438\u0442\u0430 \u043E\u0442 \u043D\u0435\u043A\u0430\u0447\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0445 \u0442\u043E\u0432\u0430\u0440\u043E\u0432 \u0438 \u0443\u0441\u043B\u0443\u0433, \u0432\u043E\u0437\u0432\u0440\u0430\u0442 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u0438 \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u043F\u043E\u0434\u0430\u0447\u0438 \u0436\u0430\u043B\u043E\u0431.',
          },
          {
            title: '\u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u0443\u0441\u043B\u0443\u0433\u0438',
            desc: '\u041F\u0430\u0441\u043F\u043E\u0440\u0442, \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F, \u043D\u043E\u0442\u0430\u0440\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0443\u0441\u043B\u0443\u0433\u0438 \u0438 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u044B\u0435 \u0433\u043E\u0441\u0443\u0441\u043B\u0443\u0433\u0438.',
          },
        ],
      },
      disclaimer: {
        title: '\u0412\u0430\u0436\u043D\u043E\u0435 \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435',
        text: 'Madadkor AI \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 \u043E\u0431\u0449\u0443\u044E \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0445 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u043E\u0432 \u0437\u0430\u043A\u043E\u043D\u043E\u0434\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u0430 \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0438 \u0423\u0437\u0431\u0435\u043A\u0438\u0441\u0442\u0430\u043D. \u041E\u0442\u0432\u0435\u0442\u044B \u0441\u0438\u0441\u0442\u0435\u043C\u044B \u043D\u0435 \u0437\u0430\u043C\u0435\u043D\u044F\u044E\u0442 \u0443\u0441\u043B\u0443\u0433\u0438 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u0430\u0434\u0432\u043E\u043A\u0430\u0442\u0430. \u0412 \u0441\u043B\u043E\u0436\u043D\u044B\u0445 \u0438\u043B\u0438 \u043B\u0438\u0447\u043D\u044B\u0445 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u044F\u0445 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043E\u0431\u0440\u0430\u0449\u0430\u0442\u044C\u0441\u044F \u043A \u043A\u0432\u0430\u043B\u0438\u0444\u0438\u0446\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u043C\u0443 \u044E\u0440\u0438\u0441\u0442\u0443.',
      },
      chat: {
        eyebrow: '\u0418\u0418-\u0430\u0441\u0441\u0438\u0441\u0442\u0435\u043D\u0442',
        title: '\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0438\u043B\u0438 \u043F\u0440\u043E\u0438\u0437\u043D\u0435\u0441\u0438\u0442\u0435 \u0432\u043E\u043F\u0440\u043E\u0441',
        subtitle:
          '\u041E\u043A\u043D\u043E \u0447\u0430\u0442\u0430 \u0432\u043D\u0438\u0437\u0443 \u0441\u043F\u0440\u0430\u0432\u0430 \u2014 \u0434\u043B\u044F \u0442\u0435\u043A\u0441\u0442\u0430, \u043A\u043D\u043E\u043F\u043A\u0430 \u0432\u043D\u0438\u0437\u0443 \u0441\u043B\u0435\u0432\u0430 \u2014 \u0434\u043B\u044F \u0433\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0433\u043E \u0437\u0432\u043E\u043D\u043A\u0430.',
        note: '\u0414\u0438\u0430\u043B\u043E\u0433 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u0435\u043D \u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0432\u0430\u0448\u0435\u0433\u043E \u043E\u0442\u0432\u0435\u0442\u0430.',
      },
      voice: {
        idle: '\u0413\u043E\u043B\u043E\u0441\u043E\u0432\u043E\u0439 \u0437\u0432\u043E\u043D\u043E\u043A',
        connecting: '\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435\u2026',
        active: '\u0420\u0430\u0437\u0433\u043E\u0432\u043E\u0440 \u0438\u0434\u0451\u0442',
        end: '\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C',
        hint: '\u0416\u0438\u0432\u043E\u0439 \u0437\u0432\u043E\u043D\u043E\u043A \u0441 \u0418\u0418-\u044E\u0440\u0438\u0441\u0442\u043E\u043C',
      },
      footer: {
        tagline: '\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0439 \u043F\u0440\u043E\u0435\u043A\u0442 \u044E\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 \u0434\u043B\u044F \u0431\u0443\u0434\u0443\u0449\u0435\u0433\u043E.',
        rights: '\u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B.',
        madeWith: '\u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0441 \u2764\uFE0F \u0434\u043B\u044F \u0433\u0440\u0430\u0436\u0434\u0430\u043D \u0423\u0437\u0431\u0435\u043A\u0438\u0441\u0442\u0430\u043D\u0430',
      },
    },
  },
  en: {
    translation: {
      nav: {
        about: 'About',
        rights: 'Legal Areas',
        disclaimer: 'Disclaimer',
        cta: 'Start a Chat',
      },
      hero: {
        badge: 'Powered by AI \u2022 Available 24/7',
        titleLine1: 'For the Citizens of Uzbekistan',
        titleLine2: 'Madadkor shows the way forward',
        subtitle:
          'Questions about child support, labor rights, social benefits, or civil matters? Madadkor AI gives you clear, free, and fast guidance grounded in current legislation.',
        ctaChat: 'Start Text Chat',
        ctaVoice: 'Start Voice Call',
        stat1Value: '24/7',
        stat1Label: 'Always available',
        stat2Value: 'Voice + text',
        stat2Label: 'Two ways to talk',
        stat3Value: 'CASE',
        stat3Label: 'Your case is saved',
      },
      features: {
        eyebrow: 'Coverage',
        title: 'Where can the AI give you precise answers?',
        subtitle:
          'Every area is backed by a knowledge base built on the current legislation of the Republic of Uzbekistan.',
        items: [
          {
            title: 'Family & Child Support',
            desc: 'Child support procedures, marriage contracts, divorce process, and legal guarantees for single mothers.',
          },
          {
            title: 'Labor Rights',
            desc: 'Unlawful dismissal, employment contracts, paid leave, and maternity benefit guidance.',
          },
          {
            title: 'Social Assistance',
            desc: 'The "Women\u2019s Notebook" registry, subsidies, financial aid, and procedures for free housing.',
          },
          {
            title: 'Civil Law',
            desc: 'Inheritance matters, property disputes, contracts, and formalizing civil-law claims.',
          },
          {
            title: 'Consumer Rights',
            desc: 'Protection against defective goods and services, refunds, and how to file a complaint.',
          },
          {
            title: 'Government Services',
            desc: 'Passports, registration, notary services, and guidance on e-government services.',
          },
        ],
      },
      disclaimer: {
        title: 'Important Legal Notice',
        text: 'Madadkor AI provides general information based solely on publicly available legislation of the Republic of Uzbekistan. Responses from the system do not replace formal legal representation or qualified legal advice. For complex or personal matters, we recommend consulting a licensed attorney.',
      },
      chat: {
        eyebrow: 'AI Assistant',
        title: 'Type or speak your question',
        subtitle:
          'Use the chat window in the bottom-right corner to type, or the button in the bottom-left corner to start a voice conversation.',
        note: 'Your conversation stays private and is used only to answer your question.',
      },
      voice: {
        idle: 'Voice Call',
        connecting: 'Connecting\u2026',
        active: 'Call in progress',
        end: 'End Call',
        hint: 'Live voice call with an AI legal aide',
      },
      footer: {
        tagline: 'A free legal-aid project built for the future.',
        rights: 'All rights reserved.',
        madeWith: 'Made with \u2764\uFE0F for the citizens of Uzbekistan',
      },
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uz',
    supportedLngs: ['uz', 'ru', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'madadkor_lang',
    },
  })

export default i18n
