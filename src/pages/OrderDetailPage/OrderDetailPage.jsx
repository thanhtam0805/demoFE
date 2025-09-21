import React, { useMemo } from 'react'
import {
    Container,
    WrapperContentInfo,
    WrapperHeaderUser,
    WrapperInfoUser,
    WrapperItem,
    WrapperItemBabel,
    WrapperLabel,
    WrapperNameProduct,
    WrapperPrice,
    WrapperProduct,
    WrapperStyleContent
} from './style'
import { useLocation, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import Loading from '../../component/LoadingComponent/Loading'


const OrderDetailPage = () => {
    const params = useParams();
    const location = useLocation()
    const { state } = location
    const { id } = params
    const fetchDetailOrder = async () => {
        const res = await OrderService.getOrderDetails(id, state?.token)
        return res.data
    }
    const queryOrder = useQuery({
        queryKey: ['order-detail'],
        queryFn: fetchDetailOrder
    }, { enabled: id })

    const { isLoading, data } = queryOrder

    const priceMemo = useMemo(() => {
        const result = data?.orderItems?.reduce((total, cur) => {
            return total + ((cur?.price * cur?.amount))
        }, 0)
        return result
    }, [data])
    return (
        <Loading isLoading={isLoading}>
            <Container>
                <div style={{ width: '1270px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Chi tiết đơn hàng</h2>
                    <WrapperHeaderUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
                            <WrapperContentInfo>
                                <div className='name-info'>{data?.shippingAdress?.fullName}</div>
                                <div className='address-info'><span>Địa chỉ: </span>{`${data?.shippingAdress?.address}-${data?.shippingAdress?.city}`}</div>
                                <div className='phone-info'><span>Điện thoại: </span>{data?.shippingAdress?.phone}</div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Hình thức giao hàng</WrapperLabel>
                            <WrapperContentInfo>
                                <div className='delivery-info'><span className='name-delivery'>{orderContant[data?.delivery]}</span> giao hàng tiết kiệm</div>
                                <div className='delivery-fee'><span>Phí giao hàng: </span>{convertPrice(data?.shippingPrice)}</div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                        <WrapperInfoUser>
                            <WrapperLabel>Hình thức thanh toán</WrapperLabel>
                            <WrapperContentInfo>
                                <div className='payment-info'>{orderContant[data?.paymentMethod]}</div>
                                <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                            </WrapperContentInfo>
                        </WrapperInfoUser>
                    </WrapperHeaderUser>
                    <WrapperStyleContent>
                        <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 1fr 1fr', padding: '10px 0', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                            <WrapperItemBabel>Sản phẩm</WrapperItemBabel>
                            <WrapperItemBabel>Giá</WrapperItemBabel>
                            <WrapperItemBabel>Số lượng</WrapperItemBabel>
                            <WrapperItemBabel>Giảm giá</WrapperItemBabel>
                        </div>
                        {data?.orderItems?.map((order, index) => (
                            <WrapperProduct key={index} style={{ gridTemplateColumns: '4fr 1fr 1fr 1fr' }}>
                                <WrapperNameProduct>
                                    <img
                                        src={order?.image || '/default-product.png'}
                                        alt="Product"
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            objectFit: 'cover',
                                            marginRight: '10px',
                                            border: '1px solid #f5f5f5'
                                        }}
                                    />
                                    <div style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        fontSize: '14px'
                                    }}>
                                        {order?.name || 'Điện thoại'}
                                    </div>
                                </WrapperNameProduct>

                                <WrapperItem>{convertPrice(order?.price || 0)}</WrapperItem>
                                <WrapperItem>{order?.amount || 1}</WrapperItem>
                                <WrapperItem>{order?.discount ? convertPrice(priceMemo * (order?.discount / 100)) : '0 VND'}</WrapperItem>
                            </WrapperProduct>
                        ))}
                        <WrapperPrice>
                            <WrapperItemBabel>Tạm tính</WrapperItemBabel>
                            <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
                        </WrapperPrice>
                        <WrapperPrice>
                            <WrapperItemBabel>Phí vận chuyển</WrapperItemBabel>
                            <WrapperItem>{convertPrice(data?.shippingPrice || 0)}</WrapperItem>
                        </WrapperPrice>
                        <WrapperPrice>
                            <WrapperItemBabel>Tổng cộng</WrapperItemBabel>
                            <WrapperItem>{convertPrice(data?.totalPrice || 0)}</WrapperItem>
                        </WrapperPrice>
                    </WrapperStyleContent>
                </div>
            </Container>
        </Loading>

    )
}

export default OrderDetailPage