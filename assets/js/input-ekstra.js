const API_URL = "https://script.google.com/macros/s/AKfycbyAhFcPIzUhbwcJnAB2pmhuoakyD2f_0JyHgk1HMzmXBLlFHpX148Y1mbYqZvL5VnfI/exec";

let tsRombel = null;
let tsSiswa  = null;
let tsEkskul = null;

async function api(action, data = {}) {
  const formData = new URLSearchParams();
  formData.append("action", action);

  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });

  const res = await fetch(API_URL, {
    method: "POST",
    body: formData
  });

  return await res.json();
}

async function onLoad() {
  const rombel = await api("getRombel");
  populateRombel(rombel);

  const ekskul = await api("getEkskul");
  populateEkskul(ekskul);
}

function populateRombel(list) {
  const el = document.getElementById("rombel");
  el.innerHTML = '<option value="" disabled selected>Pilih Kelas</option>';

  list.forEach(val => {
    el.innerHTML += `<option value="${val}">${val}</option>`;
  });

  tsRombel = new TomSelect(el, {
    plugins:["clear_button"]
  });

  tsRombel.on("change", async function(value){
    if(!value) return;
    showLoading(true);
    const siswa = await api("getSiswaByRombel", {rombel:value});
    showLoading(false);
    populateSiswa(siswa);
  });
}

function populateSiswa(list) {
  const el = document.getElementById("siswa");
  el.innerHTML = '<option value="" disabled selected>Pilih Siswa</option>';

  list.forEach(val => {
    el.innerHTML += `<option value="${val}">${val}</option>`;
  });

  tsSiswa = new TomSelect(el, {
    plugins:["clear_button"]
  });
}

function populateEkskul(list) {
  const el = document.getElementById("ekskul");
  el.innerHTML = '<option value="" disabled selected>Pilih Ekskul</option>';

  list.forEach(item => {
    el.innerHTML += `<option value="${item.id}">${item.nama}</option>`;
  });

  tsEkskul = new TomSelect(el, {
    plugins:["clear_button"]
  });
}

async function submitData() {
  const rombel = document.getElementById("rombel").value;
  const siswa = document.getElementById("siswa").value;
  const ekskulId = document.getElementById("ekskul").value;

  if(!rombel || !siswa || !ekskulId){
    Swal.fire("Data belum lengkap","","warning");
    return;
  }

  showLoading(true);

  const res = await api("inputData", {
    rombel,
    siswa,
    ekskulId
  });

  showLoading(false);

  if(res.status === "duplicate"){
    Swal.fire("Data Sudah Ada",res.message,"warning");
    return;
  }

  Swal.fire("Berhasil",res.message,"success");
  location.reload();
}

function showLoading(show){
  document.getElementById("loading").style.display = show ? "flex" : "none";
}
