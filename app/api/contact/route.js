import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/mailer";

export async function POST(req) {
  try {
    const { nom, mail, message } = await req.json();

    if (!nom || !mail || !message) {
      return NextResponse.json({ success: false, message: "Champs manquants" }, { status: 400 });
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Nouveau message de contact — ${nom}`,
      html: `
        <div style="font-family:'Montserrat',sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px">
          <h2 style="margin:0 0 24px;font-size:20px;color:#0f172a">Nouveau message de contact</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;font-size:13px;color:#64748b;width:100px">Nom</td>
              <td style="padding:10px 0;font-size:14px;color:#0f172a;font-weight:600">${nom}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-size:13px;color:#64748b">Email</td>
              <td style="padding:10px 0;font-size:14px;color:#0f172a">
                <a href="mailto:${mail}" style="color:#6366f1">${mail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;font-size:13px;color:#64748b;vertical-align:top">Message</td>
              <td style="padding:10px 0;font-size:14px;color:#0f172a;line-height:1.6">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
