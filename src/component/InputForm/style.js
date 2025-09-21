import styled from 'styled-components';
import { Input } from 'antd';


export const WrapperInputStyle = styled(Input)`
    border-top: none;
    border-left: none;
    border-right: none;
    outline: none;
    &:focus{
        background-color: rgb(232, 240, 254);
    }

`