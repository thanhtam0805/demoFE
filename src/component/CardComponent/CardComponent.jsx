import React from 'react'
import { StarFilled } from '@ant-design/icons';
import { StyleProductName, WrapperDiscount, WrapperPrice, WrapperReportText, WrapperCard, WrapperStyleTextSell } from './style';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils';

const CardComponent = (props) => {
    const { countInStock, image, name, price, rating, discount, selled, id } = props
    const navigate = useNavigate()

    return (
        <WrapperCard
            hoverable
            headStyle={{ width: '200px', height: '200px' }}
            style={{ width: 200 }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick={() => navigate(`/product-detail/${id}`)}

        >

            <StyleProductName>{name}</StyleProductName>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating}</span><StarFilled style={{ fontSize: '13px', color: 'yellow' }} />
                </span>
                <WrapperStyleTextSell> |  Đã bán {selled || 999} +</WrapperStyleTextSell>

            </WrapperReportText>
            <WrapperPrice>
                <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
                <WrapperDiscount>
                    - {discount || 5} %
                </WrapperDiscount>
            </WrapperPrice>


        </WrapperCard>
    )
}

export default CardComponent