// app/lib/colissimo.js
// Colissimo SLS Web Service — La Poste
// Doc officielle : https://www.colissimo.fr/pro/services/integration-api.html
//
// Pour activer : renseigner COLISSIMO_LOGIN et COLISSIMO_PASSWORD dans .env
// Les clés s'obtiennent depuis le portail Pro Colissimo (espace client La Poste).

const SLS_URL = "https://ws.colissimo.fr/sls-ws/SlsServiceWSRest/2.0/generateLabel";

export const COLISSIMO_CONFIGURED =
  Boolean(process.env.COLISSIMO_LOGIN) && Boolean(process.env.COLISSIMO_PASSWORD);

/**
 * Génère une étiquette Colissimo et retourne le numéro de suivi + URL du label PDF.
 *
 * @param {{
 *   orderId: string,
 *   method: "colissimo_domicile" | "colissimo_relais",
 *   addressee: { firstname: string, lastname: string, email: string, phone?: string, address: string, city: string, postalCode: string, countryCode?: string },
 *   weight?: number,
 *   relayId?: string,
 * }} params
 * @returns {Promise<{ trackingNumber: string, labelBase64: string | null }>}
 */
export async function generateLabel({ orderId, method, addressee, weight = 0.5, relayId }) {
  if (!COLISSIMO_CONFIGURED) {
    throw new Error("COLISSIMO_NON_CONFIGURE");
  }

  const depositDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const productCode = method === "colissimo_relais" ? "A2P" : "DOM";

  const body = {
    contractNumber: process.env.COLISSIMO_LOGIN,
    password:       process.env.COLISSIMO_PASSWORD,
    outputFormat: {
      x: 0,
      y: 0,
      outputPrintingType: "PDF_10x15_300dpi",
    },
    letter: {
      service: {
        productCode,
        depositDate,
        orderNumber: orderId,
      },
      parcel: {
        weight,
      },
      sender: {
        address: {
          companyName: process.env.COLISSIMO_SENDER_NAME  || "Pull-Lover",
          line2:       process.env.COLISSIMO_SENDER_LINE2 || "",
          city:        process.env.COLISSIMO_SENDER_CITY  || "",
          zipCode:     process.env.COLISSIMO_SENDER_ZIP   || "",
          countryCode: "FR",
          email:       process.env.COLISSIMO_SENDER_EMAIL || process.env.ADMIN_EMAIL,
        },
      },
      addressee: {
        address: {
          firstName:    addressee.firstname,
          lastName:     addressee.lastname,
          line2:        addressee.address,
          city:         addressee.city,
          zipCode:      addressee.postalCode || "",
          countryCode:  addressee.countryCode || "FR",
          email:        addressee.email,
          mobileNumber: addressee.phone || "",
        },
        ...(method === "colissimo_relais" && relayId
          ? { pickupLocationId: relayId }
          : {}),
      },
    },
  };

  const res = await fetch(SLS_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body:    JSON.stringify(body),
  });

  // L'API Colissimo retourne du multipart — on parse la première partie JSON
  const contentType = res.headers.get("content-type") || "";
  let json;

  if (contentType.includes("multipart")) {
    const text     = await res.text();
    const jsonPart = text.split("\r\n\r\n")[1]?.split("\r\n--")[0] || "";
    json = JSON.parse(jsonPart);
  } else {
    json = await res.json();
  }

  if (!res.ok || json.messages?.some((m) => m.type === "ERROR")) {
    const errMsg = json.messages?.find((m) => m.type === "ERROR")?.messageContent || "Erreur API Colissimo";
    throw new Error(errMsg);
  }

  const trackingNumber = json.labelV2Response?.parcelNumber;
  if (!trackingNumber) throw new Error("Numéro de suivi absent dans la réponse Colissimo");

  // Le PDF peut être en deuxième partie multipart ou dans labelV2Response.label
  const labelBase64 = json.labelV2Response?.label || null;

  return { trackingNumber, labelBase64 };
}

/**
 * URL de suivi public La Poste (pas besoin de clé API).
 */
export function getTrackingUrl(trackingNumber) {
  return `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`;
}
