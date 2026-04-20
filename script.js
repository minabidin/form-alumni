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
// LOAD DATA WILAYAH
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
    kab.disabled = false;
  })
  .catch(err => {
    console.error(err);
    kab.innerHTML = '<option>Gagal memuat</option>';
    alert("Gagal memuat data wilayah");
  });


// ===============================
// DROPDOWN
// ===============================
kab.onchange = () => {
  kec.innerHTML = '<option value="">Pilih Kecamatan</option>';
  desa.innerHTML = '<option value="">Pilih Desa</option>';

  const listKecamatan = dataWilayah[kab.value] || {};
  let options = '<option value="">Pilih Kecamatan</option>';

  Object.keys(listKecamatan).forEach(k => {
    options += `<option value="${k}">${k}</option>`;
  });

  kec.innerHTML = options;
};

kec.onchange = () => {
  const listDesa = dataWilayah[kab.value]?.[kec.value] || [];
  let options = '<option value="">Pilih Desa</option>';

  listDesa.forEach(d => {
    options += `<option value="${d}">${d}</option>`;
  });

  desa.innerHTML = options;
};


// ===============================
// GENERATE TAHUN
// ===============================
function generateTahun(select) {
  if (select.options.length > 1) return;

  const currentYear = new Date().getFullYear();
  let options = '<option value="">Pilih Tahun</option>';

  for (let i = currentYear; i >= 1980; i--) {
    options += `<option value="${i}">${i}</option>`;
  }

  select.innerHTML = options;
}


// ===============================
// LOGIC TAMAT
// ===============================
tamat.onchange = () => {

  if (tamat.value !== "") {
    generateTahun(tahunBoyong);
    tahunBoyongWrap.classList.remove("d-none");
    tahunBoyong.setAttribute("required", "required");
  } else {
    tahunBoyongWrap.classList.add("d-none");
    tahunBoyong.removeAttribute("required");
  }

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
// VALIDASI WA (FIXED)
// ===============================
function validWA(wa) {
  return /^(?:\+62|62|08)[0-9]{8,11}$/.test(wa);
}


// ===============================
// SUBMIT
// ===============================
form.onsubmit = function(e) {
  e.preventDefault();
  if (isSubmitting) return;

  // trim input
  form.nama.value = form.nama.value.trim();
  form.wa.value = form.wa.value.trim();

  if (!kab.value || !kec.value || !desa.value) {
    alert("Lengkapi wilayah!");
    return;
  }

  if (!validWA(form.wa.value)) {
    alert("Nomor WhatsApp tidak valid!");
    return;
  }

  const btn = form.querySelector("button[type='submit']");
  const originalText = btn.innerHTML;

  isSubmitting = true;
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Mengirim...`;

  fetch(API_URL, {
    method: "POST",
    body: new FormData(form)
  })
  .then(res => res.text())
  .then(res => {

    if (res === "success") {
      btn.innerHTML = "Berhasil ✓";

      const modal = new bootstrap.Modal(document.getElementById('successModal'));
      modal.show();

      form.reset();
    } else {
      throw new Error(res);
    }
  })
  .catch(err => {
    console.error(err);
    alert("Gagal mengirim data");

    isSubmitting = false;
    btn.disabled = false;
    btn.innerHTML = originalText;
  });
};
