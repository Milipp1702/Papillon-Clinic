import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PatientDTO } from '../../../services/dtos';
import papillon_icon from '../../../assets/papillon_icon.png';

type Appointment = {
  appointmentDate: string;
  professionalName: string;
  patientName: string;
  amountProfessional: string;
  appointmentType: string;
  specialtyName: string;
  isPaid: boolean;
  amount: number;
};

type GeneratePdfParams = {
  selectedName?: string;
  appointments?: Appointment[];
  totalAmount: string;
  patientInformation?: PatientDTO | null;
};

export async function generatePDFPatientDocument(
  params: GeneratePdfParams
): Promise<void> {
  const {
    selectedName,
    appointments = [],
    totalAmount,
    patientInformation,
  } = params;
  // --- dados do paciente/responsável (já fornecidos)
  const patientName = selectedName || patientInformation?.name || '-';
  const patientCpf = patientInformation?.cpf || '-';
  const mainGuardian = Array.isArray(patientInformation?.listGuardian)
    ? patientInformation.listGuardian.find((g) => g.isMain)
    : undefined;
  const guardianName = mainGuardian?.name || '-';
  const guardianCpf = mainGuardian?.cpf || '-';

  const type = 'Paciente';
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 15;

  // --- carregar logo e converter para base64
  const resp = await fetch(papillon_icon);
  const blob = await resp.blob();
  const logoBase64: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  // obter dimensões do logo para preservar proporção
  const logoMetrics = await new Promise<{ width: number; height: number }>(
    (resolve) => {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 1, height: 1 });
      img.src = logoBase64;
    }
  );

  // --- LOGO centralizada no topo
  const logoWidth = 48; // mm
  const logoHeight = (logoMetrics.height / logoMetrics.width) * logoWidth;
  const logoX = (pageWidth - logoWidth) / 2;
  const logoY = 12;
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // --- TÍTULOS centralizados abaixo da logo
  let cursorY = logoY + logoHeight + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const title = 'DEMONSTRATIVO DE ATENDIMENTOS';
  doc.text(title, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 8;

  // 1. Mês atual centralizado
  const now = new Date();
  const monthName = now.toLocaleDateString('pt-BR', { month: 'long' });
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(241, 156, 163);

  const wMonth = doc.getTextWidth(formattedMonth);
  const xmonth = (pageWidth - wMonth) / 2;
  doc.text(formattedMonth, xmonth, cursorY);

  cursorY += 6; // espaço entre mês e faixa azul

  // 2. Faixa azul com dados do paciente
  const blockX = marginX;
  const blockW = pageWidth - marginX * 2;
  const blockTopY = cursorY;
  const labelFullH = 8;

  doc.setFillColor(220, 235, 255);
  doc.rect(blockX, blockTopY, blockW, labelFullH, 'F');

  const labelPaciente = 'PACIENTE: ';
  const nomePaciente = patientName || '-';
  const separador = ' | ';
  const labelCpf = 'CPF: ';
  const cpfPaciente = patientCpf || '-';

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const wLabelPaciente = doc.getTextWidth(labelPaciente);
  const wLabelCpf = doc.getTextWidth(labelCpf);

  doc.setFont('helvetica', 'normal');
  const wNomePaciente = doc.getTextWidth(nomePaciente);
  const wCpfPaciente = doc.getTextWidth(cpfPaciente);
  const wSeparador = doc.getTextWidth(separador);

  const totalWidth =
    wLabelPaciente + wNomePaciente + wSeparador + wLabelCpf + wCpfPaciente;

  const centerX = blockX + (blockW - totalWidth) / 2;
  const centerY = blockTopY + labelFullH / 2 + 3;

  let x = centerX;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 60, 120);
  doc.text(labelPaciente, x, centerY);
  x += wLabelPaciente;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(nomePaciente, x, centerY);
  x += wNomePaciente;

  doc.text(separador, x, centerY);
  x += wSeparador;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 60, 120);
  doc.text(labelCpf, x, centerY);
  x += wLabelCpf;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(cpfPaciente, x, centerY);

  // 3. Atualiza cursorY para continuar abaixo
  cursorY = blockTopY + labelFullH + 8;

  doc.setFontSize(10);

  // Rótulo "RESPONSÁVEL:"
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 60, 120);
  doc.text('RESPONSÁVEL:', blockX, cursorY);

  // Nome do responsável
  const labelResponsavelWidth = doc.getTextWidth('RESPONSÁVEL: ');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(guardianName || '-', blockX + labelResponsavelWidth + 2, cursorY);

  // Espaço entre nome e CPF
  const nameWidth = doc.getTextWidth(guardianName || '-');
  const spacing = 80; // ajuste conforme necessário

  // Rótulo "CPF RESP:"
  const cpfStartX = blockX + labelResponsavelWidth + 2 + nameWidth + spacing;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 60, 120);
  doc.text('CPF RESP:', cpfStartX, cursorY);

  // CPF do responsável
  const cpfLabelWidth = doc.getTextWidth('CPF RESP: ');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(guardianCpf || '-', cpfStartX + cpfLabelWidth + 2, cursorY);

  // Atualiza cursorY para continuar abaixo
  cursorY += 10;

  // --- TABELA DE ATENDIMENTOS
  const hasAppointments =
    Array.isArray(appointments) && appointments.length > 0;

  if (hasAppointments) {
    autoTable(doc as any, {
      startY: cursorY,
      tableWidth: 'auto',
      head: [
        [
          'Data',
          'Profissional',
          'Tipo de Atendimento',
          'Especialidade',
          'Situação',
          'Valor (R$)',
        ],
      ],
      body: appointments.map((it) => [
        (() => {
          try {
            const d = new Date(it.appointmentDate);
            if (!isNaN(d.getTime())) {
              return d.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
            }
          } catch (e) {}
          return String(it.appointmentDate);
        })(),
        it.professionalName,
        it.appointmentType,
        it.specialtyName,
        it.isPaid ? 'Pago' : 'Pendente',
        it.amount,
      ]),
      foot: [
        [
          { content: '', colSpan: 4 },
          { content: 'Total', styles: { halign: 'right', fontStyle: 'bold' } },
          { content: totalAmount },
        ],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [220, 235, 255], textColor: 20 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      footStyles: {
        fillColor: [99, 186, 201],
        textColor: 255,
        fontStyle: 'bold',
      },
    });
  } else {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', marginX, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.text(totalAmount, marginX + 24, cursorY);
  }

  // posição após tabela
  const lastTableY = (doc as any).lastAutoTable
    ? (doc as any).lastAutoTable.finalY
    : cursorY;
  let currentY = lastTableY + 12;

  const contentWidth = pageWidth - marginX * 2;
  const boxGap = 6;

  const drawBox = (
    title: string,
    lines: string[],
    x: number,
    top: number,
    w: number,
    h: number
  ) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.4);
    doc.rect(x, top, w, h);
    const pad = 6;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, x + pad, top + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    let textY = top + 16;
    lines.forEach((ln) => {
      const parts = doc.splitTextToSize(ln, w - pad * 2);
      parts.forEach((p) => {
        doc.text(p, x + pad, textY);
        textY += 6.8;
      });
    });
  };

  // Dados Bancários principais (retângulo maior)
  drawBox(
    'Dados Bancários',
    [
      'Banco: BANCO INTER (077)',
      'Agência: 0001  Conta: 9999999-4',
      'Titular: Interação',
      'PIX: 99999999000199',
      'CNPJ: 99.999.999/0001-99',
    ],
    marginX,
    currentY,
    contentWidth,
    56
  );
  currentY += 56 + boxGap;

  // Total à direita (pequena caixa)
  const rightBoxW = 60;
  const rightBoxH = 16;
  const rightBoxX = pageWidth - marginX - rightBoxW;
  const rightBoxY = currentY;
  doc.rect(rightBoxX, rightBoxY, rightBoxW, rightBoxH);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total:', rightBoxX + 4, rightBoxY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(totalAmount, rightBoxX + 28, rightBoxY + 10);
  currentY = rightBoxY + rightBoxH + 10;

  // --- RODAPÉ FINAL (obs azul, data, assinatura e contatos)
  const lineHeight = 7;
  doc.setTextColor(20, 90, 160);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const note =
    'Obs: Encaminhe o comprovante para nosso whats para baixa de débito e solicite a NF';
  const noteLines = doc.splitTextToSize(note, pageWidth - marginX * 2);
  doc.text(noteLines, marginX, currentY);
  currentY += noteLines.length * lineHeight + 6;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const formattedDate = now.toLocaleDateString('pt-BR', options);

  const locationDate = `Canoas, ${formattedDate}`;
  const wLoc = doc.getTextWidth(locationDate);

  doc.text(locationDate, pageWidth - marginX - wLoc, currentY);
  currentY += lineHeight + 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Atenciosamente,', marginX, currentY);
  currentY += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Papillon Clinic', marginX, currentY);
  currentY += lineHeight + 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const contactLines = [
    'Endereço: Rua Etc Tal, 655 - Bairro Tal - Canoas - RS - CEP: 99999-999',
    'papillon_clinic@resend.dev',
    '(51) 99999-9999',
  ];
  contactLines.forEach((ln) => {
    const parts = doc.splitTextToSize(ln, pageWidth - marginX * 2);
    doc.text(parts, marginX, currentY);
    currentY += parts.length * lineHeight;
  });

  // restaurar cor e salvar
  doc.setTextColor(0, 0, 0);
  doc.save(`relatorio-financeiro-${type}-${patientName}.pdf`);
}

export const generatePDFProfessionalDocument = async (
  params: GeneratePdfParams
) => {
  const { selectedName, appointments = [], totalAmount } = params;
  // --- dados do paciente/responsável (já fornecidos)
  const professionalName = selectedName || '-';

  const type = 'Profissional';
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 15;

  // --- carregar logo e converter para base64
  const resp = await fetch(papillon_icon);
  const blob = await resp.blob();
  const logoBase64: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  // obter dimensões do logo para preservar proporção
  const logoMetrics = await new Promise<{ width: number; height: number }>(
    (resolve) => {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 1, height: 1 });
      img.src = logoBase64;
    }
  );

  // --- LOGO centralizada no topo
  const logoWidth = 48; // mm
  const logoHeight = (logoMetrics.height / logoMetrics.width) * logoWidth;
  const logoX = (pageWidth - logoWidth) / 2;
  const logoY = 12;
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // --- TÍTULOS centralizados abaixo da logo
  let cursorY = logoY + logoHeight + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const title = 'DEMONSTRATIVO DE ATENDIMENTOS';
  doc.text(title, pageWidth / 2, cursorY, { align: 'center' });
  cursorY += 8;

  // 1. Mês atual centralizado
  const now = new Date();
  const monthName = now.toLocaleDateString('pt-BR', { month: 'long' });
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(241, 156, 163);

  const wMonth = doc.getTextWidth(formattedMonth);
  const xmonth = (pageWidth - wMonth) / 2;
  doc.text(formattedMonth, xmonth, cursorY);

  cursorY += 6; // espaço entre mês e faixa azul

  // 2. Faixa azul com dados do profissional
  const blockX = marginX;
  const blockW = pageWidth - marginX * 2;
  const blockTopY = cursorY;
  const labelFullH = 8;

  doc.setFillColor(220, 235, 255);
  doc.rect(blockX, blockTopY, blockW, labelFullH, 'F');

  const labelProfessional = 'PROFISSIONAL: ';
  const nomeProfessional = professionalName || '-';

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const wLabelProfessional = doc.getTextWidth(labelProfessional);

  doc.setFont('helvetica', 'normal');
  const wNomeProfessional = doc.getTextWidth(nomeProfessional);

  const totalWidth = wLabelProfessional + wNomeProfessional;
  const centerX = blockX + (blockW - totalWidth) / 2;
  const centerY = blockTopY + labelFullH / 2 + 3;

  let x = centerX;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 60, 120);
  doc.text(labelProfessional, x, centerY);
  x += wLabelProfessional;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(nomeProfessional, x, centerY);
  x += wNomeProfessional;

  // 3. Atualiza cursorY para continuar abaixo
  cursorY = blockTopY + labelFullH + 8;

  // --- TABELA DE ATENDIMENTOS
  const hasAppointments =
    Array.isArray(appointments) && appointments.length > 0;

  if (hasAppointments) {
    autoTable(doc as any, {
      startY: cursorY,
      tableWidth: 'auto',
      head: [
        [
          'Data',
          'Paciente',
          'Valor do Atendimento (R$)',
          'Valor à ser pago (Profissional) (R$)',
        ],
      ],
      body: appointments.map((it) => [
        (() => {
          try {
            const d = new Date(it.appointmentDate);
            if (!isNaN(d.getTime())) {
              return d.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
            }
          } catch (e) {}
          return String(it.appointmentDate);
        })(),
        it.patientName,
        it.amount,
        it.amountProfessional,
      ]),
      foot: [
        [
          { content: '', colSpan: 2 },
          { content: 'Total', styles: { halign: 'right', fontStyle: 'bold' } },
          { content: totalAmount },
        ],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [220, 235, 255], textColor: 20 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      footStyles: {
        fillColor: [99, 186, 201],
        textColor: 255,
        fontStyle: 'bold',
      },
    });
  } else {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', marginX, cursorY);
    doc.setFont('helvetica', 'normal');
    doc.text(totalAmount, marginX + 24, cursorY);
  }

  doc.setTextColor(0, 0, 0);
  doc.save(`relatorio-financeiro-${type}-${professionalName}.pdf`);
};
