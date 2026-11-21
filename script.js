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

seatForm.addEventListener("submit", function (event) {
 event.preventDefault();

 seatRequestInput.addEventListener("input", function () {
  setStatus("Nilai berubah. Tekan Cek Kursi untuk memeriksa.", "neutral");
});


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


function setStatus(message, type) {
 seatMessage.textContent = message;
 seatMessage.classList.remove("neutral", "success", "error");
 seatMessage.classList.add(type);
}
