export default function truncate(text, trunc) {
  let end = text.length >= trunc ? "..." : "";
  return text.slice(0, trunc) + end;
}
