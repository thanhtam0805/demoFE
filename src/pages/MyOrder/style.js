import styled from "styled-components";

export const WrapperStyleDelivery = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span {
        color: rgb(36, 36, 36);
        font-weight: 500;
        font-size: 16px;
    };
    margin-bottom: 4px;
`;

export const WrapperListOrder = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
`;

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 16px;
    background: #fff;
    margin-top: 12px;
    flex-direction: column;
    width: 100%;
    max-width: 950px;
    margin: 0 auto;
    border-radius: 6px;
    box-shadow: 0 12px 12px #ccc;
`;

export const WrapperStatus = styled.div`
    display: flex;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f5f5f5;
    flex-direction: column;
    font-size: 14px;

    span {
        font-weight: bold;
    }
`;

export const WrapperHeaderItem = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;

    span {
        color: rgb(36, 36, 36);
        font-weight: 500;
        font-size: 14px;
    }
`;

export const WrapperFooterItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-top: 1px solid #f5f5f5;
    padding-top: 10px;
    margin-top: 10px;
    gap: 20px;
`;

export const WrapperContainer = styled.div`
    width: 100%;
    
    background-color: #f5f5f5;
    padding: 20px 0;
`;
