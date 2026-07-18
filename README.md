# Flowperk — Setup Guide

Yeh poora Next.js + Supabase app hai. Neeche diye steps follow karo, 15-20 min mein locally chal jayega.

## 1. Node.js install karo (agar nahi hai)

nodejs.org se LTS version download karo, install karo.

## 2. Project folder kholo terminal mein

```
cd flowperk
npm install
```

Yeh saare dependencies install karega (2-3 min lagega).

## 3. Supabase project banao (free)

1. supabase.com pe jao, sign up karo (GitHub se ho sakta hai)
2. "New Project" — naam do "flowperk", strong DB password set karo, region "Mumbai/Singapore" choose karo (India ke closest)
3. Project ban jaane ke baad (1-2 min lagta hai), left sidebar mein **SQL Editor** pe jao
4. Is repo ki `supabase/schema.sql` file poori copy karo aur SQL Editor mein paste karke **Run** dabao
5. Left sidebar mein **Authentication → Providers → Email** pe jao, "Confirm email" ko **OFF** kar do (testing ke liye fast signup)

## 4. API keys copy karo

Supabase dashboard mein **Settings → API** pe jao:
- "Project URL" copy karo
- "anon public" key copy karo

## 5. `.env.local` file banao

Project folder mein `.env.local.example` ko copy karke naam `.env.local` rakho, aur values daalo:

```
NEXT_PUBLIC_SUPABASE_URL=tumhara-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tumhara-anon-key
```

## 6. Run karo

```
npm run dev
```

Browser mein `localhost:3000` kholo — live hai!

## Test kaise karo

1. `/signup` pe jao, "I'm a brand" choose karke ek account banao
2. Dashboard mein "+ New campaign" se ek campaign launch karo
3. Log out karo, `/signup` pe wapas jao, is baar "I'm a creator" choose karke doosra account banao
4. `/campaigns` pe jao, apni campaign dhoondo, click karke clip submit karo (koi bhi test URL daal sakte ho)
5. Wapas brand account se login karo, dashboard mein submission dikhega — Approve/Reject kar sakte ho

## Deploy karna (jab test ho jaye)

1. GitHub pe naya repo banao, is folder ko push karo
2. vercel.com pe GitHub se login karo, repo import karo
3. Environment variables (wahi `.env.local` wale) Vercel ke settings mein daalo
4. Deploy — 2 min mein live URL milega
5. Apna domain (flowperk.com) Vercel settings → Domains mein add kar sakte ho

## Abhi jo missing hai (jaan-bujh kar, MVP ke liye)

- **Real payment/payout** — abhi earnings sirf number hai database mein, actual bank transfer/crypto payout connect nahi hai. Yeh next step hai jab pehle real clients aa jayen.
- **View tracking automation** — abhi views manually track honge (ya tum admin se update karoge), TikTok/YouTube API se auto-fetch baad mein add karenge.
- **Currency conversion** — abhi sab USD mein hai, jo tumne bola tha (auto-convert to local currency) woh payment provider (Wise/Payoneer) integrate karne ke baad aayega.

Koi bhi cheez atke ya error aaye, mujhe error message copy-paste karke bhej dena, main fix bata dunga.
