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
let isSubmitting = false; 

// 1. LOAD DATA WILAYAH
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    dataWilayah = data;
    let options = '<option value="">Pilih Kabupaten</option>';
    Object.keys(dataWilayah).forEach(k => {
      options += `<option value="${k}">${k}</option>`;
    });
    kab.innerHTML = options;
  })
  .catch(err => console.error("Gagal memuat data wilayah:", err));

// 2. DROPDOWN KABUPATEN -> KECAMATAN
kab.onchange = () => {
  kec.innerHTML = '<option value="">Pilih Kecamatan</option>';
  desa.innerHTML = '<option value="">Pilih Desa</option>';
  
  let options = '<option value="">Pilih Kecamatan</option>';
  const listKecamatan = dataWilayah[kab.value] || {};
  Object.keys(listKecamatan).forEach(k => {
    options += `<option value="${k}">${k}</option>`;
  });
  kec.innerHTML = options;
};

// 3. DROPDOWN KECAMATAN -> DESA (Perbaikan Utama)
kec.onchange = () => {
  desa.innerHTML = '<option value="">Pilih Desa</option>';
  let options = '<option value="">Pilih Desa</option>';
  const listDesa = dataWilayah[kab.value]?.[kec.value] || [];
  listDesa.forEach(d => {
    options += `<option value="${d}">${d}</option>`;
  });
  desa.innerHTML = options;
};

// 4. GENERATE TAHUN
function generateTahun(select) {
  const currentYear = new Date().getFullYear();
  let options = '<option value="">Pilih Tahun</option>';
  for (let i = currentYear; i >= 1980; i--) {
    options += `<option value="${i}">${i}</option>`;
  }
  select.innerHTML = options;
}

// 5. LOGIC TAMAT/BOYONG
tamat.onchange = () => {
  // Selalu tampilkan Tahun Boyong jika status dipilih
  if (tamat.value !== "") {
    if (tahunBoyong.options.length <= 1) generateTahun(tahunBoyong);
    tahunBoyongWrap.classList.remove("d-none");
    tahunBoyong.setAttribute("required", "required");
  } else {
    tahunBoyongWrap.classList.add("d-none");
    tahunBoyong.removeAttribute("required");
  }

  // Tampilkan Tahun Tamat hanya jika "Ya"
  if (tamat.value === "Ya") {
    generateTahun(tahunTamat);
    tahunTamatWrap.classList.remove("d-none");
    tahunTamat.setAttribute("required", "required");
  } else {
    tahunTamatWrap.classList.add("d-none");
    tahunTamat.value = "";
    tahunTamat.removeAttribute("required");
  }
};

// 6. SUBMIT DATA
form.onsubmit = function(e) {
  e.preventDefault();
  
  if (isSubmitting) return;

  // Validasi manual tambahan jika diperlukan
  if (!kab.value || !kec.value || !desa.value) {
    alert("Harap lengkapi data wilayah!");
    return;
  }

  const btn = form.querySelector("button[type='submit']");
  const originalBtnText = btn.innerHTML;

  isSubmitting = true;
  btn.disabled = true;
  btn.innerHTML = "Mengirim... ⏳";

  const formData = new FormData(form);

  fetch(API_URL, {
    method: "POST",
    body: formData,
    mode: "no-cors" // Gunakan no-cors untuk menghindari blokir CORS Apps Script
  })
  .then(() => {
    // Karena mode no-cors, kita anggap sukses jika tidak masuk ke .catch
    btn.innerHTML = "Berhasil ✓";
    setTimeout(() => {
      // Pastikan file success.html ada di direktori yang sama
      window.location.href = "success.html";
    }, 800);
  })
  .catch(err => {
    console.error("Error saat kirim data:", err);
    isSubmitting = false;
    btn.disabled = false;
    btn.innerHTML = originalBtnText;
    alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
  });
};
