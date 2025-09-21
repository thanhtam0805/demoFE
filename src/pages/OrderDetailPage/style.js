import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    height: 100vh;
    background: #f5f5fa;
`;

export const WrapperHeaderUser = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 10px;
`;

export const WrapperInfoUser = styled.div`
    flex: 1;
    background: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-right: 15px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

export const WrapperLabel = styled.div`
    font-weight: bold;
    color: #000;
    margin-bottom: 10px;
    font-size: 18px;
`;

export const WrapperContentInfo = styled.div`
    .name-info, .address-info, .phone-info, .delivery-info, .payment-info {
        font-size: 16px;
        color: #333;
        margin-bottom: 5px;
    }

    .name-delivery {
        color: #ff8000;
        font-weight: bold;
    }

    .status-payment {
        color: #ff8000;
        font-weight: bold;
    }
        
    .delivery-fee{
        font-size: 14px;
        
    }
    .status-payment{
        font-size: 14px;
    }    
`;

export const WrapperStyleContent = styled.div`
    margin-top: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

export const WrapperProduct = styled.div`
    display: grid;
    grid-template-columns: 4fr 1fr 1fr 1fr;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
`;

export const WrapperNameProduct = styled.div`
    display: flex;
    align-items: center;
    width: 610px;
`;


export const WrapperItem = styled.div`
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    &:last-child {
        color: red;
    }
`;
export const WrapperItemBabel = styled.div`
    text-align: center;
    font-size: 18px;
    font-weight: bold;
`;

export const WrapperPrice = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`


