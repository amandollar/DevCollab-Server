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

// Create beautiful verification email template
const createVerificationEmailHTML = (name: string, verificationUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - DevCollab</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #1f2937;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                min-height: 100vh;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            
            .logo {
                font-size: 32px;
                font-weight: 800;
                color: #ffffff;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                position: relative;
                z-index: 1;
            }
            
            .header-title {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                position: relative;
                z-index: 1;
            }
            
            .header-subtitle {
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
                font-weight: 400;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 40px 30px;
                background: #ffffff;
            }
            
            .greeting {
                font-size: 18px;
                color: #374151;
                margin-bottom: 20px;
            }
            
            .greeting strong {
                color: #1f2937;
                font-weight: 600;
            }
            
            .description {
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            
            .cta-section {
                text-align: center;
                margin: 30px 0;
            }
            
            .verify-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                padding: 16px 40px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
            }
            
            .verify-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
            }
            
            .warning-box {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border: 1px solid #f59e0b;
                border-radius: 12px;
                padding: 20px;
                margin: 30px 0;
                position: relative;
                overflow: hidden;
            }
            
            .warning-box::before {
                content: '⚠️';
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 20px;
            }
            
            .warning-title {
                color: #92400e;
                font-weight: 600;
                margin-bottom: 8px;
                font-size: 16px;
            }
            
            .warning-text {
                color: #92400e;
                font-size: 14px;
                line-height: 1.6;
            }
            
            .link-fallback {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
                word-break: break-all;
            }
            
            .link-fallback a {
                color: #667eea;
                text-decoration: none;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                font-size: 12px;
            }
            
            .features {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
            }
            
            .features h3 {
                color: #1f2937;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .features ul {
                list-style: none;
                padding: 0;
            }
            
            .features li {
                color: #6b7280;
                padding: 8px 0;
                position: relative;
                padding-left: 25px;
            }
            
            .features li::before {
                content: '✨';
                position: absolute;
                left: 0;
                top: 8px;
            }
            
            .footer {
                background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                padding: 30px;
                text-align: center;
                color: #9ca3af;
            }
            
            .footer p {
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .footer a {
                color: #667eea;
                text-decoration: none;
            }
            
            .footer a:hover {
                text-decoration: underline;
            }
            
            .social-links {
                margin-top: 20px;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #9ca3af;
                text-decoration: none;
                font-size: 16px;
            }
            
            .social-links a:hover {
                color: #667eea;
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 15px;
                }
                
                .header, .content, .footer {
                    padding: 25px 20px;
                }
                
                .logo {
                    font-size: 28px;
                }
                
                .header-title {
                    font-size: 24px;
                }
                
                .verify-button {
                    padding: 14px 30px;
                    font-size: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">DevCollab</div>
                <h1 class="header-title">Verify Your Email</h1>
                <p class="header-subtitle">Complete your registration and join the community</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello <strong>${name}</strong> 👋
                </div>
                
                <div class="description">
                    Welcome to DevCollab! We're excited to have you join our community of developers. 
                    To complete your registration and start collaborating, please verify your email address.
                </div>
                
                <div class="cta-section">
                    <a href="${verificationUrl}" class="verify-button">
                        ✨ Verify Email Address
                    </a>
                </div>
                
                <div class="warning-box">
                    <div class="warning-title">Security Notice</div>
                    <div class="warning-text">
                        This verification link will expire in 24 hours for security reasons. 
                        If you need a new link, you can request one from your account settings.
                    </div>
                </div>
                
                <div class="link-fallback">
                    <strong>Having trouble with the button?</strong><br>
                    Copy and paste this link into your browser:<br>
                    <a href="${verificationUrl}">${verificationUrl}</a>
                </div>
                
                <div class="features">
                    <h3>What's Next?</h3>
                    <ul>
                        <li>Access your personalized dashboard</li>
                        <li>Create and manage projects</li>
                        <li>Connect with other developers</li>
                        <li>Join discussions and share knowledge</li>
                    </ul>
                </div>
                
                <div class="description">
                    If you didn't create an account with DevCollab, you can safely ignore this email. 
                    Your security is important to us.
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated email from DevCollab. Please do not reply to this message.</p>
                <p>Need help? <a href="${process.env.FRONTEND_URL}/support">Contact Support</a></p>
                <p>&copy; 2024 DevCollab. All rights reserved.</p>
                
                <div class="social-links">
                    <a href="#">🌐</a>
                    <a href="#">🐦</a>
                    <a href="#">💼</a>
                    <a href="#">📧</a>
                </div>
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
    
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email/${verificationToken}`
    
    const mailOptions = {
      from: `"DevCollab" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✨ Verify Your Email - Welcome to DevCollab!',
      html: createVerificationEmailHTML(name, verificationUrl),
    }
    
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

// Create beautiful welcome email template
const createWelcomeEmailHTML = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to DevCollab!</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #1f2937;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 20px;
                min-height: 100vh;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            }
            
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            
            .logo {
                font-size: 32px;
                font-weight: 800;
                color: #ffffff;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                position: relative;
                z-index: 1;
            }
            
            .header-title {
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 10px;
                text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                position: relative;
                z-index: 1;
            }
            
            .header-subtitle {
                color: rgba(255, 255, 255, 0.9);
                font-size: 16px;
                font-weight: 400;
                position: relative;
                z-index: 1;
            }
            
            .content {
                padding: 40px 30px;
                background: #ffffff;
            }
            
            .greeting {
                font-size: 18px;
                color: #374151;
                margin-bottom: 20px;
            }
            
            .greeting strong {
                color: #1f2937;
                font-weight: 600;
            }
            
            .description {
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            
            .celebration {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-radius: 12px;
                border: 1px solid #f59e0b;
            }
            
            .celebration h2 {
                color: #92400e;
                font-size: 20px;
                margin-bottom: 10px;
            }
            
            .celebration p {
                color: #92400e;
                font-size: 16px;
            }
            
            .cta-section {
                text-align: center;
                margin: 30px 0;
            }
            
            .dashboard-button {
                display: inline-block;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: #ffffff;
                padding: 16px 40px;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
            }
            
            .dashboard-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
            }
            
            .features {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border-radius: 12px;
                padding: 25px;
                margin: 30px 0;
            }
            
            .features h3 {
                color: #1f2937;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .features-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 20px;
            }
            
            .feature-item {
                background: #ffffff;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                text-align: center;
            }
            
            .feature-icon {
                font-size: 24px;
                margin-bottom: 8px;
                display: block;
            }
            
            .feature-title {
                color: #1f2937;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 5px;
            }
            
            .feature-desc {
                color: #6b7280;
                font-size: 12px;
                line-height: 1.4;
            }
            
            .footer {
                background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
                padding: 30px;
                text-align: center;
                color: #9ca3af;
            }
            
            .footer p {
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .footer a {
                color: #10b981;
                text-decoration: none;
            }
            
            .footer a:hover {
                text-decoration: underline;
            }
            
            .social-links {
                margin-top: 20px;
            }
            
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #9ca3af;
                text-decoration: none;
                font-size: 16px;
            }
            
            .social-links a:hover {
                color: #10b981;
            }
            
            @media (max-width: 600px) {
                .email-container {
                    margin: 10px;
                    border-radius: 15px;
                }
                
                .header, .content, .footer {
                    padding: 25px 20px;
                }
                
                .logo {
                    font-size: 28px;
                }
                
                .header-title {
                    font-size: 24px;
                }
                
                .dashboard-button {
                    padding: 14px 30px;
                    font-size: 15px;
                }
                
                .features-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">DevCollab</div>
                <h1 class="header-title">Welcome to DevCollab! 🎉</h1>
                <p class="header-subtitle">Your account is verified and ready to go</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello <strong>${name}</strong> 👋
                </div>
                
                <div class="description">
                    Congratulations! Your email has been successfully verified and your DevCollab account is now fully active. 
                    You're now part of our growing community of developers who collaborate, learn, and build amazing things together.
                </div>
                
                <div class="celebration">
                    <h2>🎊 Account Successfully Verified!</h2>
                    <p>You're all set to start your DevCollab journey</p>
                </div>
                
                <div class="cta-section">
                    <a href="${process.env.FRONTEND_URL}/dashboard" class="dashboard-button">
                        🚀 Get Started
                    </a>
                </div>
                
                <div class="features">
                    <h3>What You Can Do Now</h3>
                    <div class="features-grid">
                        <div class="feature-item">
                            <span class="feature-icon">👥</span>
                            <div class="feature-title">Connect</div>
                            <div class="feature-desc">Join developer communities and discussions</div>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">💻</span>
                            <div class="feature-title">Create</div>
                            <div class="feature-desc">Start new projects and invite team members</div>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🤝</span>
                            <div class="feature-title">Collaborate</div>
                            <div class="feature-desc">Work together on tasks and track progress</div>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📚</span>
                            <div class="feature-title">Learn</div>
                            <div class="feature-desc">Share knowledge and learn from others</div>
                        </div>
                    </div>
                </div>
                
                <div class="description">
                    Ready to dive in? Click the button above to access your personalized dashboard and start exploring all that DevCollab has to offer.
                </div>
                
                <div class="description">
                    If you have any questions or need assistance, our support team is here to help. 
                    Happy coding! 🚀
                </div>
            </div>
            
            <div class="footer">
                <p>This is an automated email from DevCollab. Please do not reply to this message.</p>
                <p>Need help? <a href="${process.env.FRONTEND_URL}/support">Contact Support</a></p>
                <p>&copy; 2024 DevCollab. All rights reserved.</p>
                
                <div class="social-links">
                    <a href="#">🌐</a>
                    <a href="#">🐦</a>
                    <a href="#">💼</a>
                    <a href="#">📧</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `
}

// Send welcome email after verification
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"DevCollab" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to DevCollab - Your Account is Verified!',
      html: createWelcomeEmailHTML(name),
    }
    
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return false
  }
} 