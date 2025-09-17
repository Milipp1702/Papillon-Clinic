import styled from 'styled-components';

export const WorkdayContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  background-color: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  border: 1px solid #ccc;
  margin: 3rem 10% 0;
  font-size: 16px;
`;

export const DayHeader = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: flex;
  gap: 1rem;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: 20px;
`;
