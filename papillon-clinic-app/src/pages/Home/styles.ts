import styled from 'styled-components';

export const Main = styled.main`
  min-height: 100vh;
  padding-top: 60px;
  overflow: auto;
  margin: 0 auto;
  max-width: 90%;
`;

export const Display = styled.div`
  display: grid;
  align-items: start;
  gap: 20px;
  padding: 20px;
  grid-template-columns: 1fr 1fr;
`;

export const Header = styled.header`
  display: flex;
  justify-content: center;
  padding: 30px;

  border-bottom: 3px solid ${({ theme }) => theme.colors.primary};

  img {
    width: 290px;
  }
`;

export const RankingList = styled.ul`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 400px;
  border-radius: 6px;
  padding: 25px;

  h2 {
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
    margin-bottom: 14px;
  }

  div {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 6px;
    height: 100%;
    max-height: 240px;
    overflow: auto;
  }
`;

export const RankingListItem = styled.li`
  font-weight: bold;
  padding: 15px;

  span {
    margin-right: 10px;
  }

  &.grey {
    background-color: ${({ theme }) => theme.colors.grey[300]};
  }
`;

export const QuantityCardContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: space-between;
`;

export const QuantityCard = styled.article`
  display: flex;
  width: 100%;
  align-items: center;
  align-self: baseline;
  font-size: ${({ theme }) => theme.sizes.large};
  max-width: 400px;
  max-height: 80px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
  padding: 20px 50px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.primary};

  border: 6px solid #de9393;

  span {
    font-size: 42px;
    margin-right: 16px;
  }
`;
