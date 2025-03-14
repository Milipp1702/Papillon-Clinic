import Modal from '../../../../components/Modal';
import Button from '../../../../components/baseComponents/Button';
import Input from '../../../../components/baseComponents/Input';
import VisuallyHidden from '../../../../components/baseComponents/VisuallyHidden';
import { Guardian } from '../..';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { ONLY_NUMBERS } from '../../../../constants/regexPatterns';
import { yupResolver } from '@hookform/resolvers/yup';
import { dataFormat } from '../../../../constants/types';
import InputError from '../../../../components/baseComponents/InputError';
import * as S from './styles';

type Props = {
  isOpen: boolean;
  editGuardian?: Guardian | null;
  onClose: () => void;
  onAdd: (prop: FormGuardianData) => void;
  onEdit: (prop: FormGuardianData) => void;
};

export type FormGuardianData = {
  name: string;
  relationship: string;
  cpf: string;
  phoneNumber: string;
  isMain: string;
};

const formErrors: dataFormat = {
  name: {
    required: 'Informe o nome do responsável!',
  },
  relationship: {
    required: 'Informe o grau!',
  },
  cpf: {
    required: 'Informe o CPF!',
    min: 'CPF deve ter no minímo 11 digitos!',
    matches: 'CPF deve possuir apenas números!',
  },
  phoneNumber: {
    required: 'Informe o numero de telefone!',
    min: 'Número inválido!',
    matches: 'Número de telefone deve possuir apenas números!',
  },
  isMain: {
    nullable: 'Informe se é responsável principal!',
  },
};

const GuardianModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAdd,
  onEdit,
  editGuardian,
}) => {
  const guardian = editGuardian
    ? { ...editGuardian, isMain: String(editGuardian?.isMain) }
    : null;

  const guardianSchema = object({
    name: string().trim().required(),
    relationship: string().trim().required(),
    cpf: string().trim().required().matches(ONLY_NUMBERS).min(11).max(11),
    phoneNumber: string()
      .trim()
      .required()
      .matches(ONLY_NUMBERS)
      .min(11)
      .max(11),
    isMain: string().required().nonNullable(),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormGuardianData>({
    resolver: yupResolver(guardianSchema),
    values: { ...guardian } as FormGuardianData,
  });

  const onSubmit = (data: FormGuardianData) => {
    if (guardian) {
      onEdit(data);
    } else {
      onAdd(data);
    }
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      title="Adicionar Responsável"
    >
      <S.Form>
        <S.Fieldset>
          <legend>
            <VisuallyHidden>Dados do responsável</VisuallyHidden>
          </legend>

          <S.InputWrapper>
            <S.InputContainer>
              <label htmlFor="name-guardian">Nome</label>
              <Input id="name-guardian" {...register('name')} />
              {errors.name?.type && (
                <InputError>{formErrors['name'][errors.name?.type]}</InputError>
              )}
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="relationship">Grau</label>
              <S.Select
                defaultValue={''}
                id="relationship"
                {...register('relationship')}
              >
                <option value="" disabled>
                  Selecione...
                </option>
                <option value="MAE">MÃE</option>
                <option value="PAI">PAI</option>
              </S.Select>
              {errors.relationship?.type && (
                <InputError>
                  {formErrors['relationship'][errors.relationship?.type]}
                </InputError>
              )}
            </S.InputContainer>
          </S.InputWrapper>
          <S.InputWrapper>
            <S.InputContainer>
              <label htmlFor="cpf-guardian">CPF</label>
              <Input id="cpf-guardian" {...register('cpf')} />
              {errors.cpf?.type && (
                <InputError>{formErrors['cpf'][errors.cpf?.type]}</InputError>
              )}
            </S.InputContainer>
            <S.InputContainer>
              <label htmlFor="phone-guardian">Celular</label>
              <Input id="phone-guardian" {...register('phoneNumber')} />
              {errors.phoneNumber?.type && (
                <InputError>
                  {formErrors['phoneNumber'][errors.phoneNumber?.type]}
                </InputError>
              )}
            </S.InputContainer>
          </S.InputWrapper>
        </S.Fieldset>

        <S.RadioButtonFieldset>
          <span className="title">Responsável Principal?</span>

          <S.RadioButtonWrapper role="radiogroup">
            <S.RadioContainer>
              <S.RadioButton
                id="radio_button_yes"
                type="radio"
                value="true"
                {...register('isMain')}
              />
              <label htmlFor="radio_button_yes">Sim</label>
            </S.RadioContainer>
            <S.RadioContainer>
              <S.RadioButton
                id="radio_button_no"
                type="radio"
                value="false"
                {...register('isMain')}
              />
              <label htmlFor="radio_button_no">Não</label>
            </S.RadioContainer>
          </S.RadioButtonWrapper>
          {errors.isMain?.type && (
            <InputError>{formErrors['isMain'][errors.isMain?.type]}</InputError>
          )}
        </S.RadioButtonFieldset>
        <Button
          className="button-add "
          type="button"
          variant="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Adicionar
        </Button>
      </S.Form>
    </Modal>
  );
};

export default GuardianModal;
