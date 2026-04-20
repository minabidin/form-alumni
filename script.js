const API_URL = "https://script.google.com/macros/s/AKfycbyqw9I7_DqciRcm1poVGJlVRgCr8hHs3v_J38rteG1aoMcNaAigZT0w96ghq8ioBB0/exec";

const kab = document.getElementById("kabupaten");
const kec = document.getElementById("kecamatan");
const desa = document.getElementById("desa");
const tamat = document.getElementById("tamat");
const tahunTamatWrap = document.getElementById("tahunTamatWrap");
const form = document.getElementById("formData");
const loading = document.getElementById("loading");

let dataWilayah = {};

// LOAD DATA
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    dataWilayah = data;

    Object.keys(dataWilayah).forEach(k => {
      kab.innerHTML += `<option value="${k}">${k}</option>`;
    });

    loading.style.display = "none";
  });

// DROPDOWN
kab.onchange = () => {
  kec.innerHTML = '<option>Pilih Kecamatan</option>';
  desa.innerHTML = '<option>Pilih Desa</option>';

  Object.keys(dataWilayah[kab.value] || {}).forEach(k => {
    kec.innerHTML += `<option value="${k}">${k}</option>`;
  });
};

kec.onchange = () => {
  desa.innerHTML = '<option>Pilih Desa</option>';

  (dataWilayah[kab.value]?.[kec.value] || []).forEach(d => {
    desa.innerHTML += `<option value="${d}">${d}</option>`;
  });
};

// TAMAT
tamat.onchange = () => {
  tahunTamatWrap.classList.toggle("d-none", tamat.value !== "Ya");
};

// VALIDASI WA
function validWA(wa) {
  return /^08[0-9]{8,11}$/.test(wa);
}

// SUBMIT
form.onsubmit = function(e) {
  e.preventDefault();

  if (!validWA(form.wa.value)) {
    alert("Nomor WA tidak valid");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: new FormData(form)
  })
  .then(() => {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();

    form.reset();
    tahunTamatWrap.classList.add("d-none");
  });
};
