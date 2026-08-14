# Kapture Finance – Maya Collections Voicebot

## 1. Project Overview

Maya is an automated outbound Voice AI Collections Agent designed for Kapture Finance. The agent calls customers with overdue loan EMIs, verifies their identity, communicates the overdue amount only after successful authentication, and handles payment commitments or other customer requests.

## 2. Objectives

* Authenticate the customer before disclosing account or debt information.
* Inform the verified customer about the overdue EMI.
* Capture a Promise-to-Pay (PTP).
* Support payment-link delivery through a mock tool.
* Handle already-paid, hardship, dispute, wrong-person, and Do-Not-Call scenarios.
* Log the final call disposition.

## 3. Architecture

The voicebot uses the following flow:

Customer → Telephony/Vapi → Deepgram STT → GPT-4o Orchestrator → Mock Webhook Backend → TTS → Customer

Vapi manages the voice interaction and tool calling. The mock backend receives tool calls and returns JSON responses.

## 4. Customer Scenario

* Customer: Rahul Sharma
* Account ID: ACC-88392
* Loan Type: Personal Loan
* Overdue EMI: ₹8,499
* Days Past Due: 12

Debt information must not be disclosed until customer verification succeeds.

## 5. Authentication and Compliance

Maya follows a strict authentication gate.

Before successful verification, the agent must not disclose:

* Overdue status
* Loan information
* EMI amount
* Debt details

The `verify_customer` tool is used to verify the customer. Only a successful verification response allows the conversation to move to the collections stage.

The agent also supports Do-Not-Call requests and appropriate escalation for disputes and hardship cases.

## 6. Vapi Configuration

The intended Vapi configuration uses:

* Transcriber: Deepgram Nova-2
* LLM: OpenAI GPT-4o or GPT-4o-mini
* Voice: ElevenLabs or Cartesia
* Temperature: 0.1
* Tools connected to the mock webhook backend

## 7. Tools

The voicebot uses tools for:

### verify_customer

Verifies the customer's identity before account disclosure.

### log_promise_to_pay

Records the customer's agreed payment date and amount.

### send_payment_link

Triggers a mock payment link through SMS or WhatsApp.

### mark_disposition

Records the final outcome of the call.

## 8. Mock Backend

The backend is implemented using Node.js and Express.

The main webhook endpoint is:

`POST /webhook`

It receives Vapi tool calls and returns JSON responses for the configured tools.

## 9. Conversation Flow

1. Maya greets the customer.
2. Maya confirms the intended customer.
3. Maya requests the verification code.
4. `verify_customer` is called.
5. If verification succeeds, Maya can disclose the overdue EMI.
6. Maya asks when the customer can make the payment.
7. If the customer agrees to pay, Maya captures the date and amount.
8. `log_promise_to_pay` records the commitment.
9. `send_payment_link` can be triggered.
10. Maya confirms the action and closes the call.

## 10. Edge Cases

The agent is designed to handle:

* Wrong person
* Already paid
* Financial hardship
* Debt dispute
* Do-Not-Call request
* No response
* Verification failure

These cases should be routed without disclosing protected account information before authentication.

## 11. Testing

The main validation scenarios include:

### Happy Path

Greeting → Identity Verification → Successful Authentication → Debt Disclosure → PTP → Payment Link → Call Close

### Already Paid

Authentication → Customer reports previous payment → Payment details collected → Appropriate disposition recorded

### Do-Not-Call

Customer requests no further calls → `DO_NOT_CALL` disposition → Call ends

### Authentication Guardrail

The agent must not reveal debt information before successful verification.

## 12. Debugging / Validation Notes

During testing, the conversation flow and tool execution were checked using Vapi calls. Verification and Promise-to-Pay tool flows were tested with the mock backend.

The main validation focus was ensuring that tool calls return successfully and that account information is disclosed only after verification.

## 13. Future Improvements

* Connect the mock backend to a real loan-management system.
* Add production-grade authentication and authorization.
* Add persistent call and disposition storage.
* Add monitoring dashboards for PTP rate, containment rate, and first-call resolution.
* Improve multilingual Hindi/Hinglish support.
* Add production payment-link integration.
* Add stronger automated compliance and regression testing.

## 14. Project Files

text
kapture-collections-voicebot
├── README.md
├── server.js
├── package.json
├── package-lock.json
└── system_prompt.txt


## 15. Disclaimer

This project uses mock customer data and a mock backend for assignment and demonstration purposes. It is not connected to a production lending or payment system.
