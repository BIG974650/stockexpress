const queryParams = new URLSearchParams({
  date: new Date().toLocaleString(),
  driver,
  plate,
  mileage,
  rentalType,
  amount
});

await fetch(`https://script.google.com/macros/s/AKfycbz3toxMG7GneWerN16YxlhKV-0R1PV_FmeV4aVEW.../exec?${queryParams.toString()}`);