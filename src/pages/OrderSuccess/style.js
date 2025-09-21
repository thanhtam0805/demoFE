import styled from "styled-components";

// export const WrapperStyleHeader = styled.div`
//     background: rgb(255, 255, 255);
//     padding: 9px 16px;
//     border-radius: 4px;
//     display: flex;
//     align-items: center;
//     span{
//         color: rgb(36, 36, 36);
//         font-weight: 500;
//         font-size: 16px;
//     }

// `;


export const WrapperRadio = styled.div`
 width: 600px;
    height: 100%;
    border: 1px solid #dc3545;
    border-radius: 4px;
    margin-top: 20px;
    padding: 10px;
    padding-bottom: 20px;
`

export const WrapperRight = styled.div`
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    margin-left: auto;
    margin-top: 20px; 
`;

export const WrapperValue = styled.div`
    background: rgb(240, 248, 255);
    border: 1px solid rgb(194, 225, 255);
    padding: 10px;
    font-size: 16px;
    width: fit-content;
    border-radius: 6px;
    margin-top: 4px;
`

export const WrapperContainer = styled.div`
    width: 100%;
     
`;

export const WrapperInfo = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    width: 100%;
`;

export const WrapperItemOrderInfo = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
    border-radius: 6px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px; 
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

export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 84px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export const WrapperItemOrder = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    gap: 8px;
    align-items: flex-start; /* Align content to the left */
`;