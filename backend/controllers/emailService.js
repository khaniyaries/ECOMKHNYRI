import nodemailer from 'nodemailer'
import emailConfig from '../utils/email.js'
import { createOrderStatusEmail } from '../templates/orderStatusTemplate.js'

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport(emailConfig.smtp)
        console.log('Email service initialized with config:', {
          host: emailConfig.smtp.host,
          port: emailConfig.smtp.port,
          user: emailConfig.smtp.auth.user
        })
      }
    

      async sendOrderStatusUpdate(order, newStatus) {
        console.log('Preparing email for:', {
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          orderId: order._id,
          status: newStatus
        })
    
        const emailContent = createOrderStatusEmail(
          order.customer.name,
          order._id,
          newStatus
        )
    
        const mailOptions = {
          from: emailConfig.from,
          to: order.customer.email,
          subject: `Order Status Update - ${newStatus.toUpperCase()}`,
          html: emailContent
        }
    
        console.log('Sending email with options:', mailOptions)
    
        try {
          const info = await this.transporter.sendMail(mailOptions)
          console.log('Email sent successfully:', info)
          return info
        } catch (error) {
          console.error('Email sending failed:', error)
          throw error
        }
      }

      async sendOTPEmail(email, otp) {
        const mailOptions = {
          from: emailConfig.from,
          to: email,
          subject: 'Verify Your Email',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Email Verification</h2>
              <p>Your verification code is: <strong>${otp}</strong></p>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
          `
        }
        return this.transporter.sendMail(mailOptions)
      }

      async sendPasswordResetOTP(email, otp) {
        const mailOptions = {
          from: emailConfig.from,
          to: email,
          subject: 'Reset Your Password',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Password Reset Request</h2>
              <p>Your password reset code is: <strong>${otp}</strong></p>
              <p>This code will expire in 5 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
          `
        }
        return this.transporter.sendMail(mailOptions)
      }
      
}

export const emailService = new EmailService()
