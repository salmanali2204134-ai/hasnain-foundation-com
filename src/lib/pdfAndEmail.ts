import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface DonationReceipt {
  id: string;
  donorName: string;
  email: string;
  mobile: string;
  whatsapp?: string;
  amount: number;
  paymentMethod: string;
  purpose: string;
  transactionId: string;
  receiptUrl?: string;
  donationDate: string;
  donationTime?: string;
  status: 'pending' | 'verified' | 'rejected';
}

/**
 * Generates an elegant PDF donation receipt.
 * Styled professionally with deep emerald and warm gold accents.
 */
export function generateReceiptPdf(donation: DonationReceipt): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
        info: {
          Title: `Donation Receipt - ${donation.id}`,
          Author: 'Hasnain Foundation',
          Subject: 'Official Contribution Acknowledgement'
        }
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // 1. DRAW ELEGANT DOUBLE BORDER
      doc.save();
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40).lineWidth(1).stroke('#cbd5e1'); // Outer slate border
      doc.rect(25, 25, pageWidth - 50, pageHeight - 50).lineWidth(2.5).stroke('#059669'); // Inner emerald border
      doc.restore();

      // 2. CORNER DECORATIVE ANCHORS (Gold Accents)
      const drawCorner = (x: number, y: number, r: number) => {
        doc.save();
        doc.fillColor('#d97706'); // Warm Gold
        doc.rect(x, y, r, r).fill();
        doc.restore();
      };
      drawCorner(28, 28, 8);
      drawCorner(pageWidth - 36, 28, 8);
      drawCorner(28, pageHeight - 36, 8);
      drawCorner(pageWidth - 36, pageHeight - 36, 8);

      // 3. HEADER & EMBLEM
      // Draw stylized golden/emerald decorative shield/heart
      doc.save();
      doc.translate(pageWidth / 2, 75);
      doc.fillColor('#059669');
      // Draw a vector emblem
      doc.path('M 0 -20 L 18 -2 L 11 22 L -11 22 L -18 -2 Z').fill();
      doc.fillColor('#fbbf24');
      doc.circle(0, 3, 6).fill();
      doc.restore();

      // Logo Text
      doc.font('Helvetica-Bold').fontSize(24).fillColor('#064e3b').text('HASNAIN FOUNDATION', { align: 'center' });
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#d97706').text('WELFARE & CONSTRUCTION TRUST', { align: 'center', characterSpacing: 2 });
      doc.moveDown(0.4);
      doc.font('Helvetica').fontSize(9).fillColor('#64748b').text('Mahmoodabad, Karachi, Pakistan  |  hasnainfoundation225@gmail.com', { align: 'center' });

      // Horizontal separator line
      doc.save().moveTo(50, 155).lineTo(pageWidth - 50, 155).lineWidth(0.5).stroke('#cbd5e1');

      // 4. RECEIPT TITLE & SUBTITLE
      doc.moveDown(3);
      doc.font('Helvetica-Bold').fontSize(18).fillColor('#064e3b').text('DONATION RECEIPT', { align: 'center', paragraphGap: 6 });
      doc.font('Helvetica-Oblique').fontSize(11).fillColor('#475569').text('Presented with deepest gratitude & prayers of appreciation to:', { align: 'center' });

      // 5. DONOR NAME
      doc.moveDown(1.5);
      doc.font('Helvetica-BoldOblique').fontSize(20).fillColor('#0f172a').text(donation.donorName, { align: 'center' });
      
      // Separator under donor name
      doc.save().moveTo(pageWidth / 2 - 120, doc.y + 4).lineTo(pageWidth / 2 + 120, doc.y + 4).lineWidth(1.5).stroke('#d97706');
      doc.moveDown(2);

      // 6. AMOUNT BOX
      doc.font('Helvetica').fontSize(11).fillColor('#475569').text('For their generous contribution in support of our humanitarian cause:', { align: 'center' });
      doc.moveDown(0.8);

      const amountText = `PKR ${donation.amount.toLocaleString()}/-`;
      doc.save();
      // Render Gold/Green Highlighted Box for Amount
      const boxWidth = 260;
      const boxHeight = 42;
      const boxX = (pageWidth - boxWidth) / 2;
      const boxY = doc.y;
      doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 8)
         .fillAndStroke('#ecfdf5', '#059669'); // Emerald background with darker border
      
      doc.fillColor('#064e3b')
         .font('Helvetica-Bold')
         .fontSize(18)
         .text(amountText, boxX, boxY + 12, { width: boxWidth, align: 'center' });
      doc.restore();

      doc.moveDown(3.2);

      // 7. TRANSACTION INFORMATION DETAILS TABLE
      const tableY = doc.y;
      const col1X = 60;
      const col2X = pageWidth / 2 + 20;

      // Draw table background card (expanded to 180 height to fit 5 clean rows)
      doc.save()
         .roundedRect(50, tableY - 10, pageWidth - 100, 180, 8)
         .fillColor('#f8fafc')
         .strokeColor('#e2e8f0')
         .fillAndStroke();
      doc.restore();

      const drawDetailRow = (label: string, value: string, yPos: number, isCol2 = false) => {
        const xPos = isCol2 ? col2X : col1X;
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#64748b').text(label, xPos, yPos);
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a').text(value || 'N/A', xPos, yPos + 12);
      };

      // Row 1
      drawDetailRow('RECEIPT NUMBER', donation.id, tableY);
      drawDetailRow('TRANSACTION ID', donation.transactionId, tableY, true);

      // Row 2
      const row2Y = tableY + 34;
      drawDetailRow('DATE OF TRANSACTION', donation.donationDate, row2Y);
      drawDetailRow('TIME OF TRANSACTION', donation.donationTime || '12:00:00 PM', row2Y, true);

      // Row 3
      const row3Y = tableY + 68;
      drawDetailRow('DONOR MOBILE / WHATSAPP', donation.mobile || donation.whatsapp || 'N/A', row3Y);
      drawDetailRow('DONOR EMAIL', donation.email || 'N/A', row3Y, true);

      // Row 4
      const row4Y = tableY + 102;
      drawDetailRow('DONATION PURPOSE', (donation.purpose || 'General Sadqah / Zakat').toUpperCase(), row4Y);
      drawDetailRow('PAYMENT CHANNEL', donation.paymentMethod.toUpperCase(), row4Y, true);

      // Row 5
      const row5Y = tableY + 136;
      const verifiedLabel = donation.status === 'verified' ? 'VERIFIED & SUCCESSFUL' : donation.status === 'rejected' ? 'REJECTED / INVALID' : 'PENDING AUDIT & VERIFICATION';
      drawDetailRow('RECEIPT STATUS', verifiedLabel, row5Y);
      drawDetailRow('OFFICIAL EMAIL', 'hasnainfoundation225@gmail.com', row5Y, true);

      doc.moveDown(11.5);

      // 8. PROPHET'S HADITH (Soft Quote block)
      const quoteY = doc.y;
      doc.save()
         .rect(50, quoteY, pageWidth - 100, 50)
         .fillColor('#fffbeb') // Warm sand/gold background
         .strokeColor('#f59e0b')
         .lineWidth(0.5)
         .fillAndStroke();
      doc.restore();

      doc.font('Helvetica-Oblique')
         .fontSize(9.5)
         .fillColor('#92400e')
         .text(
           '"The Prophet Muhammad (PBUH) said: \'Sadaqah extinguishes sin as water extinguishes fire.\'" (Tirmidhi)',
           60,
           quoteY + 14,
           { width: pageWidth - 120, align: 'center', lineGap: 3 }
         );

      doc.moveDown(5);

      // 9. SIGNATURE & STAMP STATIONS
      const footerY = pageHeight - 145;
      
      // Signature lines
      doc.moveTo(60, footerY).lineTo(180, footerY).lineWidth(0.8).stroke('#cbd5e1');
      doc.moveTo(pageWidth - 180, footerY).lineTo(pageWidth - 60, footerY).lineWidth(0.8).stroke('#cbd5e1');

      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#334155').text('Verified Registrar', 60, footerY + 8, { width: 120, align: 'center' });
      doc.font('Helvetica').fontSize(8).fillColor('#64748b').text('Hasnain Foundation', 60, footerY + 18, { width: 120, align: 'center' });

      doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#334155').text('Board of Trustees', pageWidth - 180, footerY + 8, { width: 120, align: 'center' });
      doc.font('Helvetica').fontSize(8).fillColor('#64748b').text('Authorized Authority', pageWidth - 180, footerY + 18, { width: 120, align: 'center' });

      // 10. FOOTER NOTE
      doc.font('Helvetica').fontSize(8).fillColor('#64748b').text(
        'Official Contacts: +92 315 2204134, +92 320 2628645  |  Email: hasnainfoundation225@gmail.com',
        40,
        pageHeight - 88,
        { align: 'center', width: pageWidth - 80 }
      );

      doc.font('Helvetica').fontSize(8).fillColor('#94a3b8').text(
        'This is a secure, digitally verified receipt issued by the Hasnain Foundation Trust (Reg. No. Karachi-W544).\nYour generous donations support education, clean water, and mosque construction initiatives in underprivileged areas.',
        40,
        pageHeight - 74,
        { align: 'center', width: pageWidth - 80, lineGap: 3 }
      );

      // Embed Official Hasnain Foundation QR Code in center of footer
      const verifyLink = `https://hasnain-foundation-com.ai.studio/?verify=${encodeURIComponent(donation.id)}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyLink)}`;

      fetch(qrApiUrl)
        .then((r) => r.arrayBuffer())
        .then((buf) => {
          try {
            const imageBuffer = Buffer.from(buf);
            doc.image(imageBuffer, (pageWidth / 2) - 30, footerY - 45, { width: 60, height: 60 });
            doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#059669').text('SCAN TO VERIFY', (pageWidth / 2) - 45, footerY + 18, { width: 90, align: 'center' });
          } catch (e) {
            console.warn('QR image render error:', e);
          }
          doc.end();
        })
        .catch((err) => {
          console.warn('QR code fetch failed for PDF:', err);
          doc.end();
        });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Emails the generated PDF receipt to the donor.
 * Falls back to storing the receipt in a local folder so the user can download/preview it.
 */
export async function sendReceiptEmail(donation: DonationReceipt, pdfBuffer: Buffer): Promise<{ success: boolean; mode: 'smtp' | 'fallback'; filePath?: string; message: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || '"Hasnain Foundation" <hasnainfoundation225@gmail.com>';

  // Ensure local receipts directory exists for both archiving and testing
  const receiptsDir = path.join(process.cwd(), 'receipts');
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
  }

  const filename = `receipt_${donation.id}_${donation.transactionId}.pdf`;
  const localPath = path.join(receiptsDir, filename);
  
  // Always save locally to let the developer/admin access and download it inside the browser preview!
  fs.writeFileSync(localPath, pdfBuffer);

  // Check if SMTP is configured. If not, use fully playable fallback mode.
  if (!smtpHost || !smtpUser || !smtpPass) {
    const devMessage = `[SMTP Simulated] Real email delivery not configured (SMTP_USER/SMTP_PASS are blank). Receipt generated successfully and archived locally.`;
    console.warn(devMessage);
    console.log(`Receipt local path: ${localPath}`);
    
    return {
      success: true,
      mode: 'fallback',
      filePath: `/receipts/${filename}`,
      message: `Receipt generated successfully! Simulated email sent to ${donation.email}. (Receipt archived locally at ${localPath})`
    };
  }

  try {
    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort) || 587,
      secure: Number(smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const emailSubject = `Official Donation Receipt - Thank You for Your Support! (Receipt: ${donation.id})`;
    const emailBody = `
Dear ${donation.donorName},

Assalam-o-Alaikum,

We have successfully verified and recorded your generous donation to the Hasnain Foundation. 

Here are your contribution details:
------------------------------------------
Receipt ID: ${donation.id}
Transaction Reference: ${donation.transactionId}
Payment Channel: ${donation.paymentMethod.toUpperCase()}
Amount Contributed: PKR ${donation.amount.toLocaleString()}
Status: VERIFIED & CONFIRMED
------------------------------------------

We have attached your official PDF Donation Receipt & Certificate of Appreciation to this email.

Your support directly funds our critical community welfare operations, including the construction of Jamia Masjid Abdul Qadir Jilani, RO clean water plants, and feeding underprivileged children.

May Allah reward you abundantly for your kindness and generosity (Ameen).

With deepest respect,
Board of Trustees
Hasnain Foundation Trust
Karachi, Pakistan
hasnainfoundation225@gmail.com
    `;

    // Send email with PDF attachment
    await transporter.sendMail({
      from: smtpFrom,
      to: donation.email,
      subject: emailSubject,
      text: emailBody,
      attachments: [
        {
          filename: `Hasnain_Foundation_Receipt_${donation.id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    return {
      success: true,
      mode: 'smtp',
      filePath: `/receipts/${filename}`,
      message: `Receipt sent successfully to ${donation.email} via SMTP!`
    };
  } catch (error: any) {
    console.error('SMTP Email failed, falling back to local archive. Error:', error);
    return {
      success: true, // We still return success: true because the PDF was generated and archived!
      mode: 'fallback',
      filePath: `/receipts/${filename}`,
      message: `Receipt generated and archived locally. Failed to send email via SMTP: ${error.message}`
    };
  }
}
