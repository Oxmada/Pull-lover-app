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
        <td style="padding:12px 0;font-size:14px;color:#475569">${item.product?.name || "Produit"}</td>
        <td style="padding:12px 0;font-size:14px;color:#475569;text-align:center">${item.quantity}</td>
        <td style="padding:12px 0;font-size:14px;color:#475569;text-align:right;font-weight:600">${item.product?.price ? Number(item.product.price).toLocaleString("fr-FR") + " Ar" : "-"}</td>
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