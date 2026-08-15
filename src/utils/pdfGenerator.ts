import { jsPDF } from 'jspdf';
import { DonationRecord, CertificateTemplate } from '../types';

/**
 * Generates and triggers instant download of a high-resolution PDF certificate.
 */
export async function downloadCertificatePDF(
  record: DonationRecord,
  template: CertificateTemplate = 'modern-gold'
) {
  // Landscape A4: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = 297;
  const height = 210;

  if (template === 'modern-gold') {
    renderModernGoldPDF(doc, record, width, height);
  } else {
    renderVintageClassicPDF(doc, record, width, height);
  }

  const fileName = `Certificate_${record.name.replace(/\s+/g, '_')}_${record.id}.pdf`;
  doc.save(fileName);
}

function renderModernGoldPDF(
  doc: jsPDF,
  record: DonationRecord,
  w: number,
  h: number
) {
  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, 'F');

  // Outer border with soft radius simulation
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.roundedRect(8, 8, w - 16, h - 16, 4, 4, 'S');

  // Subtle golden inner border
  doc.setDrawColor(212, 175, 55); // gold
  doc.setLineWidth(0.8);
  doc.roundedRect(12, 12, w - 24, h - 24, 2, 2, 'S');

  // Modern burgundy corner facets
  doc.setFillColor(128, 14, 30); // deep burgundy
  // Top right geometric polygon
  doc.triangle(w - 12, 12, w - 50, 12, w - 12, 50, 'F');
  // Bottom left geometric polygon
  doc.triangle(12, h - 12, 50, h - 12, 12, h - 50, 'F');

  // Gold accent triangles
  doc.setFillColor(218, 165, 32);
  doc.triangle(w - 12, 35, w - 30, 12, w - 12, 12, 'F');
  doc.triangle(12, h - 35, 30, h - 12, 12, h - 12, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(112, 18, 28);
  doc.text('CERTIFICATE', w / 2, 38, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(180, 140, 40);
  doc.text('OF ACHIEVEMENT', w / 2, 46, { align: 'center' });

  // Subheading
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('THIS CERTIFICATE IS PRESENTED TO', w / 2, 60, { align: 'center' });

  // Recipient Name
  doc.setFont('times', 'italic');
  doc.setFontSize(32);
  doc.setTextColor(40, 40, 40);
  doc.text(record.name, w / 2, 78, { align: 'center' });

  // Underline below name
  doc.setDrawColor(200, 180, 120);
  doc.setLineWidth(0.6);
  doc.line(w / 2 - 60, 82, w / 2 + 60, 82);

  // Description / Citation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  doc.text(
    'Awarded to recognize outstanding contribution, dedication, and generous donation',
    w / 2,
    94,
    { align: 'center' }
  );
  doc.text(
    `in support of SINUSOID VX (${record.donationItem})`,
    w / 2,
    101,
    { align: 'center' }
  );

  // Role & Details Pill
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  const detailStr = `Role: ${record.role}${record.enrollNo ? `  |  Enrollment: ${record.enrollNo}` : ''}  |  Certificate ID: ${record.id}`;
  doc.text(detailStr, w / 2, 112, { align: 'center' });

  // Medallion Gold Seal
  doc.setFillColor(218, 165, 32);
  doc.circle(w / 2, 138, 14, 'F');
  doc.setFillColor(255, 215, 0);
  doc.circle(w / 2, 138, 11, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 70, 10);
  doc.text('SINUSOID VX', w / 2, 136, { align: 'center' });
  doc.text('VERIFIED', w / 2, 141, { align: 'center' });

  // Signatures
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.5);

  // Left Signer
  doc.line(45, 172, 95, 172);
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text('Harper Russo', 70, 168, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('HARPER RUSSO', 70, 177, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('HEAD OF EVENT', 70, 181, { align: 'center' });

  // Right Signer
  doc.line(w - 95, 172, w - 45, 172);
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text('Rachelle Beaudry', w - 70, 168, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('RACHELLE BEAUDRY', w - 70, 177, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('MANAGER', w - 70, 181, { align: 'center' });

  // Date at bottom
  doc.setFontSize(8);
  doc.setTextColor(130, 130, 130);
  doc.text(`Issued on: ${record.dateStr}`, w / 2, 192, { align: 'center' });
}

function renderVintageClassicPDF(
  doc: jsPDF,
  record: DonationRecord,
  w: number,
  h: number
) {
  // Background
  doc.setFillColor(252, 252, 250);
  doc.rect(0, 0, w, h, 'F');

  // Double vintage border
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, w - 20, h - 20, 'S');

  doc.setLineWidth(0.5);
  doc.rect(13, 13, w - 26, h - 26, 'S');

  // Heading: Certificate of Appreciation
  doc.setFont('times', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(25, 25, 25);
  doc.text('Certificate of Appreciation', w / 2, 38, { align: 'center' });

  // This Certificate is hereby awarded to
  doc.setFont('times', 'italic');
  doc.setFontSize(15);
  doc.setTextColor(60, 60, 60);
  doc.text('This Certificate is hereby awarded to', w / 2, 56, { align: 'center' });

  // Recipient Name
  doc.setFont('times', 'italic');
  doc.setFontSize(28);
  doc.setTextColor(15, 15, 15);
  doc.text(record.name, w / 2, 75, { align: 'center' });

  // Underline for name
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.6);
  doc.line(35, 79, w - 35, 79);

  // in recognition of
  doc.setFont('times', 'italic');
  doc.setFontSize(15);
  doc.setTextColor(60, 60, 60);
  doc.text('in recognition of', w / 2, 95, { align: 'center' });

  // Donation item / contribution description
  doc.setFont('times', 'normal');
  doc.setFontSize(15);
  doc.setTextColor(30, 30, 30);
  const donationText = `generous contribution of ${record.donationItem} as ${record.role}`;
  doc.text(donationText, w / 2, 114, { align: 'center' });

  // Underline for recognition
  doc.line(35, 118, w - 35, 118);

  // Signatures and Dates
  doc.setFont('times', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);

  // Given by
  doc.text('Given by:  SINUSOID VX Organizing Committee', 40, 150);
  doc.line(58, 152, 135, 152);

  // Date format: This [Day] Day of [Month] Year of [Year]
  const dateObj = new Date(record.timestamp);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const year = dateObj.getFullYear();

  doc.text(`This  ${day}  Day of  ${month}  Year of  ${year}`, 40, 168);
  doc.line(50, 170, 65, 170); // day line
  doc.line(80, 170, 115, 170); // month line
  doc.line(132, 170, 150, 170); // year line

  // Certificate ID and Auth Seal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Official Certificate ID: ${record.id}  |  Enrollment: ${record.enrollNo || 'N/A'}`, w / 2, 192, {
    align: 'center',
  });
}
