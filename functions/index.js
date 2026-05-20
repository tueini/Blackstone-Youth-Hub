const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const sgMail = require("@sendgrid/mail");
const { logger } = require("firebase-functions");

exports.sendFeedbackEmail = onDocumentCreated(
    {
        document: "site_feedback/{docId}",
        secrets: ["SENDGRID_API_KEY"],
        serviceAccount: "blackstoneward-b861c@appspot.gserviceaccount.com"
    },
    async (event) => {
        const snap = event.data;
        if (!snap) {
            logger.info("No data associated with the event.");
            return;
        }

        const data = snap.data();
        const { Name, Category, Message } = data || {};

        if (!Name || !Message) {
            logger.error("Missing critical submission logic tracking.");
            return;
        }

        sgMail.setApiKey((process.env.SENDGRID_API_KEY || "").trim());

        const msg = {
            to: "duanepharris@gmail.com",
            from: { email: "hub@blackstoneward.org", name: "Blackstone Ward Hub" },
            replyTo: "duanepharris@gmail.com",
            subject: `[Hub Feedback] ${Category || 'Suggestion'} from ${Name}`,
            text: `Name: ${Name}\nCategory: ${Category || 'Suggestion'}\n\nMessage:\n${Message}`,
            html: `
                <div style="font-family: sans-serif; background-color: #f8fafc; padding: 20px;">
                    <div style="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <h2 style="color: #334155; margin-bottom: 20px;">New Hub Feedback</h2>
                        <p><strong>Name:</strong> ${Name}</p>
                        <p><strong>Category:</strong> ${Category || 'Suggestion'}</p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="white-space: pre-wrap; color: #475569; line-height: 1.6;">${Message}</p>
                    </div>
                </div>
            `,
        };

        try {
            await sgMail.send(msg);
            logger.info(`Feedback smoothly routed implicitly for logic structure ${Name} directly!`);
        } catch (error) {
            logger.error("Failed to route explicitly over SMTP SG Logic parameter correctly:", error);
            if (error.response) {
                logger.error(error.response.body);
            }
        }
    }
);
