import styled from "styled-components";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: center;
  height: 44px;
  font-size: 14px;
`;

export const WrapperButton = styled(ButtonComponent)`
  &:hover {
    color: #fff;
    background-color: #dc3545;
    span {
      color: #fff;
    }
  }
  width: 100%;
  text-align: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* Chỉnh 6 cột */
  gap: 20px;
  margin-top: 20px;
  max-width: 1370px;
  margin: 0 auto;
`;
