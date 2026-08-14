const express = require("express");

const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
    const { message } = req.body;

    if (!message || message.type !== "tool-calls") {
        return res.status(200).json({
            status: "acknowledged"
        });
    }

    const toolCall = message.toolCalls[0];

    const toolName = toolCall.function.name;
    const args = toolCall.function.arguments;
    const callId = toolCall.id;

    console.log("Tool called:", toolName);
    console.log("Arguments:", args);

    let result;

    switch (toolName) {

        case "verify_customer":

            if (
                args.verification_code === "1234" ||
                args.verification_code === "1995"
            ) {
            result = {
    verified: true,
    verification_status: "VERIFIED",
    customer_name: "Rahul Sharma",
    overdue_amount: 8499,
    days_past_due: 12,
    message: "VERIFIED. Customer identity is confirmed. The agent may now disclose the overdue EMI amount of ₹8,499."
            };
            } else {
                result = {
                    verified: false,
                    message: "Verification failed."
                };
            }

            break;

        case "log_promise_to_pay":

            result = {
                success: true,
                ptp_id: "PTP-" + Math.floor(1000 + Math.random() * 9000),
                date: args.ptp_date,
                amount: args.amount
            };

            break;

        case "send_payment_link":

            result = {
                success: true,
                channel: args.channel,
                message: "Payment link sent successfully."
            };

            break;

        case "mark_disposition":

            result = {
                success: true,
                status: args.status,
                message: "Call disposition recorded successfully."
            };

            break;

        case "escalate_to_agent":

            result = {
                success: true,
                message: "Call escalated to a human agent.",
                reason: args.reason
            };

            break;

        default:

            result = {
                success: false,
                message: "Unknown tool."
            };
    }

    res.status(200).json({
        results: [
            {
                toolCallId: callId,
                result: JSON.stringify(result)
            }
        ]
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Kapture Mock Server running on port ${PORT}`);
});
