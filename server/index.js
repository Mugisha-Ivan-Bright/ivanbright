import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()
app.use(cors())
app.use(express.json())

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

app.get('/api/time', (_req, res) => {
  res.json({ timestamp: Date.now() })
})

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields required' })
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: 'mugishaivanbright250@gmail.com',
      subject: `Portfolio Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #fff; padding: 32px; max-width: 600px;">
          <div style="border-bottom: 1px solid #00FF87; padding-bottom: 12px; margin-bottom: 20px;">
            <span style="color: #00FF87; font-size: 13px;">new message from portfolio</span>
          </div>
          <table style="font-size: 13px; line-height: 1.8; width: 100%;">
            <tr><td style="color: #666; width: 80px;">name</td><td style="color: #fff;">${name}</td></tr>
            <tr><td style="color: #666;">email</td><td style="color: #00FF87;">${email}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #111; border-left: 3px solid #00FF87; font-size: 13px; line-height: 1.6; color: #ccc; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    })
    res.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err)
    res.status(500).json({ success: false, error: 'Failed to send' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`> portfolio server running on port ${PORT}`)
})
