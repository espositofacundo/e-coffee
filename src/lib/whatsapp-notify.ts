import { store } from "@/config/store";
import { currencyFormat } from "@/utils/currency";
import { formatOrderNumber } from "@/utils/order-status";

interface OrderNotice {
  id: string;
  number: number;
  firstName: string;
  phone: string;
  address: string;
  total: number;
}

// Aviso de pedido nuevo por WhatsApp (Cloud API de Meta). Como el mensaje lo
// inicia el negocio, Meta exige una plantilla aprobada: acá solo se mandan los
// valores que van en {{1}}…{{6}}.
//
// Variables de entorno (si falta alguna, no se manda nada y el pedido sigue igual):
//   WHATSAPP_TOKEN            token de la app de Meta
//   WHATSAPP_PHONE_NUMBER_ID  id del número que envía
//   WHATSAPP_TO               números que reciben, separados por coma (5492236866310,…)
//   WHATSAPP_TEMPLATE         nombre de la plantilla (por defecto: nuevo_pedido)
//   WHATSAPP_TEMPLATE_LANG    idioma de la plantilla (por defecto: es_AR)
export const notifyNewOrder = async (order: OrderNotice) => {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipients = (process.env.WHATSAPP_TO ?? "")
    .split(",")
    .map((number) => number.replace(/[^\d]/g, ""))
    .filter(Boolean);

  if (!token || !phoneNumberId || recipients.length === 0) {
    return { ok: false, skipped: true };
  }

  const apiUrl = process.env.WHATSAPP_API_URL ?? "https://graph.facebook.com/v21.0";
  const baseUrl = process.env.SITE_URL ?? "https://timonypumba.vercel.app";

  // Los valores no pueden tener saltos de línea ni tabs (los rechaza Meta).
  const values = [
    formatOrderNumber(order.number),
    order.firstName,
    order.phone,
    order.address,
    currencyFormat(order.total),
    `${baseUrl}/orders/${order.id}`,
  ].map((value) => String(value).replace(/\s+/g, " ").trim());

  const results = await Promise.all(
    recipients.map(async (to) => {
      try {
        const response = await fetch(`${apiUrl}/${phoneNumberId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "template",
            template: {
              name: process.env.WHATSAPP_TEMPLATE ?? "nuevo_pedido",
              language: { code: process.env.WHATSAPP_TEMPLATE_LANG ?? "es_AR" },
              components: [
                {
                  type: "body",
                  parameters: values.map((text) => ({ type: "text", text })),
                },
              ],
            },
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
          console.log(`WhatsApp ${to}: ${response.status} ${await response.text()}`);
          return false;
        }
        return true;
      } catch (error) {
        console.log(`WhatsApp ${to}:`, error);
        return false;
      }
    })
  );

  return { ok: results.some(Boolean), sent: results.filter(Boolean).length };
};

export const whatsappRecipients = () =>
  (process.env.WHATSAPP_TO ?? "")
    .split(",")
    .map((number) => number.replace(/[^\d]/g, ""))
    .filter(Boolean)
    .map((number) => store.contacts.find((c) => c.whatsapp === number)?.name ?? number);
