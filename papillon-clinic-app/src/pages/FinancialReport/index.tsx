import React, { useEffect, useState } from 'react';
import Button from '../../components/baseComponents/Button';
import PageWrapper from '../../components/PageWrapper';
import * as S from './styles';
import PageTitle from '../../components/baseComponents/PageTitle';
import { useClinicApi } from '../../services/api/useClinicApi';
import TableList from '../../components/TableList';
import {
  generatePDFPatientDocument,
  generatePDFProfessionalDocument,
} from './GeneratePDF';

type Grouping = 'patient' | 'professional';

const FinancialReport: React.FC = () => {
  const [appointments, setAppointments] = useState<any[] | null>(null);
  const [grouping, setGrouping] = useState<Grouping>('patient');
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [names, setNames] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<string>('');
  const {
    getAllProfessionals,
    getAllPatients,
    getListAppointmentsFinancial,
    findPatientById,
  } = useClinicApi();

  const columnsPatient = [
    {
      field: 'appointmentDate',
      headerName: 'Data',
      renderCell: (value: string) => {
        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    { field: 'professionalName', headerName: 'Profissional' },
    { field: 'appointmentType', headerName: 'Tipo de Atendimento' },
    { field: 'specialtyName', headerName: 'Especialidade' },
    { field: 'amount', headerName: 'Valor (R$)' },
  ];

  const columnsProfessional = [
    {
      field: 'appointmentDate',
      headerName: 'Data',
      renderCell: (value: string) => {
        const date = new Date(value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    { field: 'patientName', headerName: 'Paciente' },
    { field: 'amount', headerName: 'Valor do atendimento (R$)' },
    {
      field: 'amountProfessional',
      headerName: 'Valor à ser pago (Profissional)',
    },
  ];

  const fetchNames = async () => {
    try {
      const response =
        grouping === 'patient'
          ? await getAllPatients()
          : await getAllProfessionals();
      setNames(response);
    } catch (error) {
      console.error('Error fetching names:', error);
    }
  };

  useEffect(() => {
    fetchNames();
    setSelectedId('');
    setAppointments([]);
  }, [grouping]);

  const fetchAppointments = async () => {
    if (!selectedId || selectedId === '') {
      setAppointments([]);
      return;
    }

    try {
      const response =
        grouping === 'patient'
          ? await getListAppointmentsFinancial(selectedId)
          : await getListAppointmentsFinancial(undefined, selectedId);
      const responseFormatted = response.map((item) => ({
        ...item,
        amount: item.amount.toFixed(2),
        amountProfessional: item.amountProfessional.toFixed(2),
      }));
      setAppointments(responseFormatted);
      if (response.length > 0) {
        const totalAmountResponse =
          grouping === 'patient'
            ? response.reduce((sum, item) => sum + item.amount, 0)
            : response.reduce((sum, item) => sum + item.amountProfessional, 0);
        const totalAmountResponseFormatted = totalAmountResponse.toLocaleString(
          'pt-BR',
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );
        setTotalAmount(totalAmountResponseFormatted);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const getPatientInformation = async (patientId: string) => {
    try {
      const patient = await findPatientById(patientId);
      return patient;
    } catch (error) {
      console.error('Error fetching patient information:', error);
      return null;
    }
  };

  const generatePDF = async () => {
    const patientInformation = await getPatientInformation(selectedId);
    if (grouping === 'professional') {
      generatePDFProfessionalDocument({
        selectedName,
        appointments: appointments || [],
        totalAmount,
        patientInformation,
      });
    } else {
      generatePDFPatientDocument({
        selectedName,
        appointments: appointments || [],
        totalAmount,
        patientInformation,
      });
    }
  };

  return (
    <PageWrapper>
      <S.main>
        <PageTitle>Demonstrativo Financeiro</PageTitle>
        <S.Options>
          <S.InputContainer>
            <label htmlFor="relationship">Tipo de Demonstrativo</label>
            <S.Select
              value={grouping}
              onChange={(e) => {
                setGrouping(e.target.value as Grouping);
                setSelectedId('');
              }}
            >
              <option value="patient">Demonstrativo de Pacientes</option>
              <option value="professional">
                Demonstrativo de Profissionais
              </option>
            </S.Select>
          </S.InputContainer>
          <S.InputContainer>
            <label htmlFor="relationship">
              {grouping === 'patient' ? 'Paciente' : 'Profissional'}
            </label>
            <S.Select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setSelectedName(e.target.options[e.target.selectedIndex].text);
              }}
            >
              <option value="">
                Selecione um{' '}
                {grouping === 'patient' ? 'Paciente' : 'Profissional'}
              </option>
              {names.map((type, id) => (
                <option key={id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </S.Select>
          </S.InputContainer>
          <Button
            onClick={fetchAppointments}
            variant="terciary"
            id="generate-report-button"
          >
            Gerar Demonstrativo
          </Button>
        </S.Options>
        {appointments && (
          <S.TableContainer>
            <TableList
              columns={
                grouping === 'patient' ? columnsPatient : columnsProfessional
              }
              rows={appointments}
              withoutAccessBtn
              withoutDeleteButton
              hasTotalRow={
                grouping === 'professional' ? 'professional' : 'patient'
              }
            />
          </S.TableContainer>
        )}
        <Button
          id="download-report-button"
          onClick={generatePDF}
          disabled={!selectedId}
        >
          Baixar Demonstrativo Financeiro
        </Button>
      </S.main>
    </PageWrapper>
  );
};

export default FinancialReport;
