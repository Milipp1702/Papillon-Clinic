import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useContext, useEffect, useState } from 'react';
import PageWrapper from '../../components/PageWrapper';
import * as S from './styles';
import { useClinicApi } from '../../services/api/useClinicApi';
import { ProfessionalListDTO, AppointmentListDTO } from '../../services/dtos';
import MultiSelect from './MultiSelect';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import { useNavigate } from 'react-router-dom';
import { SCREEN_PATHS } from '../../constants/paths';
import Link from '../../components/baseComponents/Link';
import { AuthContext } from '../../context/AuthContext';

export interface EventType {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  textColor: string;
  extendedProps: {
    patient: string;
    professional: string;
    specialty: string;
    type: string;
    isPaid: boolean;
  };
}

const Calendar: React.FC = () => {
  const {
    getAppointmentsForCalendar,
    getAllProfessionals,
    getProfessionalIdByUser,
  } = useClinicApi();
  const [appointments, setAppointments] = useState<AppointmentListDTO[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalListDTO[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<EventType[]>([]);
  const [selectedIds, setSelectedIds] = useState<String[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventType>(
    {} as EventType
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleEdit = () => {
    if (selectedEvent) {
      navigate(SCREEN_PATHS.appointment.replace(':id', selectedEvent.id));
    }
  };

  const handleEventClick = (info: any) => {
    info.jsEvent.preventDefault();
    setSelectedEvent(info.event);
    setIsModalOpen(true);
  };

  const toggleProfessional = (id: String) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getAppointments = async (ids?: String[]) => {
    try {
      const query = ids && ids.length > 0 ? ids : [];
      const response = await getAppointmentsForCalendar(query);
      setAppointments(response);
    } catch (error) {
      console.error('Erro ao buscar atendimentos:', error);
    }
  };

  const getProfessionals = async () => {
    try {
      const response = await getAllProfessionals();
      setProfessionals(response);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      getProfessionals();
      getAppointments();
    } else {
      const userId = user?.id;
      if (userId) {
        getProfessionalIdByUser(userId).then((response) => {
          getAppointments([response]);
        });
      }
    }
  }, []);

  useEffect(() => {
    const appointmentsMapped = appointments.map((a) => {
      const endDate = new Date(a.appointmentDate).getTime() + 60 * 60000;
      const endDateFormatted = new Date(endDate).toISOString();

      return {
        id: a.id,
        title: `${a.patientName} (${a.professionalName})`,
        start: a.appointmentDate,
        end: endDateFormatted,
        backgroundColor: '#4f46e5',
        textColor: '#ffffff',
        extendedProps: {
          patient: a.patientName,
          professional: a.professionalName,
          specialty: a.specialtyName,
          type: a.typeName,
          isPaid: a.isPaid,
        },
      };
    });

    setCalendarEvents(appointmentsMapped);
  }, [appointments]);

  return (
    <PageWrapper>
      <S.Main>
        {user?.role === 'ADMIN' && (
          <div className="top-bar">
            <MultiSelect
              professionals={professionals}
              selectedIds={selectedIds}
              toggleProfessional={toggleProfessional}
              getAppointments={getAppointments}
            />
            <Link
              to={SCREEN_PATHS.registerAppointment}
              variant="button"
              variantButton="terciary"
              className="new-appointment-button"
            >
              Novo Atendimento
            </Link>
          </div>
        )}

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={calendarEvents}
          locale="pt-br"
          height="auto"
          eventClick={handleEventClick}
        />
        <AppointmentDetailsModal
          isOpen={isModalOpen}
          onEdit={handleEdit}
          event={selectedEvent}
          onRequestClose={() => setIsModalOpen(false)}
        />
      </S.Main>
    </PageWrapper>
  );
};

export default Calendar;
