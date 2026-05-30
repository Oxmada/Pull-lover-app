import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import { sendEmail } from "@/app/lib/mailer";
import { getOrderConfirmationEmailTemplate } from "@/app/lib/emailTemplates";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // 1. Récupérer la commande avec les détails des produits
    const order = await Order.findById(id).populate("products.product");

    if (!order) {
      return NextResponse.json({ success: false, message: "Commande non trouvée" }, { status: 404 });
    }

    // 2. Préparer les variables (Logique identique à ton fichier de création de commande)
    const orderNumber = order._id.toString().slice(-8).toUpperCase();
    const { customer, products, total, payment, delivery } = order;

    const paymentLabels = {
      cash: "💵 Espèces à la livraison",
      mobile_money: "📱 Mobile Money",
      card: "💳 Carte bancaire",
      bank_transfer: "🏦 Virement bancaire",
    };

    const deliveryLabels = {
      standard: "🚚 Livraison standard",
      express: "⚡ Livraison express",
      pickup: "🏪 Retrait en magasin",
    };

    // Liste des produits formatée pour le HTML
    const productListHtml = products.map((item) => `
      <tr style="border-bottom:1px solid #e2e8f0">
        <td style="padding:12px 8px 12px 0;vertical-align:top">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              ${item.product?.image ? `<td style="padding-right:12px;vertical-align:top">
                <img src="${item.product.image}" width="48" height="60" alt="${item.product?.name || ""}" style="display:block;border-radius:4px;object-fit:cover;border:1px solid #e2e8f0">
              </td>` : ""}
              <td style="vertical-align:top">
                <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a">${item.product?.name || "Produit"}</p>
                ${item.size ? `<p style="margin:3px 0 0;font-size:12px;color:#94a3b8">Taille : ${item.size}</p>` : ""}
              </td>
            </tr>
          </table>
        </td>
        <td style="padding:12px 0;font-size:14px;color:#475569;text-align:center;vertical-align:top">${item.quantity}</td>
        <td style="padding:12px 0;font-size:14px;color:#475569;text-align:right;font-weight:600;vertical-align:top">${item.product?.price ? Number(item.product.price).toLocaleString("fr-FR") + " €" : "-"}</td>
      </tr>
    `).join("");

    const orderDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("fr-FR", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        })
      : new Date().toLocaleDateString("fr-FR", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
        });

    const clientEmailHtml = getOrderConfirmationEmailTemplate({
      firstname: customer.firstname,
      orderNumber,
      orderDate,
      productListHtml,
      address: customer.address,
      city: customer.city,
      deliveryLabel: deliveryLabels[delivery] || delivery,
      paymentLabel: paymentLabels[payment] || payment,
      total,
    });

    // 4. Envoi de l'email
    await sendEmail({
      to: customer.email,
      subject: `Récapitulatif de votre commande #${orderNumber} — Pull-Lover`,
      html: clientEmailHtml,
    });

    return NextResponse.json({ success: true, message: "Email renvoyé avec succès" });

  } catch (error) {
    console.error("RESEND ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}