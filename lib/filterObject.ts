export default function filterObject(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}