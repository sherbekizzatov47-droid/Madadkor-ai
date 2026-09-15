# Madadkor AI — haqiqiy AI chat

Bu versiyada matnli chat `getAnswer()` kabi lokal kalit-so'z qoidalariga emas, server-side OpenAI Responses API'ga ulanadi.

## 1. Paketlarni o'rnatish

```bash
npm install
```

## 2. `.env` yaratish

Project root'da `.env` yarating:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5-mini
PORT=5000
```

`OPENAI_API_KEY`ni frontendga yoki `VITE_*` o'zgaruvchiga yozmang.

## 3. Ikki terminal

Terminal 1:

```bash
npm run server
```

Terminal 2:

```bash
npm run dev
```

## 4. Tekshirish

Brauzerda:

```text
http://localhost:5173
```

Chatga masalan:

```text
Ishxonam 2 oydan beri oylik bermayapti.
```

AI muammoni tahlil qiladi va huquqiy savol bo'lsa rasmiy manbalarni tekshirishga urinadi.

## 5. Rasmiy manbalar

Server web search vositasini faqat quyidagi domenlar bilan cheklaydi:

- lex.uz
- my.gov.uz
- murojaat.gov.uz
- sud.uz
- my.sud.uz
- gov.uz

Agar aniq norma/modda ishonchli manbadan tasdiqlanmasa, AI modda raqamini o'ylab topmasligi uchun promptga qat'iy qoida berilgan.

## 6. Health check

```text
http://localhost:5000/api/health
```

`hasApiKey: true` bo'lsa server API keyni ko'rgan.
