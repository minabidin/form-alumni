const API_URL = "URL_WEB_APP_ANDA";

const prov = document.getElementById("provinsi");
const kab = document.getElementById("kabupaten");
const kec = document.getElementById("kecamatan");
const desa = document.getElementById("desa");

let dataWilayah = {};

// LOAD DATA
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    dataWilayah = data;

    Object.keys(dataWilayah).forEach(p => {
      prov.innerHTML += `<option value="${p}">${p}</option>`;
    });
  });

// PROVINSI → KABUPATEN
prov.onchange = () => {
  kab.innerHTML = '<option value="">Pilih Kabupaten</option>';
  kec.innerHTML = '<option value="">Pilih Kecamatan</option>';
  desa.innerHTML = '<option value="">Pilih Desa</option>';

  Object.keys(dataWilayah[prov.value] || {}).forEach(k => {
    kab.innerHTML += `<option value="${k}">${k}</option>`;
  });
};

// KABUPATEN → KECAMATAN
kab.onchange = () => {
  kec.innerHTML = '<option value="">Pilih Kecamatan</option>';
  desa.innerHTML = '<option value="">Pilih Desa</option>';

  Object.keys(dataWilayah[prov.value][kab.value] || {}).forEach(k => {
    kec.innerHTML += `<option value="${k}">${k}</option>`;
  });
};

// KECAMATAN → DESA
kec.onchange = () => {
  desa.innerHTML = '<option value="">Pilih Desa</option>';

  (dataWilayah[prov.value][kab.value][kec.value] || []).forEach(d => {
    desa.innerHTML += `<option value="${d}">${d}</option>`;
  });
};

// TAMAT LOGIC
document.getElementById("tamat").onchange = function () {
  document.getElementById("tahunTamat").classList.toggle("d-none", this.value !== "Ya");
};

// SUBMIT
document.getElementById("formData").onsubmit = function(e) {
  e.preventDefault();

  fetch(API_URL, {
    method: "POST",
    body: new FormData(this)
  })
  .then(res => res.text())
  .then(() => {
    document.getElementById("status").innerHTML =
      "<div class='alert alert-success'>Data berhasil dikirim</div>";
    this.reset();
  });
};