import { storeConfig } from "@/lib/config";

export function SetupBanner() {
  if (storeConfig.whatsapp) return null;
  return (
    <p className="bg-[#011C2F] px-5 py-2 text-center text-sm text-cream/80">
      Falta o WhatsApp da loja para os pedidos chegarem até você. Coloque o número em lib/config.ts.
    </p>
  );
}
