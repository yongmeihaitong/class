import nodemailer from "nodemailer"
import { VerificationEmailTemplate, WelcomeEmailTemplate } from "./email-templates"
import { emailQueue } from "./queue"

interface EmailOptions {
  to: string
  subject: string
  html: string
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production", // use TLS in production
})

async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    console.log(`Email sent successfully to ${to}`)
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error("Failed to send email")
  }
}

export async function queueVerificationEmail(name: string, email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`
  const { html } = VerificationEmailTemplate({ name, verificationLink })

  await emailQueue.add("verification", {
    to: email,
    subject: "Verify your email address",
    html,
  })
}

export async function queueWelcomeEmail(name: string, email: string) {
  const { html } = WelcomeEmailTemplate({ name })

  await emailQueue.add("welcome", {
    to: email,
    subject: "Welcome to LearnHub",
    html,
  })
}

// Export the sendEmail function for use in the worker
export { sendEmail }

