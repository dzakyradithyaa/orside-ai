import io
import os
import json
import numpy as np
from PIL import Image
from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import tensorflow as tf
import traceback # <-- DITAMBAHKAN UNTUK DEBUGGING

# ------------------------------------------------------------------
# BAGIAN 1: KONFIGURASI & LOGIKA DARI NOTEBOOK ANDA
# ------------------------------------------------------------------
app = Flask(__name__)
CORS(app)

# Konfigurasi Utama
MODEL_PATH = "model_akhirmobilnet.keras"
CLASS_IDX_JSON = "class_indices.json"

# Fungsi preprocessing custom yang SAMA PERSIS seperti di notebook
# Ini adalah bagian paling penting yang hilang sebelumnya.
def mobilenet_preprocess(x):
    x = tf.cast(x, tf.float32)
    return x / 127.5 - 1.0

# Fungsi untuk memuat model dengan custom object, diambil dari notebook
def load_model_with_stub(path):
    try:
        from keras import config as keras_config
        keras_config.enable_unsafe_deserialization()
    except Exception:
        pass
    
    custom_objects = {'mobilenet_preprocess': mobilenet_preprocess}
    
    try:
        m = tf.keras.models.load_model(path, compile=False, safe_mode=False, custom_objects=custom_objects)
    except TypeError:
        m = tf.keras.models.load_model(path, compile=False, custom_objects=custom_objects)
    return m

# ------------------------------------------------------------------
# BAGIAN 2: INISIALISASI APLIKASI FLASK & MODEL
# ------------------------------------------------------------------

app = Flask(__name__)

# -- Muat semua aset saat aplikasi pertama kali dijalankan --
try:
    print("Memuat model dan aset...")
    # 1. Muat model menggunakan fungsi baru yang sudah benar
    model = load_model_with_stub(MODEL_PATH)
    print(f"✅ Model '{MODEL_PATH}' berhasil dimuat.")

    # 2. Dapatkan ukuran input secara dinamis dari model
    IMG_HEIGHT = int(model.input_shape[1])
    IMG_WIDTH = int(model.input_shape[2])
    IMG_SIZE = (IMG_HEIGHT, IMG_WIDTH)
    print(f"   - Ukuran input model: {IMG_SIZE}")

    # 3. Muat nama kelas dari file JSON, sama seperti di notebook
    with open(CLASS_IDX_JSON) as f:
        idx_map = json.load(f)
    CLASS_NAMES = [k for k, v in sorted(idx_map.items(), key=lambda kv: kv[1])]
    print(f"   - {len(CLASS_NAMES)} kelas dimuat dari '{CLASS_IDX_JSON}'.")

    # 4. (Opsional) Siapkan model untuk visualisasi feature map
    last_conv_layer = next((layer for layer in reversed(model.layers) if isinstance(layer, tf.keras.layers.Conv2D)), None)
    if last_conv_layer:
        feature_model = tf.keras.models.Model(inputs=model.inputs, outputs=last_conv_layer.output)
        print(f"   - Feature map akan diambil dari layer: '{last_conv_layer.name}'.")
    else:
        feature_model = None
        print("   - Peringatan: Tidak ada layer Conv2D yang ditemukan untuk feature map.")

except Exception as e:
    print(f"❌ FATAL ERROR: Gagal memuat model atau aset. Aplikasi tidak dapat berjalan.")
    print(f"   Error: {e}")
    # Hentikan aplikasi jika model gagal dimuat
    model = None 

# ------------------------------------------------------------------
# BAGIAN 3: FUNGSI HELPERS UNTUK PREDIKSI
# ------------------------------------------------------------------

def prepare_image(file_stream, target_size):
    """Membaca file stream, mengubah ukuran, dan mengembalikan array piksel [0-255]."""
    img = Image.open(io.BytesIO(file_stream)).convert("RGB")
    img = img.resize(target_size, Image.Resampling.BILINEAR)
    # DIHAPUS: arr = np.asarray(img).astype('float32') / 255.0
    # Model akan menangani normalisasi pikselnya sendiri.
    arr = np.asarray(img).astype('float32')
    return arr

def predict_image(img_array):
    """Menjalankan prediksi pada array gambar."""
    if model is None: return [], []
    inp = np.expand_dims(img_array, axis=0)
    preds = model.predict(inp, verbose=0)[0]
    top_idx = preds.argsort()[::-1][:len(CLASS_NAMES)]
    top = [(int(i), float(preds[i])) for i in top_idx]
    return top, preds

def get_feature_maps(img_array, max_maps=16):
    """Mengekstrak dan memproses feature map dari model."""
    if feature_model is None: return None
    inp = np.expand_dims(img_array, axis=0)
    feats = feature_model.predict(inp, verbose=0)
    fmap = np.squeeze(feats)
    if fmap.ndim < 3: return None
    
    C = fmap.shape[-1]
    maps = []
    n = min(C, max_maps)
    for i in range(n):
        m = fmap[..., i]
        m = (m - m.min()) / (m.max() - m.min() + 1e-8)
        m = (m * 255).astype('uint8')
        maps.append(Image.fromarray(m).resize((128, 128)).convert("L"))
    return maps

# ------------------------------------------------------------------
# BAGIAN 4: ROUTE (ENDPOINT) APLIKASI FLASK
# ------------------------------------------------------------------

@app.route("/", methods=["GET"])
def index():
    """Menampilkan halaman utama."""
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    """Menangani unggahan gambar dan mengembalikan prediksi."""
    if model is None:
        return jsonify({"error": "Model tidak dimuat, periksa log server."}), 500
    if "file" not in request.files:
        return jsonify({"error": "Tidak ada file yang dikirim."}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "File tidak dipilih."}), 400

    try:
        data = file.read()
        img_arr = prepare_image(data, target_size=IMG_SIZE)
        top_predictions, _ = predict_image(img_arr)

        results = [{"label": CLASS_NAMES[idx], "probability": float(p)} for idx, p in top_predictions]

        # Logika feature map (opsional)
        fmap_b64_string = None
        fmap_imgs = get_feature_maps(img_arr, max_maps=8)
        if fmap_imgs:
            import base64
            widths, heights = zip(*(im.size for im in fmap_imgs))
            contact_sheet = Image.new("L", (sum(widths), max(heights)))
            x_offset = 0
            for im in fmap_imgs:
                contact_sheet.paste(im, (x_offset, 0))
                x_offset += im.size[0]
            
            buf = io.BytesIO()
            contact_sheet.save(buf, format="PNG")
            fmap_b64_string = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

        return jsonify({"predictions": results, "feature_map": fmap_b64_string})

    except Exception as e:
        # --- BLOK DEBUGGING BARU YANG LEBIH DETAIL ---
        error_class = e.__class__.__name__
        error_details = str(e)
        error_traceback = traceback.format_exc()
        
        print("="*60)
        print("!! TERJADI ERROR PADA SAAT PREDIKSI !!")
        print(f"TIPE ERROR: {error_class}")
        print(f"DETAIL: {error_details}")
        print("--- TRACEBACK LENGKAP ---")
        print(error_traceback)
        print("="*60)
        
        return jsonify({"error": f"Terjadi kesalahan internal: {error_class}", "details": error_details}), 500

# ------------------------------------------------------------------
# BAGIAN 5: MENJALANKAN SERVER
# ------------------------------------------------------------------

if __name__ == "__main__":
    gpus = tf.config.experimental.list_physical_devices('GPU')
    if gpus:
        try:
            for g in gpus:
                tf.config.experimental.set_memory_growth(g, True)
        except RuntimeError as e:
            print(e)
    
    app.run(host="0.0.0.0", port=8080, debug=True)

