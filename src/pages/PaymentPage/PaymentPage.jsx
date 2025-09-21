import { Form, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent'
import { convertPrice } from '../../utils'
import ModalComponent from '../../component/ModalComponent/ModalComponent'
import Inputcomponent from '../../component/InputComponent/Inputcomponent'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import Loading from '../../component/LoadingComponent/Loading'
import * as message from '../../component/Message/Message'
import { updateUser } from '../../redux/slides/userSlice'
import * as OrderService from '../../services/OrderService'
import { useNavigate } from 'react-router-dom'
import { removeAllFromCart } from '../../redux/slides/orderSlice'
import * as PaymentService from '../../services/PaymentService'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

const PaymentPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false)
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const [payment, setPayment] = useState()
    const [delivery, setDelivery] = useState()
    const navigate = useNavigate()
    const [clientId, setClientId] = useState("")
    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    })

    useEffect(() => {
        if (isOpenModalUpdate) {
            setStateUserDetail({
                name: user?.name,
                phone: user?.phone,
                address: user?.address,
                city: user?.city
            })
        }
    }, [isOpenModalUpdate, user])

    const handleChangeAddress = () => {
        setIsOpenModalUpdate(true)
    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetail)
    }, [form, stateUserDetail])

    // Lấy client id paypal từ server
    useEffect(() => {
        const fetchClientId = async () => {
            const { data } = await PaymentService.getConfig()
            setClientId(data)
        }
        fetchClientId()
    }, [])

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur?.price * cur?.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur?.discount * cur?.amount))
        }, 0)
        if (Number(result)) {
            return result
        }
        return 0
    }, [order])

    const deliveryMemo = useMemo(() => {
        if (priceMemo > 1000000) {
            return 10000
        } else if (priceMemo === 0) {
            return 0
        } else {
            return 20000
        }
    }, [priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryMemo)
    }, [priceMemo, priceDiscountMemo, deliveryMemo])

    const handleAddOrder = () => {
        if (user?.access_token && order?.orderItemsSelected && user?.name
            && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
            mutationAddOrder.mutate(
                {
                    token: user?.access_token,
                    orderItems: order?.orderItemsSelected,
                    fullName: user?.name,
                    address: user?.address,
                    phone: user?.phone,
                    city: user?.city,
                    paymentMethod: payment,
                    itemsPrice: priceMemo,
                    shippingPrice: deliveryMemo,
                    totalPrice: totalPriceMemo,
                    user: user?.id,
                    email: user?.email
                }
            )
        }
    }

    const handleCancel = () => {
        setStateUserDetail({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
        setIsOpenModalUpdate(false)
    }

    const mutationUpdate = useMutationHook(
        (data) => {
            const { id,
                token,
                ...rests
            } = data
            const res = UserService.updateUser(
                id,
                { ...rests },
                token)
            return res
        }
    )

    const mutationAddOrder = useMutationHook(
        (data) => {
            const {
                token,
                ...rests
            } = data
            const res = OrderService.createOrder(
                { ...rests }, token)
            return res
        }
    )

    const { isLoading, data } = mutationUpdate
    const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder

    // useEffect(() => {
    //     if (isSuccess && dataAdd?.status === 'OK') {
    //         const arrayOrdered = []
    //         order?.orderItemsSelected?.forEach(element => {
    //             arrayOrdered.push(element.product)
    //         })
    //         dispatch(removeAllFromCart({ listChecked: arrayOrdered }))
    //         message.success('Đặt hàng thành công')
    //         navigate('/orderSuccess', {
    //             state: {
    //                 delivery,
    //                 payment,
    //                 orders: order?.orderItemsSelected,
    //                 totalPriceMemo: totalPriceMemo
    //             }
    //         })
    //     } else if (isError) {
    //         message.error()
    //     }
    // }, [isSuccess, isError, dataAdd, order, dispatch, delivery, payment, totalPriceMemo, navigate])


useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK' && dataAdd.order?._id) {
        const arrayOrdered = []
        order?.orderItemsSelected?.forEach(element => {
            arrayOrdered.push(element.product)
        })
        dispatch(removeAllFromCart({ listChecked: arrayOrdered }))
        message.success('Đặt hàng thành công')

        // Lưu orderId vào localStorage để phòng trường hợp F5 hoặc vào lại trang
        localStorage.setItem("orderSuccessId", dataAdd.order._id);

        // Navigate truyền kèm orderId
        navigate('/orderSuccess', {
            state: {
                orderId: dataAdd.order._id,
            }
        })
    } else if (isError) {
        message.error()
    }
}, [isSuccess, isError, dataAdd, order, dispatch, delivery, payment, totalPriceMemo, navigate]);





    const handleUpdate = () => {
        const { name, phone, address, city } = stateUserDetail
        if (name && phone && address && city) {
            mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetail }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, phone, address, city }))
                    setIsOpenModalUpdate(false)
                }
            })
        }
    }

    const handleOnchangeDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value
        })
    }

    const handleDelivery = (e) => {
        setDelivery(e.target.value);
    };

    const handlePayment = (e) => {
        setPayment(e.target.value);
    };

    const onSuccessPaypal = (details, data) => {
        mutationAddOrder.mutate(
            {
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: deliveryMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                isPaid: true,
                paidAt: details.update_time,
                email: user?.email
            }
        )
    }

    return (
        <div style={{ background: '#fff', width: '100%', height: '100vh' }}>
            <Loading isLoading={isLoadingAddOrder}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h2>Thanh toán</h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperLeft>
                            <WrapperInfo>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px' }}>Lựa chọn phương thức giao hàng</label>
                                    <Radio.Group onChange={handleDelivery} value={delivery} style={{
                                        width: '600px',
                                        height: '100%',
                                        border: '1px solid #dc3545',
                                        borderRadius: '4px',
                                        marginTop: '20px',
                                        padding: '10px',
                                        paddingBottom: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px'
                                    }}>
                                        <Radio value="fast"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>FAST</span> Giao hàng nhanh</Radio>
                                        <Radio value="gojeck"><span style={{ color: '#ea8500', fontWeight: 'bold' }}>GO_JECK</span> Giao hàng tiết kiệm</Radio>
                                    </Radio.Group>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '10px' }}>Lựa chọn phương thức thanh toán</label>
                                    <Radio.Group onChange={handlePayment} value={payment} style={{
                                        width: '600px',
                                        height: '100%',
                                        border: '1px solid #dc3545',
                                        borderRadius: '4px',
                                        marginTop: '20px',
                                        padding: '10px',
                                        paddingBottom: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px'
                                    }}>
                                        <Radio value="pay_later">Thanh toán khi nhận hàng</Radio>
                                        <Radio value="paypal">Thanh toán qua paypal</Radio>
                                    </Radio.Group>
                                </div>
                            </WrapperInfo>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{ width: '100%' }}>
                                <WrapperInfo>
                                    <div style={{ fontSize: '15px' }}>
                                        <span>Địa chỉ: </span>
                                        <span style={{ fontWeight: 'bold' }}>{`${user?.address}-${user?.city}`}</span>
                                        <span onClick={handleChangeAddress} style={{ color: 'blue', cursor: 'pointer' }}> -Thay đổi</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Tạm tính</span>
                                        <span style={{ color: "#000", fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceMemo)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Giảm giá</span>
                                        <span style={{ color: "#000", fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(priceDiscountMemo)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Phí giao hàng</span>
                                        <span style={{ color: "#000", fontSize: '14px', fontWeight: 'bold' }}>{convertPrice(deliveryMemo)}</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span>Tổng tiền</span>
                                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                                        <span style={{ color: '#000', fontSize: '11px' }}>Đã bao gồm VAT nếu có</span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            {/* Phần nút Paypal mới */}
                            {payment === 'paypal' && clientId ? (
                                <div style={{ width: '320px' }}>
                                    <PayPalScriptProvider options={{ "client-id": clientId, currency: "USD" }}>
                                        <PayPalButtons
                                            style={{ layout: "vertical" }}
                                            forceReRender={[totalPriceMemo]}
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [{
                                                        amount: {
                                                            value: (Math.round(totalPriceMemo / 25000)).toString(),
                                                        },
                                                    }],
                                                });
                                            }}
                                            onApprove={async (data, actions) => {
                                                const details = await actions.order.capture();
                                                onSuccessPaypal(details, data);
                                            }}
                                            onError={() => {
                                                alert('error');
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            ) : (
                                <ButtonComponent
                                    onClick={() => handleAddOrder()}
                                    size={40}
                                    styleButton={{
                                        background: 'rgb(255, 57, 69)',
                                        height: '48px',
                                        width: '320px',
                                        borderRadius: '4px',
                                        border: 'none'
                                    }}
                                    textbutton={'Thanh toán'}
                                    styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}
                                />
                            )}
                        </WrapperRight>
                    </div>
                </div>
                <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isOpenModalUpdate} onCancel={handleCancel} onOk={handleUpdate}>
                    <Loading isLoading={isLoading}>
                        <Form
                            name="basic"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            autoComplete="on"
                            form={form}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Inputcomponent value={stateUserDetail.name} onChange={handleOnchangeDetail} name="name" />
                            </Form.Item>
                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[{ required: true, message: 'Please input phone!' }]}
                            >
                                <Inputcomponent value={stateUserDetail.phone} onChange={handleOnchangeDetail} name="phone" />
                            </Form.Item>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: 'Please input address!' }]}
                            >
                                <Inputcomponent value={stateUserDetail.address} onChange={handleOnchangeDetail} name="address" />
                            </Form.Item>
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[{ required: true, message: 'Please input city!' }]}
                            >
                                <Inputcomponent value={stateUserDetail.city} onChange={handleOnchangeDetail} name="city" />
                            </Form.Item>
                        </Form>
                    </Loading>
                </ModalComponent>
            </Loading>
        </div>
    )
}

export default PaymentPage
