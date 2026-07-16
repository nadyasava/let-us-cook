# LetUsCook!

Prototype aplikasi web untuk deteksi bahan makanan dari foto dan rekomendasi resep berdasarkan isi kulkas.

## Stack

- Frontend: React (Vite) + Tailwind CSS
- Backend: Flask (Python)
- Database: SQLite
- Food detection: Claude Vision API (fallback ke mock result kalau `ANTHROPIC_API_KEY` belum diset)
- Data resep: dataset lokal (`backend/data/recipes.json`), bukan API pihak ketiga

## Struktur project

```
letuscook/
  backend/
    app.py            entrypoint Flask
    config.py          konfigurasi & env vars
    database.py         schema + seeding SQLite
    data/recipes.json   dataset resep lokal
    routes/              detect, ingredients, recipes, favorites/history
  frontend/
    src/components/     UploadPhoto, IngredientManager, RecipeCard, RecipeDetail, FavoritesHistory
    src/App.jsx          state utama & routing tab
    src/api.js           wrapper fetch ke backend
```

## Menjalankan backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # isi ANTHROPIC_API_KEY kalau mau deteksi asli, opsional
python app.py
```

Backend jalan di `http://localhost:5000`. Database SQLite otomatis dibuat dan di-seed dari `data/recipes.json` saat pertama kali dijalankan.

## Menjalankan frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend jalan di `http://localhost:5173` dan otomatis proxy request `/api/*` ke backend di port 5000 (lihat `vite.config.js`).

## Keterbatasan prototype ini (baca sebelum demo)

- **Single user, tanpa autentikasi.** Semua data (kulkas, favorit, riwayat) bersifat global, cocok untuk demo tapi tidak untuk produksi multi user.
- **Dataset resep terbatas** (9 resep contoh). Cukup untuk mendemonstrasikan alur matching, tapi tambah data sendiri di `backend/data/recipes.json` kalau butuh lebih banyak variasi. Format tiap entri sudah mengikuti schema yang dipakai `database.py`.
- **Deteksi makanan butuh API key aktif** untuk hasil nyata. Tanpa `ANTHROPIC_API_KEY`, endpoint `/api/detect` selalu mengembalikan hasil mock (`egg`, confidence `low`), supaya alur tetap bisa dites end to end tanpa biaya API.
- **Validasi upload** baru sebatas cek mimetype dan ukuran file (maks 8MB). Belum ada rate limiting atau scanning konten, pertimbangkan ini kalau nanti di-deploy publik.
- **Match score** dihitung sederhana: persentase bahan resep yang ada di kulkas. Tidak mempertimbangkan substitusi bahan atau jumlah/kuantitas.

## Langkah lanjut yang disarankan

1. Tambah `.env` dengan API key asli dan uji deteksi dengan foto makanan sungguhan.
2. Perluas `recipes.json` sesuai kebutuhan demo/sidang.
3. Kalau progress ke arah multi user, tambahkan tabel `users` dan session/JWT sebelum menambah fitur lain di atasnya, jangan sebaliknya.
