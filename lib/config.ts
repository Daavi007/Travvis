export const storeConfig = {
  name: "Travvis Multimarcas",
  /** Só números, com DDI 55 e DDD. Exemplo: 5511912345678 */
  whatsapp: "",
  /** E-mail, telefone, CPF/CNPJ ou chave aleatória. */
  pixKey: "",
  pixMerchantName: "TRAVVIS MULTIMARCAS",
  pixCity: "BRASIL",
};

export function digits(value: string) {
  return value.replace(/\D/g, "");
}
