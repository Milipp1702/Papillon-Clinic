import styled from 'styled-components';

export const GuardianTable = styled.table`
  font-weight: bold;
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;

  thead {
    text-align: left;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: #fff;
  }

  tr {
    height: 62px;

    :nth-child(1) {
      border-left: none;
    }

    .empty-table > div {
      margin: 10px auto;
    }

    .empty-table {
      background-color: ${({ theme }) => theme.colors.grey[300]};
      padding: 20px 0;
    }
  }

  td {
    height: 100%;
    text-align: center;
    border-left: 1px solid ${({ theme }) => theme.colors.grey[300]};
  }

  tbody {
    max-height: 100%;
    overflow-y: auto;
    position: relative;
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

    a {
      max-width: 200px;
      gap: 6px;
    }

    a,
    button {
      width: auto;
      padding: 0 11px;
    }
  }

  .action-header {
    width: 80px;
  }

  .action-cell {
    width: 80px;
    min-width: 60px;
    max-width: 100px;
    padding: 0;
  }
`;
