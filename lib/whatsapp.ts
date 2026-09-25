import { digits, storeConfig } from "./config";

export function whatsappHref(message: string) {
  const phone = digits(storeConfig.whatsapp);
  if (!phone) return "";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
