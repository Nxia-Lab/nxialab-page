const nodemailer = require("nodemailer");

function sendJson(res, statusCode, payload) {
  res.status(statusCode).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const body = await readJsonBody(req);
  const { name, email, message } = body || {};
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return sendJson(res, 400, { error: "Faltan campos obligatorios." });
  }

  const user = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const toEmail = process.env.CONTACT_TO_EMAIL || user;

  if (!user || !appPassword || !toEmail) {
    return sendJson(res, 500, {
      error: "Faltan variables de entorno de Gmail.",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass: appPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `"nxia-lab web" <${user}>`,
      to: toEmail,
      replyTo: cleanEmail,
      subject: `Nuevo contacto desde nxia-lab: ${cleanName}`,
      text: [
        `Nombre: ${cleanName}`,
        `Email: ${cleanEmail}`,
        "",
        cleanMessage,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin: 0 0 16px;">Nuevo contacto desde nxia-lab</h2>
          <p style="margin: 0 0 8px;"><strong>Nombre:</strong> ${escapeHtml(cleanName)}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
          <p style="margin: 16px 0 8px;"><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(cleanMessage)}</p>
        </div>
      `,
    });

    return sendJson(res, 200, { ok: true });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return sendJson(res, 500, {
      error: "No se pudo enviar el mensaje.",
    });
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      resolve(req.body);
      return;
    }

    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}
