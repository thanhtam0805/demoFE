import { Row } from "antd";
import styled from "styled-components";

export const WraperHeader = styled(Row)`
  padding: 10px 120px;
  background-color: #E30019;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap;

`

export const WraperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align: left;
`

export const WraperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    font-size: 13px;
`

export const WraperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover{
        color: #E30019;
    }
`
