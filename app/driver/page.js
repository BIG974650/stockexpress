const queryParams = new URLSearchParams({
  date: new Date().toLocaleString(),
  driver,
  plate,
  mileage,
  rentalType,
  amount
});

await fetch(`https://script.google.com/macros/s/.../exec?${queryParams.toString()}`);