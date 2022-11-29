export default function filterObject(object): any {
  return Object.keys(object).forEach((key) =>
    object[key] ? null : delete object[key]
  );
}
