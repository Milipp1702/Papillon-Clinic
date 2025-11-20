import Icon from '../Icon';
import Button from '../baseComponents/Button';
import Link from '../baseComponents/Link';
import * as S from './styles';

type Column = {
  field: string;
  headerName: string;
  renderCell?: (value: any) => React.ReactNode;
};

type Row = {
  [key: string]: string;
};

type Props = {
  columns: Column[];
  rows: Row[];
  redirect?: string;
  withoutAccessBtn?: boolean;
  withoutDeleteButton?: boolean;
  hasTotalRow?: string;
  onDeleteRequest?: (id: string) => void;
};

const TableList: React.FC<Props> = ({
  columns,
  rows,
  redirect,
  withoutAccessBtn,
  withoutDeleteButton,
  hasTotalRow,
  onDeleteRequest,
}) => {
  return (
    <S.GuardianTable>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={`table-list-header-${index}`}>
              <span>{column.headerName}</span>
            </th>
          ))}
          {!withoutAccessBtn && (
            <th key={`table-list-header-access`} className="action-header">
              <span>Acessar</span>
            </th>
          )}
          {!withoutDeleteButton && (
            <th key={`table-list-header-delete`} className="action-header">
              <span>Excluir</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length + (withoutAccessBtn ? 0 : 2)}
              className="empty-table"
            >
              <Icon icon="warning" size={80} primaryColor="#666" />
              Nenhum atendimento cadastrado.
            </td>
          </tr>
        ) : (
          <>
            {rows.map((row, index) => {
              const variant = index % 2 === 0 ? '' : 'grey';

              return (
                <>
                  <tr className={variant} key={'tablelist-' + index}>
                    {columns.map((column, index) => (
                      <td key={`tablelist-item-${index}`}>
                        {column.renderCell
                          ? column.renderCell(row[column.field])
                          : row[column.field]}
                      </td>
                    ))}
                    {!withoutAccessBtn && (
                      <td className="action-cell options-column">
                        <Link
                          variant="button"
                          variantButton="primary"
                          to={`${redirect}/${row['id']}`}
                          aria-label="Acessar"
                        >
                          <Icon icon="redirect" size={20} />
                        </Link>
                      </td>
                    )}
                    {!withoutDeleteButton && (
                      <td className="action-cell">
                        <div className="options-column">
                          <Button
                            onClick={() => onDeleteRequest?.(row['id'])}
                            aria-label="Deletar"
                          >
                            <Icon icon="close" size={20} />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                </>
              );
            })}
            {hasTotalRow && (
              <tr className="total-row">
                {columns.map((col, index) => {
                  const total =
                    hasTotalRow === 'professional'
                      ? rows.reduce(
                          (sum, row) =>
                            sum + Number(row.amountProfessional || 0),
                          0
                        )
                      : rows.reduce(
                          (sum, row) => sum + Number(row.amount || 0),
                          0
                        );
                  if (index === columns.length - 2) {
                    return (
                      <td
                        key={`total-label-${index}`}
                        style={{ fontWeight: 'bold', textAlign: 'right' }}
                      >
                        Total:
                      </td>
                    );
                  }
                  if (index === columns.length - 1) {
                    return (
                      <td
                        key={`total-value-${index}`}
                        style={{ fontWeight: 'bold' }}
                      >
                        R$ {total.toFixed(2).replace('.', ',')}
                      </td>
                    );
                  }
                  return <td key={`total-empty-${index}`}></td>;
                })}
              </tr>
            )}
          </>
        )}
      </tbody>
    </S.GuardianTable>
  );
};

export default TableList;
