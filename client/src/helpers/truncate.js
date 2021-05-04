export default function truncate(text, trunc) {
  let end = text.length >= trunc ? "..." : "";
  console.log(end);
  return text.slice(0, trunc) + end;
}
