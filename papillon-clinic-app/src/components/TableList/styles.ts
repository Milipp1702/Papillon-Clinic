import styled from 'styled-components';

export const GuardianTable = styled.table`
  font-weight: bold;
  border-spacing: 0;
  width: 100%;

  thead {
    text-align: left;
  }

  tr {
    height: 62px;

    :nth-child(1) {
      border-left: none;
    }
  }

  td {
    height: 100%;
    text-align: center;
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

    a {
      max-width: 200px;

      gap: 6px;
    }
  }
`;
