export function toMoney(rawNumber) {
  let number = toNumber(rawNumber)
  return parseInt(number).toLocaleString('id-ID')
}

export function toNumber(number) {
  return number.toString().replace(/\./g, "")
}
