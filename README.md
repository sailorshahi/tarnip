# TARNIP
Dynamic storefront for custom IoT hardware and software. Static front end plus Supabase (Postgres, Auth, RLS).

Pages: `index.html` (shop / under-construction gate), `account.html` (customer's purchased products), `admin.html` (site mode, categories, products, orders).

## Setup
1. Create a Supabase project. Run `schema.sql` in the SQL editor.
2. Put the project URL and anon key in `config.js`.
3. Open the site, create an account, then run: `update profiles set is_admin=true where email='you@example.com';`
4. In Admin > Site, switch between Under construction and Published.
5. Deploy on GitHub Pages, Netlify or Vercel (static).

## Push to GitHub
    git init && git add . && git commit -m "TARNIP initial"
    git branch -M main && git remote add origin https://github.com/<you>/TARNIP.git && git push -u origin main

## Next steps
Payment gateway (Razorpay), device pairing, image uploads (Supabase Storage), per-product software pages, email on order approval.
