import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span{
        color: rgb(36, 36, 36);
        font-weight: 500;
        font-size: 16px;
    }

`;

export const WrapperStyleDelivery = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span{
        color: rgb(36, 36, 36);
        font-weight: 500;
        font-size: 16px;
    };
    margin-bottom: 4px;
`

export const WrapperLeft = styled.div`
    width: 910px;
`;

export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 84px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export const WrapperRight = styled.div`
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-left: auto;
`;

export const WrapperInfo = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    width: 100%;
`;

export const WrapperTotal = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 17px 20px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    width: 100%;

`;

export const WrapperListOrder = styled.div`
`;

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 16px;
    background: #fff;
`;

export const WrapperPriceDiscount = styled.div`
    color: #999;
    font - size: 12px;
`;


export const WrapperInputNumber = styled.div`
    width: 40px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
`