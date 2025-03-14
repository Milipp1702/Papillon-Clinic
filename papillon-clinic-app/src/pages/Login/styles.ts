import styled from 'styled-components';

export const Container = styled.main`   
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    max-width: 35%;
    align-items: center;
    flex-direction: column;
    gap: 60px;

    h2{
        text-transform: uppercase;
        letter-spacing: 3px;
        color: ${({theme}) => theme.colors.title};
        font-size: 2.8rem;
    }

    button {
        max-width: 200px;
    }

    img.logo {
        max-width: 325px;
        max-height: 70px;
        margin-top: 20px;
    }

    img.trailTop,
    img.trailBottom {
        position: absolute;
        z-index: -1;
        rotate: 66deg;
    }

    img.trailTop {
        top: -66px;
        left: 77%;
    }

    img.trailBottom {
        bottom: -63px;
        left: 0;
    }
`;

export const Form = styled.form`
    background-color: ${({theme}) => theme.colors.lightYellow};
    border-radius: 13px;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 40px;
`;

export const FormContainer = styled.div`
    background-color: ${({theme}) => theme.colors.lightYellow};
    border-radius: 13px;
    width: 100%;
    padding: 40px 0 60px 0;
`;

export const InputContainer = styled.div`
    width: 65%;
    label{
        font-weight: bold;
    }
`;
