import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  })
}

// Generate verification token
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// Create HTML email template
const createVerificationEmailHTML = (name: string, verificationUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color:rgb(18, 68, 174);
                margin-bottom: 10px;
            }
            .title {
                color: #1f2937;
                font-size: 24px;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 30px;
            }
            .button {
                display: inline-block;
                background-color: #2563eb;
                color: #ffffff;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }
            .button:hover {
                background-color: #1d4ed8;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
            .warning {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #92400e;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">DevCollab</div>
                <h1 class="title">Verify Your Email Address</h1>
            </div>
            
            <div class="content">
                <p>Hello <strong>${name}</strong>,</p>
                
                <p>Thank you for registering with DevCollab! To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <div class="warning">
                    <strong>Important:</strong> This verification link will expire in 24 hours for security reasons.
                </div>
                
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
                
                <p>If you didn't create an account with DevCollab, you can safely ignore this email.</p>
            </div>
            
            <div class="footer">
                <p>This is an automated email from DevCollab. Please do not reply to this message.</p>
                <p>&copy; 2024 DevCollab. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
}

// Send verification email
export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter()
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
    
    const mailOptions = {
      from: `"DevCollab" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address - DevCollab',
      html: createVerificationEmailHTML(name, verificationUrl),
    }
    
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

// Send welcome email after verification
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  try {
    const transporter = createTransporter()
    
    const welcomeHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to DevCollab</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              .container {
                  background-color: #ffffff;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  margin-bottom: 30px;
              }
              .logo {
                  font-size: 28px;
                  font-weight: bold;
                  color: #10b981;
                  margin-bottom: 10px;
              }
              .title {
                  color: #1f2937;
                  font-size: 24px;
                  margin-bottom: 20px;
              }
              .content {
                  margin-bottom: 30px;
              }
              .button {
                  display: inline-block;
                  background-color: #10b981;
                  color: #ffffff;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  color: #6b7280;
                  font-size: 14px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">DevCollab</div>
                  <h1 class="title">Welcome to DevCollab! 🎉</h1>
              </div>
              
              <div class="content">
                  <p>Hello <strong>${name}</strong>,</p>
                  
                  <p>🎉 Congratulations! Your email has been successfully verified and your DevCollab account is now active.</p>
                  
                  <p>You can now:</p>
                  <ul>
                      <li>Access all features of DevCollab</li>
                      <li>Collaborate with other developers</li>
                      <li>Create and manage your projects</li>
                      <li>Connect with the developer community</li>
                  </ul>
                  
                  <div style="text-align: center;">
                      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
                  </div>
                  
                  <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                  
                  <p>Happy coding! 🚀</p>
              </div>
              
              <div class="footer">
                  <p>This is an automated email from DevCollab. Please do not reply to this message.</p>
                  <p>&copy; 2024 DevCollab. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `
    
    const mailOptions = {
      from: `"DevCollab" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to DevCollab - Your Account is Verified!',
      html: welcomeHTML,
    }
    
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return false
  }
} 