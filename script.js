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

// LOAD DATA (tanpa loading indicator)
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    dataWilayah = data;

    Object.keys(dataWilayah).forEach(k => {
      kab.innerHTML += `<option value="${k}">${k}</option>`;
    });
  });

// DROPDOWN WILAYAH
kab.onchange = () => {
  kec.innerHTML = '<option value="">Pilih Kecamatan</option>';
  desa.innerHTML = '<option value="">Pilih Desa</option>';

  Object.keys(dataWilayah[kab.value] || {}).forEach(k => {
    kec.innerHTML += `<option value="${k}">${k}</option>`;
  });
};

kec.onchange = () => {
  desa.innerHTML = '<option value="">Pilih Desa</option>';

  (dataWilayah[kab.value]?.[kec.value] || []).forEach(d => {
    desa.innerHTML += `<option value="${d}">${d}</option>`;
  });
};

// GENERATE TAHUN
function generateTahun(select) {
  const currentYear = new Date().getFullYear();
  select.innerHTML = '<option value="">Pilih Tahun</option>';

  for (let i = currentYear; i >= 1980; i--) {
    select.innerHTML += `<option value="${i}">${i}</option>`;
  }
}

// LOGIC TAMAT
tamat.onchange = () => {
  generateTahun(tahunBoyong);
  tahunBoyongWrap.classList.remove("d-none");

  if (tamat.value === "Ya") {
    generateTahun(tahunTamat);
    tahunTamatWrap.classList.remove("d-none");
  } else {
    tahunTamatWrap.classList.add("d-none");
  }
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
     // redirect ke halaman sukses
    setTimeout(() => {
        window.location.href = "success.html";
    }, 800);

    form.reset();
    tahunTamatWrap.classList.add("d-none");
    tahunBoyongWrap.classList.add("d-none");
  });
};
