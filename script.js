const API_URL = "https://script.google.com/macros/s/AKfycbyqw9I7_DqciRcm1poVGJlVRgCr8hHs3v_J38rteG1aoMcNaAigZT0w96ghq8ioBB0/exec"; // ganti dengan URL Apps Script

const kab = document.getElementById("kabupaten");
const kec = document.getElementById("kecamatan");
const desa = document.getElementById("desa");
const tamat = document.getElementById("tamat");
const tahunTamat = document.getElementById("tahunTamat");
const form = document.getElementById("formData");
const statusDiv = document.getElementById("status");

let dataWilayah = {};

// LOAD DATA WILAYAH
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    dataWilayah = data;

    Object.keys(dataWilayah).forEach(k => {
      kab.innerHTML += `<option value="${k}">${k}</option>`;
    });
  })
  .catch(() => {
    statusDiv.innerHTML = "<div class='alert alert-danger'>Gagal load data wilayah</div>";
  });

// KABUPATEN → KECAMATAN
kab.onchange = () => {
  kec.innerHTML = '<option value="">Pilih Kecamatan</option>';
  desa.innerHTML = '<option value="">Pilih Desa</option>';

  Object.keys(dataWilayah[kab.value] || {}).forEach(k => {
    kec.innerHTML += `<option value="${k}">${k}</option>`;
  });
};

// KECAMATAN → DESA
kec.onchange = () => {
  desa.innerHTML = '<option value="">Pilih Desa</option>';

  (dataWilayah[kab.value]?.[kec.value] || []).forEach(d => {
    desa.innerHTML += `<option value="${d}">${d}</option>`;
  });
};

// TAMAT LOGIC
tamat.onchange = function () {
  tahunTamat.classList.toggle("d-none", this.value !== "Ya");
};

// SUBMIT FORM
form.onsubmit = function(e) {
  e.preventDefault();

  fetch(API_URL, {
    method: "POST",
    body: new FormData(form)
  })
  .then(res => res.text())
  .then(() => {
    statusDiv.innerHTML =
      "<div class='alert alert-success'>Data berhasil dikirim</div>";
    form.reset();
    tahunTamat.classList.add("d-none");
  })
  .catch(() => {
    statusDiv.innerHTML =
      "<div class='alert alert-danger'>Gagal mengirim data</div>";
  });
};
