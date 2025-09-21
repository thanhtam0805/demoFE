import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import Loading from '../../component/LoadingComponent/Loading'
import { WrapperInfo, WrapperContainer, WrapperValue, WrapperItemOrder, WrapperItemOrderInfo } from './style'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import * as OrderService from '../../services/OrderService'

const OrderSuccess = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const user = useSelector(state => state.user)
    const [orderDetail, setOrderDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let id = location.state?.orderId || localStorage.getItem("orderSuccessId")
        if (!id) {
            setError("Không tìm thấy thông tin đơn hàng!")
            setLoading(false)
            return
        }
        // Luôn fetch lại từ server để chuẩn nghiệp vụ
        const fetchOrder = async () => {
            try {
                setLoading(true)
                // Đảm bảo có token, nếu không có thì yêu cầu login lại!
                if (!user?.access_token) {
                    setError("Bạn cần đăng nhập để xem đơn hàng.")
                    setLoading(false)
                    return
                }
                const res = await OrderService.getOrderDetails(id, user.access_token)
                if (res.status === 'OK' && res.data) {
                    setOrderDetail(res.data)
                    setError("")
                } else {
                    setError("Không tìm thấy thông tin đơn hàng!")
                }
            } catch (err) {
                setError("Không thể lấy thông tin đơn hàng!")
            }
            setLoading(false)
        }
        fetchOrder()
    }, [location.state, user])

    if (loading) return <Loading isLoading={true} />

    if (error) return <div style={{ padding: 40, color: "red" }}>{error}</div>

    // Nếu backend trả về dạng orderDetail.shippingAdress, orderItems, paymentMethod...
    return (
        <div style={{ background: '#fff', width: '100%', height: '100vh' }}>
            <Loading isLoading={false}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h2>Đặt thành công</h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperContainer>
                            <WrapperInfo>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Phương thức giao hàng</label>
                                    <WrapperValue>
                                        <span style={{ color: '#ea8500', fontWeight: 'bold' }}>
                                            {orderContant.delivery[orderDetail?.shippingAdress?.delivery || orderDetail?.delivery]}
                                        </span> Giao hàng tiết kiệm
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Phương thức thanh toán</label>
                                    <WrapperValue>
                                        {orderContant.payment[orderDetail?.paymentMethod]}
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperItemOrderInfo>
                                {orderDetail.orderItems?.map((order) => {
                                    return (
                                        <WrapperItemOrder key={order?.name}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <img
                                                    src={order?.image}
                                                    alt='img'
                                                    style={{
                                                        width: '77px',
                                                        height: '79px',
                                                        objectFit: 'cover',
                                                        marginRight: '10px'
                                                    }}
                                                />
                                                <div style={{
                                                    width: '260px',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    fontSize: '14px'
                                                }}>
                                                    {order?.name}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>
                                                    Giá tiền: {convertPrice(order?.price)}
                                                </span>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>
                                                    Số lượng: {order?.amount}
                                                </span>
                                            </div>
                                        </WrapperItemOrder>
                                    )
                                })}
                            </WrapperItemOrderInfo>
                            <div>
                                <span style={{ fontSize: '16px', color: 'rgb(254, 56, 52)' }}>
                                    Tổng tiền: {convertPrice(orderDetail?.totalPrice)}
                                </span>
                            </div>
                        </WrapperContainer>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default OrderSuccess
