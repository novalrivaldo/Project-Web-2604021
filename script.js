console.log("JavaScript Pertemuan 6 aktif");

const eventName = "TechStarter Day";
const maxSeats = 40;
let registered = 27;

console.log(eventName);
console.log(maxSeats);
console.log(registered);

function checkSeats(requested) {
  const remaining = maxSeats - registered;

  if (!Number.isInteger(requested) || requested <= 0) {
    return "Masukkan jumlah kursi berupa bilangan bulat lebih dari 0.";
  }

  if (requested <= remaining) {
    return `Tersedia. Sisa saat ini ${remaining} kursi.`;
  }

  return `Tidak cukup. Hanya tersisa ${remaining} kursi.`;
}

const checkSeatBtn = document.querySelector("#checkSeatBtn");

checkSeatBtn.addEventListener("click", function () {
  const requested = Number(prompt("Berapa kursi yang ingin dicek?"));
  const result = checkSeats(requested);

  console.log(result);
  alert(result);
});

function registerSeats(requested) {
  const remaining = maxSeats - registered;

  if (!Number.isInteger(requested) || requested <= 0) {
    return "Input tidak valid.";
  }

  if (requested > remaining) {
    return `Gagal. Hanya tersisa ${remaining} kursi.`;
  }

  registered = registered + requested;
  return `Berhasil. Total terdaftar sekarang ${registered}.`;
}

const seatForm = document.querySelector("#seatForm");
const seatRequestInput = document.querySelector("#seatRequest");
const seatMessage = document.querySelector("#seatMessage");

console.log(seatForm);
console.log(seatRequestInput);
console.log(seatMessage);

function setStatus(message, type) {
  seatMessage.textContent = message;
  seatMessage.classList.remove("neutral", "success", "error");
  seatMessage.classList.add(type);
}

seatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const requested = Number(seatRequestInput.value);
  const remaining = maxSeats - registered;

  if (!Number.isInteger(requested) || requested <= 0) {
    setStatus("Masukkan jumlah kursi bulat lebih dari 0.", "error");
    return;
  }

  if (requested <= remaining) {
    setStatus(`Tersedia. Masih ada ${remaining} kursi.`, "success");
  } else {
    setStatus(`Tidak cukup. Sisa kursi hanya ${remaining}.`, "error");
  }
});

seatRequestInput.addEventListener("input", function () {
  setStatus("Nilai berubah. Tekan Cek Kursi untuk memeriksa.", "neutral");
});

const STORAGE_KEY = "techstarter.registrations.v1";

function loadRegistrations() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Data localStorage tidak valid:", error);
    return [];
  }
}

function saveRegistrations() {
  const json = JSON.stringify(registrations);
  localStorage.setItem(STORAGE_KEY, json);
}

let registrations = loadRegistrations();
let editingId = null;

const registrationList = document.querySelector("#registrationList");
const registrationSummary = document.querySelector("#registrationSummary");
const registrationForm = document.querySelector("#registrationForm");
const participantNameInput = document.querySelector("#participantName");
const newSeatInput = document.querySelector("#seatRequestNew");

function getUsedSeats(excludeId = null) {
  return registrations
    .filter((item) => item.id !== excludeId)
    .reduce((total, item) => total + item.seats, 0);
}

function renderRegistrations() {
  registrationList.replaceChildren();

  for (const item of registrations) {
    const li = document.createElement("li");
    li.textContent = `${item.name} : ${item.seats} kursi`;

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      startEdit(item);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", function () {
      deleteRegistration(item.id);
    });

    li.append(" ", editButton, " ", deleteButton);
    registrationList.append(li);
  }

  const used = getUsedSeats();
  registrationSummary.textContent =
    `${registrations.length} registrasi • ${used}/${maxSeats} kursi terpakai • sisa ${maxSeats - used}`;
}

function deleteRegistration(id) {
  registrations = registrations.filter((item) => item.id !== id);
  if (editingId === id) {
    editingId = null;
    registrationForm.reset();
  }
  saveRegistrations();
  renderRegistrations();
  setStatus("Registrasi dihapus.", "success");
}

function startEdit(item) {
  editingId = item.id;
  participantNameInput.value = item.name;
  newSeatInput.value = item.seats;
  participantNameInput.focus();
  setStatus("Mode edit aktif. Ubah data lalu tekan Simpan.", "neutral");
}

registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = participantNameInput.value.trim();
  const seats = Number(newSeatInput.value);
  const usedWithoutCurrent = getUsedSeats(editingId);

  if (name.length < 2) {
    setStatus("Nama minimal 2 karakter.", "error");
    return;
  }

  if (!Number.isInteger(seats) || seats <= 0) {
    setStatus("Jumlah kursi harus bilangan bulat positif.", "error");
    return;
  }

  if (usedWithoutCurrent + seats > maxSeats) {
    setStatus("Kursi tidak mencukupi.", "error");
    return;
  }

  if (editingId === null) {
    registrations.push({ id: Date.now(), name, seats });
    setStatus("Registrasi ditambahkan.", "success");
  } else {
    const index = registrations.findIndex((item) => item.id === editingId);
    if (index !== -1) {
      registrations[index] = { ...registrations[index], name, seats };
    }
    editingId = null;
    setStatus("Registrasi diperbarui.", "success");
  }

  saveRegistrations();
  renderRegistrations();
  registrationForm.reset();
});

renderRegistrations();