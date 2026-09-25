function tlv(id: string, value: string) {
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function pixText(value: string, max: number) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .toUpperCase()
    .slice(0, max)
    .trim();
}

export function buildPixPayload(input: {
  key: string;
  name: string;
  city: string;
  amount: number;
  txid: string;
}) {
  const merchant = tlv("00", "BR.GOV.BCB.PIX") + tlv("01", input.key.trim());
  const reference = input.txid.replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "TRAVVIS";
  const body = [
    tlv("00", "01"),
    tlv("26", merchant),
    tlv("52", "0000"),
    tlv("53", "986"),
    tlv("54", input.amount.toFixed(2)),
    tlv("58", "BR"),
    tlv("59", pixText(input.name, 25) || "TRAVVIS"),
    tlv("60", pixText(input.city, 15) || "BRASIL"),
    tlv("62", tlv("05", reference)),
    "6304",
  ].join("");
  return body + crc16(body);
}
