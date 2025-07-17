import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  businessName: string;
  lookingFor: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, businessName, lookingFor } = body;

    // Validate required fields
    if (!name || !email || !businessName || !lookingFor) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email template for the business (Marquet Media) - Brand aligned
    const businessEmailHtml = `
      <div style="font-family: 'Montserrat', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8F4E8; padding: 20px;">
        <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(45, 45, 45, 0.1); border: 1px solid rgba(45, 45, 45, 0.05);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2D2D2D; font-size: 28px; margin: 0; font-weight: 300; font-family: 'Baskerville', serif;">New Collaboration Request</h1>
            <div style="width: 60px; height: 2px; background-color: #2D2D2D; margin: 15px auto;"></div>
            <p style="color: #2D2D2D; font-size: 14px; margin: 10px 0 0 0; font-style: italic;">Where strategy meets subtle storytelling</p>
          </div>
          
          <div style="background-color: #F8F4E8; border-radius: 8px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(45, 45, 45, 0.05);">
            <h2 style="color: #2D2D2D; font-size: 18px; margin: 0 0 15px 0; font-weight: 500; font-family: 'Baskerville', serif;">Contact Details</h2>
            <p style="margin: 8px 0; color: #2D2D2D; font-size: 14px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #2D2D2D; font-size: 14px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0; color: #2D2D2D; font-size: 14px;"><strong>Business:</strong> ${businessName}</p>
          </div>
          
          <div style="background-color: #F8F4E8; border-radius: 8px; padding: 20px;">
            <h2 style="color: #2D2D2D; font-size: 18px; margin: 0 0 15px 0; font-weight: 500; font-family: 'Baskerville', serif;">Project Requirements</h2>
            <p style="color: #2D2D2D; line-height: 1.6; margin: 0; font-size: 14px;">${lookingFor}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(45, 45, 45, 0.1);">
            <p style="color: #2D2D2D; font-size: 12px; margin: 0; opacity: 0.7;">
              This inquiry was submitted through the Marquet Media website.
            </p>
            <div style="margin-top: 10px;">
              <span style="color: #2D2D2D; font-size: 11px; opacity: 0.6;">Ranchi • Jharkhand • East India</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Gen-Z style confirmation email for the user - Brand aligned with Marquet Media theme
    const userEmailHtml = `
      <div style="font-family: 'Montserrat', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #F8F4E8 0%, #f5f1e4 100%); padding: 20px;">
        <div style="background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(45, 45, 45, 0.08); border: 1px solid rgba(45, 45, 45, 0.05);">
          
          <!-- Header with emoji and brand styling -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 48px; margin-bottom: 15px;">🚀</div>
            <h1 style="color: #2D2D2D; font-size: 32px; margin: 0; font-weight: 300; letter-spacing: -0.5px; font-family: 'Baskerville', serif;">We Heard You!</h1>
            <p style="color: #2D2D2D; font-size: 18px; margin: 10px 0 0 0; font-weight: 400; opacity: 0.8;">Your message just landed in our inbox ✨</p>
            <div style="width: 40px; height: 2px; background-color: #2D2D2D; margin: 15px auto; opacity: 0.3;"></div>
          </div>

          <!-- Main content with brand vibes -->
          <div style="background: linear-gradient(135deg, #F8F4E8 0%, rgba(248, 244, 232, 0.5) 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #2D2D2D;">
            <h2 style="color: #2D2D2D; font-size: 20px; margin: 0 0 15px 0; font-weight: 500; font-family: 'Baskerville', serif;">Hey ${name}! 👋</h2>
            <p style="color: #2D2D2D; line-height: 1.7; margin: 0; font-size: 15px; opacity: 0.9;">
              Thanks for reaching out to us about <strong style="font-family: 'Baskerville', serif;">${businessName}</strong>! We’re truly excited to learn more about your project and explore how we can elevate your brand with impactful design and strategic growth solutions.
            </p>
          </div>

          <!-- What happens next section -->
          <div style="background-color: #F8F4E8; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(45, 45, 45, 0.05);">
            <h3 style="color: #2D2D2D; font-size: 18px; margin: 0 0 20px 0; font-weight: 500; display: flex; align-items: center; font-family: 'Baskerville', serif;">
              <span style="background-color: #2D2D2D; color: #F8F4E8; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 10px;">✓</span>
              What happens next?
            </h3>
            <div style="space-y: 12px;">
              <p style="color: #2D2D2D; margin: 8px 0; font-size: 14px; display: flex; align-items: flex-start; opacity: 0.8;">
                <span style="color: #2D2D2D; margin-right: 8px; font-weight: bold; opacity: 0.6;">•</span>
                Our team will review your project details within the next 24 hours
              </p>
              <p style="color: #2D2D2D; margin: 8px 0; font-size: 14px; display: flex; align-items: flex-start; opacity: 0.8;">
                <span style="color: #2D2D2D; margin-right: 8px; font-weight: bold; opacity: 0.6;">•</span>
                We'll craft a personalized strategy proposal that's totally your vibe
              </p>
              <p style="color: #2D2D2D; margin: 8px 0; font-size: 14px; display: flex; align-items: flex-start; opacity: 0.8;">
                <span style="color: #2D2D2D; margin-right: 8px; font-weight: bold; opacity: 0.6;">•</span>
                Expect a call or email from us soon to discuss the magic we can create together
              </p>
            </div>
          </div>

          <!-- Call to action with brand styling -->
          <div style="text-align: center; background: linear-gradient(135deg, #2D2D2D 0%, rgba(45, 45, 45, 0.9) 100%); border-radius: 12px; padding: 25px; color: #F8F4E8;">
            <h3 style="color: #F8F4E8; font-size: 18px; margin: 0 0 10px 0; font-weight: 500; font-family: 'Baskerville', serif;">Ready to make some noise? 📢</h3>
            <p style="color: #F8F4E8; margin: 0; font-size: 14px; line-height: 1.6; opacity: 0.9;">
              While you wait, feel free to check out our latest work on Instagram or give us a follow for daily creative inspiration that hits different!
            </p>
          </div>

          <!-- Footer with brand identity -->
          <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(45, 45, 45, 0.1);">
            <p style="color: #2D2D2D; font-size: 24px; margin: 0 0 5px 0; font-weight: 300; font-family: 'Baskerville', serif;">MARQUET <span style="font-family: 'Montserrat', sans-serif;">MEDIA</span></p>
            <p style="color: #2D2D2D; font-size: 14px; margin: 0; font-style: italic; opacity: 0.7;">Where strategy meets subtle storytelling</p>
            <div style="margin-top: 15px;">
              <span style="color: #2D2D2D; font-size: 12px; opacity: 0.6;">Ranchi • Jharkhand • East India</span>
            </div>
            <div style="width: 24px; height: 2px; background-color: #2D2D2D; margin: 15px auto; opacity: 0.2;"></div>
          </div>
        </div>
      </div>
    `;

    // Send email to business
    const businessEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [process.env.BUSINESS_EMAIL!],
      subject: `New Collaboration Request from ${name} - ${businessName}`,
      html: businessEmailHtml,
    });

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [email],
      subject: `We heard you! Your message to Marquet Media has been received 🚀`,
      html: userEmailHtml,
    });

    console.log('Business email sent:', businessEmailResult);
    console.log('User email sent:', userEmailResult);

    return NextResponse.json(
      { 
        message: 'Emails sent successfully',
        businessEmailId: businessEmailResult.data?.id,
        userEmailId: userEmailResult.data?.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}
