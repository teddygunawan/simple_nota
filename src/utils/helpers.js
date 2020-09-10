export function toNumber(number) {
  return number.toString().replace(/\./g, "")
}

export function toMoney(rawNumber) {
  let number = toNumber(rawNumber)
  number = parseInt(number, 10) || ""
  return number.toLocaleString("id-ID")
}
