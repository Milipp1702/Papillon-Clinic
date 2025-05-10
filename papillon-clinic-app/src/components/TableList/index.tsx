import Icon from '../Icon';
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
  redirect: string;
};

const TableList: React.FC<Props> = ({ columns, rows, redirect }) => {
  return (
    <S.GuardianTable>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={`table-list-header-${index}`}>
              <span>{column.headerName}</span>
            </th>
          ))}
          <th key={`table-list-header-access`}>
            <span>Acessar</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const variant = index % 2 === 0 ? '' : 'grey';

          return (
            <tr className={variant} key={'tablelist-' + index}>
              {columns.map((column, index) => (
                <td key={`tablelist-item-${index}`}>
                  {column.renderCell
                    ? column.renderCell(row[column.field])
                    : row[column.field]}
                </td>
              ))}

              <td className="options-column">
                <Link
                  variant="button"
                  variantButton="primary"
                  to={`${redirect}/${row['id']}`}
                  aria-label="Acessar"
                >
                  <Icon icon="redirect" size={20} />
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </S.GuardianTable>
  );
};

export default TableList;
