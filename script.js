const API_URL = "https://script.google.com/macros/s/AKfycbyqw9I7_DqciRcm1poVGJlVRgCr8hHs3v_J38rteG1aoMcNaAigZT0w96ghq8ioBB0/exec";

const kab = document.getElementById("kabupaten");
const kec = document.getElementById("kecamatan");
const desa = document.getElementById("desa");

let dataWilayah = {};

// LOAD DATA
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    dataWilayah = data;

    Object.keys(dataWilayah).forEach(k => {
      kab.innerHTML += `<option value="${k}">${k}</option>`;
    });
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

  (dataWilayah[kab.value][kec.value] || []).forEach(d => {
    desa.innerHTML += `<option value="${d}">${d}</option>`;
  });
};
