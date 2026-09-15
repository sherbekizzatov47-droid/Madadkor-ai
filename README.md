# Madadkor AI

O'zbekiston fuqarolari uchun bepul, sun'iy intellektga asoslangan huquqiy yordam platformasi.
React 18 + Vite + Tailwind CSS asosida qurilgan, glassmorphic/dark UI, 3 tilli (UZ/RU/EN) i18n,
Voiceflow matnli chat va Vapi ovozli qo'ng'iroq integratsiyalari bilan.

## O'rnatish

```bash
npm install
```

## Ishga tushirish (development)

```bash
npm run dev
```

Brauzerda `http://localhost:5173` manzilini oching.

## Production build

```bash
npm run build
npm run preview
```

## Loyiha strukturasi

```
madadkor-ai/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              # Ilova kirish nuqtasi
    ├── App.jsx                # Barcha bo'limlarni bog'lovchi asosiy komponent
    ├── i18n.js                 # UZ/RU/EN tarjimalar (i18next)
    ├── index.css                # Glassmorphism, grid, scrollbar stillari
    └── components/
        ├── Navbar.jsx           # Sticky glass navbar + til almashtirgich
        ├── LanguageSwitcher.jsx # Animatsiyali til tugmalari
        ├── Hero.jsx              # Bosh ekran (headline, CTA, statistikalar)
        ├── Features.jsx           # Huquqiy yo'nalishlar grid kartalari
        ├── Disclaimer.jsx          # Huquqiy ogohlantirish bloki
        ├── ChatSection.jsx          # Chat/ovoz uchun vizual anchor bo'lim
        ├── Footer.jsx                # Footer
        ├── VoiceflowWidget.jsx        # Matnli chat widget (o'ng pastki burchak)
        └── VapiCallButton.jsx          # Ovozli qo'ng'iroq tugmasi (chap pastki burchak)
```

## Integratsiyalar

- **Voiceflow** — `src/components/VoiceflowWidget.jsx` ichida `useEffect` orqali skript dinamik yuklanadi
  va `window.voiceflow.chat.load(...)` chaqiriladi. Widget o'zi avtomatik o'ng pastki burchakka chiqadi
  (Voiceflow'ning default joylashuvi).
- **Vapi** — `@vapi-ai/web` npm paketi orqali ulangan. `src/components/VapiCallButton.jsx` chap pastki
  burchakda joylashadi, bosilganda `vapi.start(assistantId)` chaqiriladi, faol suhbat paytida qizil
  pulse-ring animatsiyasi ishlaydi, qayta bosilsa `vapi.stop()` chaqirilib qo'ng'iroq tugaydi.

## Muhim eslatma

`VoiceflowWidget.jsx` va `VapiCallButton.jsx` ichidagi `projectID` / `Public Key` / `Assistant ID`
qiymatlari hozircha to'g'ridan-to'g'ri kodga yozilgan. Production muhitida bu qiymatlarni `.env`
fayliga (`VITE_` prefiksi bilan) chiqarib, `import.meta.env.VITE_...` orqali o'qish tavsiya etiladi.


## Madadkor AI Call-center

Saytdagi mikrofon Vapi Web SDK orqali brauzer qo‘ng‘irog‘ini boshlaydi. Haqiqiy telefon raqamidan keladigan inbound qo‘ng‘iroq uchun Vapi Phone Number kerak bo‘ladi. Vapi bepul raqamni hozir faqat AQSh uchun beradi; xalqaro/custom raqamlar Vapi'ga import qilinadi. Vapi hujjatlariga ko‘ra buni Twilio yoki boshqa qo‘llab-quvvatlanadigan telephony provayderi orqali qilish mumkin.

### 1. Vapi Assistant
- Assistant ID ni `.env` dagi `VITE_VAPI_ASSISTANT_ID` ga yozing.
- Voice bo‘limida o‘zbekcha gapirishni test qiling.
- Vapi Voices V2 40+ tilni qo‘llaydi; ovoz konfiguratsiyasida `language` ni `auto` yoki kerakli tilga moslang.
- Transcriber ham o‘zbekcha nutqni to‘g‘ri tanishi uchun mos provider/model tanlang.

### 2. Telefon raqami
Vapi Dashboard → Phone Numbers orqali raqam yarating yoki xalqaro/custom raqamni import qiling. Raqamga inbound Assistant ID biriktiriladi.

### 3. +998 raqam haqida
Vapi'ning bepul telefon raqamlari AQSh bilan cheklangan. +998 raqam uchun mahalliy telephony provayderi/BYOC/SIP yoki Vapi qo‘llab-quvvatlaydigan provayder kerak bo‘lishi mumkin. Twilio'ning hozirgi Uzbekistan pricing sahifasida O‘zbekistonda voice-enabled Twilio raqamlari mavjud emasligi ko‘rsatilgan, shuning uchun +998 raqamni avtomatik Twilio'dan sotib olishni kafolatlamang. Mavjud +998 raqamingiz bo‘lsa, BYOC/SIP imkoniyatini tekshirish mumkin.

### 4. O‘zbekcha ovoz
Assistant system promptida quyidagi qoidalarni ishlating:
- Faqat ravon, tabiiy o‘zbek tilida gapir.
- Foydalanuvchiga doim “siz” deb murojaat qil.
- Qisqa gaplar ishlat.
- Savollarni bittadan ber.
- Foydalanuvchining gapini bo‘lma.
- Huquqiy terminni oddiy tilda izohla.
- Bilmagan ma’lumotni to‘qib chiqma.
- Zarur bo‘lsa inson yuristga yo‘naltir.
- Suhbat oxirida foydalanuvchiga keyingi qadamni ayt.

## Yangilanish: suhbatni yakunlash
Vapi call ishga tushganda `endCallMessage` va `endCallPhrases` override qilinadi. Foydalanuvchi “suhbatni yakunla”, “suhbatni tugat”, “chatni yop”, “aloqani uz”, “xayr” kabi iboralarni aytsa, Madadkor qisqa xayrlashib call'ni tugatishga harakat qiladi. 4.5 soniyalik client fallback ham mavjud.
