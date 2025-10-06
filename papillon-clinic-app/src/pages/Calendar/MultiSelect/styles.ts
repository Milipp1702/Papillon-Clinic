import styled from 'styled-components';

export const MultiSelectContainer = styled.div`
  display: flex;
  gap: 20px;
  position: relative;
  margin-bottom: 20px;
  width: 400px;

  .button-search {
    width: 100px;
    font-size: 2.2rem;
    min-height: 40px;
  }

  .button-container {
    display: flex;
    align-items: flex-end;
  }
`;

export const Dropdown = styled.div`
  position: relative;
  width: 250px;
`;

export const DropdownToggle = styled.button`
  width: 100%;
  padding: 8px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  cursor: pointer;
  text-align: left;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  z-index: 1000;
`;

export const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  padding: 6px 8px;
  cursor: pointer;

  input {
    margin-right: 8px;
  }
`;
