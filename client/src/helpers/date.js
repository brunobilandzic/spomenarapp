export default function parseDate(date) {
  let dateObj = new Date(date);
  let parsed =
    padZeros(dateObj.getDate()) +
    "/" +
    padZeros(dateObj.getMonth() + 1) +
    "/" +
    dateObj.getFullYear().toString().slice(2) +
    " " +
    padZeros(dateObj.getHours()) +
    ":" +
    padZeros(dateObj.getMinutes());
  console.log(dateObj.toLocaleString());
  return parsed;
}

function padZeros(number) {
  if (number > 9) return number.toString();
  return "0" + number.toString();
}
