const API_URL = "https://script.google.com/macros/s/AKfycbyqw9I7_DqciRcm1poVGJlVRgCr8hHs3v_J38rteG1aoMcNaAigZT0w96ghq8ioBB0/exec";

const kab = document.getElementById("kabupaten");
const kec = document.getElementById("kecamatan");
const desa = document.getElementById("desa");

const tamat = document.getElementById("tamat");
const tahunTamatWrap = document.getElementById("tahunTamatWrap");
const tahunBoyongWrap = document.getElementById("tahunBoyongWrap");

const tahunTamat = document.getElementById("tahunTamat");
const tahunBoyong = document.getElementById("tahunBoyong");

const form = document.getElementById("formData");

let dataWilayah = {};

// LOAD DATA dengan optimasi looping
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    dataWilayah = data;
    let options = '<option value="">Pilih Kabupaten</option>';
    Object.keys(dataWilayah).forEach(k => {
      options += `<option value="${k}">${k}</option>`;
    });
    kab.innerHTML = options;
  });

// DROPDOWN WILAYAH
kab.onchange = () => {
  kec.innerHTML = '<option value="">Pilih Kecamatan</option>';
  desa.innerHTML = '<option value="">Pilih Desa</option>';

  let options = '<option value="">Pilih Kecamatan</option>';
  Object.keys(dataWilayah[kab.value] || {}).forEach(k => {
    options += `<option value="${k}">${k}</option>`;
  });
  kec.innerHTML = options;
};

// ... (fungsi kec.onchange mirip seperti di atas)

// GENERATE TAHUN (Optimized)
function generateTahun(select) {
  const currentYear = new Date().getFullYear();
  let options = '<option value="">Pilih Tahun</option>';
  for (let i = currentYear; i >= 1980; i--) {
    options += `<option value="${i}">${i}</option>`;
  }
  select.innerHTML = options;
}

// LOGIC TAMAT
tamat.onchange = () => {
  // Hanya generate jika belum ada isinya agar pilihan user tidak hilang
  if (tahunBoyong.options.length <= 1) generateTahun(tahunBoyong);
  
  tahunBoyongWrap.classList.remove("d-none");

  if (tamat.value === "Ya") {
    generateTahun(tahunTamat);
    tahunTamatWrap.classList.remove("d-none");
  } else {
    tahunTamatWrap.classList.add("d-none");
    tahunTamat.value = ""; // Bersihkan nilai jika user batal milih 'Ya'
  }
};

// SUBMIT
form.onsubmit = function(e) {
  e.preventDefault();
  if (isSubmitting) return;

  // Validasi tambahan: pastikan tahun sudah dipilih jika tampil
  if (tamat.value === "Ya" && !tahunTamat.value) {
    alert("Silakan pilih tahun tamat");
    return;
  }

  const btn = form.querySelector("button[type='submit']");
  const originalBtnText = btn.innerHTML; // Simpan teks asli tombol

  isSubmitting = true;
  btn.disabled = true;
  btn.innerHTML = "Mengirim... ⏳";

  fetch(API_URL, {
    method: "POST",
    body: new FormData(form)
  })
  .then(res => {
    // Cek apakah response oke (GAS biasanya kasih status 200)
    btn.innerHTML = "Berhasil ✓";
    setTimeout(() => {
      window.location.href = "success.html";
    }, 700);
  })
  .catch(err => {
    console.error(err);
    isSubmitting = false;
    btn.disabled = false;
    btn.innerHTML = originalBtnText; // Kembalikan ke teks semula
    alert("Gagal mengirim data. Silakan coba lagi.");
  });
};
