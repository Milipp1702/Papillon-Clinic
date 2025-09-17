import styled from 'styled-components';

export const AvailableSlotsTable = styled.table`
  width: 100%;
  font-weight: bold;
  border-spacing: 0;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.colors.grey[300]};
  border-radius: 4px;

  th,
  td {
    text-align: center;
    padding: 8px;
  }

  th:nth-child(2),
  td:nth-child(2),
  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(4),
  td:nth-child(4) {
    width: calc((100% - 40px) / 3);
  }

  tr {
    height: 62px;
  }

  td {
    height: 100%;
    border-left: 1px solid ${({ theme }) => theme.colors.grey[300]};
  }

  tr.grey {
    background-color: ${({ theme }) => theme.colors.grey[300]};
    td {
      border-left: 1px solid ${({ theme }) => theme.colors.white};
    }
  }

  .options-column {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 62px;
    gap: 24px;
  }
`;
