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


// ===============================
// 1. LOAD DATA WILAYAH
// ===============================
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
  .catch(err => {
    console.error("Gagal memuat data wilayah:", err);
    alert("Gagal memuat data wilayah");
  });


// ===============================
// 2. DROPDOWN KABUPATEN
// ===============================
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


// ===============================
// 3. DROPDOWN KECAMATAN
// ===============================
kec.onchange = () => {
  let options = '<option value="">Pilih Desa</option>';
  const listDesa = dataWilayah[kab.value]?.[kec.value] || [];

  listDesa.forEach(d => {
    options += `<option value="${d}">${d}</option>`;
  });

  desa.innerHTML = options;
};


// ===============================
// 4. GENERATE TAHUN
// ===============================
function generateTahun(select) {
  const currentYear = new Date().getFullYear();
  let options = '<option value="">Pilih Tahun</option>';

  for (let i = currentYear; i >= 1980; i--) {
    options += `<option value="${i}">${i}</option>`;
  }

  select.innerHTML = options;
}


// ===============================
// 5. LOGIC TAMAT
// ===============================
tamat.onchange = () => {

  // tampilkan tahun boyong
  if (tamat.value !== "") {
    if (tahunBoyong.options.length <= 1) generateTahun(tahunBoyong);

    tahunBoyongWrap.classList.remove("d-none");
    tahunBoyong.setAttribute("required", "required");
  } else {
    tahunBoyongWrap.classList.add("d-none");
    tahunBoyong.removeAttribute("required");
  }

  // tampilkan tahun tamat hanya jika Ya
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


// ===============================
// 6. VALIDASI WA
// ===============================
function validWA(wa) {
  return /^08[0-9]{8,11}$/.test(wa);
}


// ===============================
// 7. SUBMIT DATA (FINAL)
// ===============================
form.onsubmit = function(e) {
  e.preventDefault();

  if (isSubmitting) return;

  // validasi wilayah
  if (!kab.value || !kec.value || !desa.value) {
    alert("Harap lengkapi data wilayah!");
    return;
  }

  // validasi WA
  if (!validWA(form.wa.value)) {
    alert("Nomor WhatsApp tidak valid!");
    return;
  }

  const btn = form.querySelector("button[type='submit']");
  const originalText = btn.innerHTML;

  isSubmitting = true;
  btn.disabled = true;
  btn.innerHTML = "Mengirim... ⏳";

  fetch(API_URL, {
    method: "POST",
    body: new FormData(form)
  })
  .then(res => res.text())
  .then(res => {
    console.log("Response:", res);

    if (res === "success") {
      btn.innerHTML = "Berhasil ✓";

      setTimeout(() => {
        window.location.href = "success.html";
      }, 800);

    } else {
      throw new Error(res);
    }
  })
  .catch(err => {
    console.error("Error:", err);

    isSubmitting = false;
    btn.disabled = false;
    btn.innerHTML = originalText;

    alert("Gagal mengirim data: " + err.message);
  });
};
