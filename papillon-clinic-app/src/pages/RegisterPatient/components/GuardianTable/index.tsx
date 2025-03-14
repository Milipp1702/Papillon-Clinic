import { Guardian } from '../..';
import Icon from '../../../../components/Icon';
import Button from '../../../../components/baseComponents/Button';
import VisuallyHidden from '../../../../components/baseComponents/VisuallyHidden';
import * as S from './styles';

type props = {
  guardians: Guardian[];
  onCickEdit: (cpf: string) => void;
  onClickDelete: (cpf: string) => void;
};

const GuardianTable: React.FC<props> = ({
  guardians,
  onCickEdit,
  onClickDelete,
}) => {
  return (
    <S.GuardianTable>
      <thead>
        <tr>
          <th>
            <VisuallyHidden>Nome</VisuallyHidden>
          </th>
          <th>
            <VisuallyHidden>CPF</VisuallyHidden>
          </th>
          <th>
            <VisuallyHidden>Parentesco</VisuallyHidden>
          </th>
          <th>
            <VisuallyHidden>Tipo</VisuallyHidden>
          </th>
          <th>
            <VisuallyHidden>Número</VisuallyHidden>
          </th>
          <th>
            <VisuallyHidden>Opções</VisuallyHidden>
          </th>
        </tr>
      </thead>
      <tbody>
        {guardians &&
          guardians.map((guardian, index) => {
            const variant = index % 2 === 0 ? '' : 'grey';

            return (
              <tr className={variant} key={'guardian-' + index + guardian.name}>
                <td>{guardian.name}</td>
                <td>{guardian.cpf}</td>
                <td>{guardian.relationship}</td>
                <td>{guardian.isMain ? 'Principal' : 'Secundário'}</td>
                <td>{guardian.phoneNumber}</td>
                <td className="options-column">
                  <Button
                    variant="iconButton"
                    type="button"
                    aria-label="Editar Responsável "
                    onClick={() => onCickEdit(guardian.cpf)}
                  >
                    <Icon icon="pencil" size={24} />
                  </Button>
                  <Button
                    variant="iconButton"
                    type="button"
                    aria-label="Excluir Responsável "
                    onClick={() => onClickDelete(guardian.cpf)}
                  >
                    <Icon icon="trashCan" size={24} />
                  </Button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </S.GuardianTable>
  );
};

export default GuardianTable;
