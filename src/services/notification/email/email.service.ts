import nodemailer from 'nodemailer';
import { emailConfig } from '@/configs/providers/email.config';
import { EmailMessage, EmailResponse } from '@/types/core/notification';
import { appConfig } from '@/configs/app.config';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (emailConfig.enabled) {
      this.transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        auth: emailConfig.auth,
      });
    }
  }

  isEnabled(): boolean {
    return emailConfig.enabled && this.transporter !== null;
  }

  async sendEmail(message: EmailMessage): Promise<EmailResponse> {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'Email service is not enabled',
      };
    }

    const mailOptions = {
      from: `${emailConfig.fromName} <${emailConfig.from}>`,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    };

    const result = await this.transporter!.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
    };
  }

  async sendWelcomeEmail(
    userEmail: string,
    userName: string,
  ): Promise<EmailResponse> {
    const welcomeTemplate = this.createWelcomeTemplate(userName);

    return this.sendEmail({
      to: userEmail,
      subject: `🎉 Bem-vindo ${userName}! Sua jornada começa agora`,
      html: welcomeTemplate,
    });
  }

  protected createWelcomeTemplate(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bem-vindo!</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f6f9;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%);
              color: white;
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
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="rgba(255,255,255,0.1)"><polygon points="0,0 1000,0 1000,60 0,100"/></svg>') no-repeat bottom;
              background-size: cover;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              position: relative;
              z-index: 1;
            }
            .emoji {
              font-size: 48px;
              margin-bottom: 16px;
              display: block;
            }
            .content {
              padding: 40px 30px;
              color: #374151;
            }
            .welcome-text {
              font-size: 18px;
              color: #111827;
              margin-bottom: 24px;
            }
            .features {
              background: #fff7ed;
              border-radius: 8px;
              padding: 24px;
              margin: 24px 0;
              border-left: 4px solid #f97316;
            }
            .features h3 {
              margin: 0 0 16px 0;
              color: #1f2937;
              font-size: 16px;
              font-weight: 600;
            }
            .features ul {
              margin: 0;
              padding: 0;
              list-style: none;
            }
            .features li {
              padding: 8px 0;
              position: relative;
              padding-left: 24px;
            }
            .features li:before {
              content: '✓';
              position: absolute;
              left: 0;
              color: #ea580c;
              font-weight: bold;
            }
            .button-container {
              text-align: center;
              margin: 32px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
              color: white !important;
              padding: 16px 32px;
              text-decoration: none !important;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
              transition: transform 0.2s ease;
            }
            .button:hover {
              transform: translateY(-2px);
              color: white !important;
              text-decoration: none !important;
            }
            .help-section {
              background: #fff7ed;
              border-radius: 8px;
              padding: 20px;
              margin: 24px 0;
              border-left: 4px solid #f97316;
            }
            .help-section h4 {
              margin: 0 0 12px 0;
              color: #ea580c;
              font-size: 16px;
            }
            .help-section p {
              margin: 0;
              color: #c2410c;
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer p {
              margin: 8px 0;
              color: #6b7280;
              font-size: 14px;
            }
            .social-links {
              margin: 20px 0;
            }
            .social-links a {
              display: inline-block;
              margin: 0 8px;
              color: #6b7280;
              text-decoration: none;
              font-size: 14px;
            }
            @media only screen and (max-width: 600px) {
              .container {
                margin: 20px;
                border-radius: 8px;
              }
              .header, .content {
                padding: 24px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .button {
                padding: 14px 24px;
                font-size: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="emoji">🎉</span>
              <h1>Bem-vindo, ${userName}!</h1>
            </div>
            
            <div class="content">
              <p class="welcome-text">
                Olá <strong>${userName}</strong>, é um prazer tê-lo conosco!
              </p>
              
              <p>Sua conta foi criada com sucesso e você já pode aproveitar todos os recursos da nossa plataforma.</p>
              
              <div class="features">
                <h3>🚀 O que você pode fazer agora:</h3>
                <ul>
                  <li>Explorar todas as funcionalidades disponíveis</li>
                  <li>Personalizar seu perfil e preferências</li>
                  <li>Acessar recursos exclusivos para membros</li>
                  <li>Conectar-se com outros usuários</li>
                </ul>
              </div>
              
              <div class="button-container">
                <a href="#" class="button">Acessar minha conta</a>
              </div>
              
              <div class="help-section">
                <h4>💡 Precisa de ajuda?</h4>
                <p>Nossa equipe de suporte está sempre disponível para ajudar você. Entre em contato conosco a qualquer momento!</p>
              </div>
              
              <p>Estamos ansiosos para ver o que você vai conseguir realizar em nossa plataforma!</p>
              
              <p style="margin-top: 32px;">
                Com carinho,<br>
                <strong>Equipe ${process.env.EMAIL_FROM_NAME || 'Sistema'}</strong>
              </p>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="#">📧 Suporte</a>
                <a href="#">📚 Documentação</a>
                <a href="#">💬 Comunidade</a>
              </div>
              
              <p>Este é um email automático, mas você pode responder se tiver dúvidas!</p>
              <p>© ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME || 'Sistema'}. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
