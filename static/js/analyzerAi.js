gsap.registerPlugin(ScrollTrigger);

gsap.to(".section-header", {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".section-header",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
});

gsap.to(".upload-card", {
  opacity: 1,
  x: 0,
  rotateY: 0,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".upload-card",
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
});

gsap.to(".results-card", {
  opacity: 1,
  x: 0,
  rotateY: 0,
  duration: 1.2,
  delay: 0.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".results-card",
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
});

const uploadZone = document.getElementById("uploadZone");
const fileInput = document.getElementById("fileInput");

uploadZone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", handleFileUpload);

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("Silakan pilih file gambar yang valid (PNG/JPG)");
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert("Ukuran file maksimal 10MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById("previewImage").src = e.target.result;
    gsap.to("#uploadZone", {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      onComplete: () => {
        document.getElementById("uploadZone").style.display = "none";
        document.getElementById("previewSection").style.display = "block";
        gsap.fromTo(
          "#previewSection",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      },
    });
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  fileInput.value = "";
  gsap.to("#previewSection", {
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    onComplete: () => {
      document.getElementById("previewSection").style.display = "none";
      document.getElementById("uploadZone").style.display = "block";
      gsap.fromTo(
        "#uploadZone",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5 }
      );
    },
  });
  document.getElementById("resultsPlaceholder").style.display = "block";
  document.getElementById("resultsSection").style.display = "none";
}

uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  gsap.to(uploadZone, { scale: 1.05, duration: 0.3 });
});

uploadZone.addEventListener("dragleave", () => {
  gsap.to(uploadZone, { scale: 1, duration: 0.3 });
});

uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  gsap.to(uploadZone, { scale: 1, duration: 0.3 });
  const file = e.dataTransfer.files[0];
  if (file) handleFileUpload({ target: { files: [file] } });
});

async function analyzeImage() {
  document.getElementById("resultsPlaceholder").style.display = "none";
  document.getElementById("loadingSection").style.display = "block";
  document.getElementById("resultsSection").style.display = "none";
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const predictions = [
    {
      label: "Leukoplakia",
      probability: 0.68,
      icon: "fa-exclamation-triangle",
      severity: "Perhatian",
    },
    {
      label: "Mukosa Normal",
      probability: 0.18,
      icon: "fa-check-circle",
      severity: "Normal",
    },
    {
      label: "Eritroplakia",
      probability: 0.09,
      icon: "fa-exclamation-circle",
      severity: "Tinggi",
    },
    {
      label: "Kanker",
      probability: 0.03,
      icon: "fa-biohazard",
      severity: "Kritis",
    },
    {
      label: "Lainnya",
      probability: 0.02,
      icon: "fa-question-circle",
      severity: "Tidak Diketahui",
    },
  ];

  displayResults(predictions);
}

function displayResults(predictions) {
  document.getElementById("loadingSection").style.display = "none";
  const resultsSection = document.getElementById("resultsSection");
  resultsSection.style.display = "block";

  const top = predictions[0];
  let html = `
    <div class="result-main">
      <div class="severity-badge"><i class="fas ${top.icon}"></i> ${
    top.severity
  }</div>
      <h3 class="result-label">${top.label}</h3>
      <div class="result-percentage">${(top.probability * 100).toFixed(
        1
      )}%</div>
      <p class="confidence-text">Tingkat Keyakinan AI</p>
    </div>
    <div class="predictions-list">
      <h4 class="predictions-title">
        <i class="fas fa-chart-bar" style="color: var(--primary);"></i> Detail Analisis
      </h4>
  `;

  predictions.forEach((pred, index) => {
    const percent = (pred.probability * 100).toFixed(1);
    const itemClass =
      index === 0 ? "prediction-item is-top-prediction" : "prediction-item";
    html += `
      <div class="${itemClass}">
        <div class="prediction-icon"><i class="fas ${pred.icon}"></i></div>
        <div class="prediction-content">
          <div class="prediction-label">${pred.label}</div>
          <div class="prediction-bar-bg">
            <div class="prediction-bar-fill" data-width="${percent}" style="width: 0%;"></div>
          </div>
        </div>
        <div class="prediction-value">${percent}%</div>
      </div>
    `;
  });

  html += `
    </div>
    <div class="disclaimer">
      <i class="fas fa-info-circle disclaimer-icon"></i>
      <div>
        <h5 class="disclaimer-title">Penting untuk Diketahui</h5>
        <p class="disclaimer-text">
          Hasil ini adalah prediksi dari model kecerdasan buatan dan <strong>bukan diagnosis medis yang definitif</strong>. 
          Selalu konsultasikan dengan dokter atau profesional kesehatan untuk diagnosis yang akurat dan perawatan yang tepat.
        </p>
      </div>
    </div>
  `;

  resultsSection.innerHTML = html;

  gsap.fromTo(
    resultsSection,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
  );

  setTimeout(() => {
    document.querySelectorAll(".prediction-bar-fill").forEach((bar, index) => {
      gsap.to(bar, {
        width: bar.getAttribute("data-width") + "%",
        duration: 1.5,
        delay: index * 0.1,
        ease: "power3.out",
      });
    });
  }, 300);
}
