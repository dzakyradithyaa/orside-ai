# 🧠 Orside AI – Detektor Lesi Pra-Kanker Berbasis AI

**Orside AI** adalah aplikasi web inovatif untuk **deteksi dini lesi pra-kanker rongga mulut** berbasis **fluoresensi optik dan kecerdasan buatan (AI)** menggunakan **Convolutional Neural Network (CNN)**.
Aplikasi ini memungkinkan pengguna mengunggah foto lesi mulut dan mendapatkan hasil analisis AI secara **instan, akurat, dan non-invasif.**

---

## 🌐 Tampilan Utama

Aplikasi web ini dibangun dengan:

- **Frontend:** HTML5, TailwindCSS, Font Awesome, dan animasi GSAP
- **Backend:** Flask (Python)
- **AI Engine:** Model CNN (diintegrasikan melalui Flask API)
- **Fitur unggulan:** Mode gelap, analisis gambar real-time, animasi interaktif, dan showcase penyakit rongga mulut.

---

## 📂 Struktur Direktori

```
orside-ai/
│
├── static/
│   ├── css/
│   │   ├── style.css
│   │   ├── concept.css
│   │   ├── analyzerAi.css
│   │   ├── night-mode.css
│   │   └── disease.css
│   ├── img/
│   │   ├── orside-logo.png
│   │   ├── favicon-orside.png
│   │   └── disease/ (gambar penyakit)
│   └── js/
│       ├── main.js
│       ├── concept.js
│       ├── analyzerAi.js
│       └── disease.js
│
├── templates/
│   └── index.html
│
├── app.py                # Flask app utama
├── model/
│   └── cnn_model.h5      # Model CNN (opsional)
├── requirements.txt
└── README.md
```

---

## ⚙️ Cara Menjalankan Proyek

### 1️⃣ Persiapan Lingkungan

Pastikan kamu sudah menginstal Python 3.8+
Buka terminal/PowerShell di folder proyek, lalu jalankan:

```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2️⃣ Jalankan Server Flask

```bash
python app.py
```

Aplikasi akan berjalan di:

```
http://127.0.0.1:5000/
```

### 3️⃣ Akses di Browser

Buka link di atas, kamu akan melihat halaman utama **Orside AI**.

---

## 🧩 Fitur Utama

| Fitur                      | Deskripsi                                                                                          |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| 🦷 **AI Analyzer**         | Unggah gambar lesi mulut dan dapatkan hasil klasifikasi instan dari model CNN                      |
| 🌙 **Mode Gelap & Terang** | Pengguna dapat mengganti tema secara dinamis                                                       |
| 📊 **Akurasi Tinggi**      | Model AI mencapai tingkat akurasi hingga 95%                                                       |
| ⚡ **Cepat & Responsif**   | Waktu inferensi < 2 detik per gambar                                                               |
| 📚 **Edukasi Penyakit**    | Informasi interaktif tentang berbagai penyakit rongga mulut seperti leukoplakia, eritroplakia, dll |
| 🌀 **Animasi GSAP**        | Pengalaman interaktif dengan efek scroll dan transisi halus                                        |

---

## 🧠 Teknologi yang Digunakan

| Kategori             | Teknologi                                                               |
| -------------------- | ----------------------------------------------------------------------- |
| **Frontend**         | HTML5, TailwindCSS, Font Awesome, GSAP                                  |
| **Backend**          | Flask (Python)                                                          |
| **Machine Learning** | TensorFlow / Keras (CNN)                                                |
| **Visual Assets**    | Fluorescence oral images, vector icons                                  |
| **Deployment Ready** | Kompatibel untuk hosting di Render, Vercel (frontend) atau Flask server |

---

## 🧪 Contoh Penggunaan

1. Jalankan aplikasi Flask
2. Masuk ke halaman utama
3. Klik **“Coba Sekarang”** pada bagian _Hero Section_
4. Unggah foto lesi rongga mulut (format JPG/PNG, max 10MB)
5. Tunggu hingga analisis selesai
6. Lihat hasil klasifikasi AI dan tingkat kepercayaan model

---
