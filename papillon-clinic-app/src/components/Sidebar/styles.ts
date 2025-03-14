import styled, { css } from 'styled-components';

type Props = {
  $isOpen: boolean;
};

export const Nav = styled.nav<Props>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  width: ${({ $isOpen }) => ($isOpen ? '250px' : '94px')};
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  border-radius: 0px 10px 10px 0px;
  background-color: ${({ theme }) => theme.colors.terciary};
  box-shadow: 0px 0px 20px ${({ theme }) => theme.colors.grey[100]};

  transition: all 0.3s ease-in-out;

  span {
    transition: all 0.3s ease-out;
    overflow: hidden;
  }

  ${({ $isOpen }) =>
    !$isOpen
      ? css`
          img {
            opacity: 0;
            transition: all 0.1s ease-in-out;
            pointer-events: none;
          }

          & ~ div {
            left: 94px;
            width: calc(100% - 94px);
          }

          button.button-hamburguer {
            left: 10%;
            transition: all 0.3s ease-in-out;
          }

          span {
            opacity: 0;
            pointer-events: none;
          }
        `
      : css`
          img {
            transition: all 0.8s ease-in-out;
          }
        `}
`;

export const NavHeader = styled.div`
  display: flex;
  margin: 20px 20px;
  position: relative;
  align-items: center;

  button {
    width: 44px;
    height: 44px;
    position: absolute;
    left: 79%;
    transition: all 0.3s ease-in-out;
  }
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0px 20px;
  gap: 20px;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  height: 48px;
  align-content: center;
  font-weight: bold;
  border-radius: 10px;

  &:hover,
  &:focus-within {
    background-color: #4f9eac;
  }

  a {
    display: flex;
    align-items: center;
    gap: 15px;
    width: 100%;
    height: 100%;
    padding: 15px;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.white};

    &:focus {
      outline: none;
    }

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const NavFooter = styled.div<Props>`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.darkBlue};
  padding: 20px;
  justify-content: space-between;
  border-radius: 0px 0px 10px 0px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  ${({ $isOpen }) =>
    !$isOpen
      ? css`
          button {
            pointer-events: none;
          }
        `
      : null}

  button:hover {
    background-color: ${({ theme }) => theme.colors.terciary};
  }
`;

export const User = styled.div`
  display: flex;
  align-items: center;
`;

export const Credentials = styled.div`
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;

  span {
    display: block;
  }

  span:nth-child(2) {
    font-size: 1.2rem;
  }

  span.credentials-usermane {
    text-overflow: ellipsis;
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Avatar = styled.div`
  width: 54px;
  height: 54px;
  color: ${({ theme }) => theme.colors.white};
  text-shadow: 0px 0px 5px ${({ theme }) => theme.colors.grey[200]};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.sizes.large};
  background-color: ${({ theme }) => theme.colors.lightGreen};
`;
