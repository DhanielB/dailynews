export default function filterObject(object) {
  return Object.keys(object).forEach((key) =>
    object[key] === undefined ? delete object[key] : null
  );
}
