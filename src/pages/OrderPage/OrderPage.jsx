import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Checkbox, Form } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperInputNumber, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleDelivery, WrapperStyleHeader, WrapperTotal } from './style'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent'
import { decreaseAmount, increaseAmount, removeAllFromCart, removeFromCart, selectedOrder } from '../../redux/slides/orderSlice'
import { convertPrice } from '../../utils'
import ModalComponent from '../../component/ModalComponent/ModalComponent'
import Inputcomponent from '../../component/InputComponent/Inputcomponent'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import Loading from '../../component/LoadingComponent/Loading'
import * as message from '../../component/Message/Message'
import { updateUser } from '../../redux/slides/userSlice'
import { useNavigate } from 'react-router-dom'
import StepComponent from '../../component/StepComponent/StepComponent'


const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false)
  const [listChecked, setListChecked] = useState([])
  const [stateUserDetail, setStateUserDetail] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })

  const navigate = useNavigate()
  const [form] = Form.useForm()

  const dispatch = useDispatch()
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newList = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newList)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  }
  const handleChangeCount = (type, idProduct, limit) => {
    if (type === 'increase') {
      if (!limit) {
        dispatch(increaseAmount({ idProduct }))
      }
    } else {
      if (!limit) {
        dispatch(decreaseAmount({ idProduct }))
      }

    }

  }
  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newList = []
      order?.orderItems?.forEach((item) => {
        newList.push(item?.product)
      })
      setListChecked(newList)
    } else {
      setListChecked([])
    }
  }

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])

  useEffect(() => {
    if (isOpenModalUpdate) {
      setStateUserDetail({
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
        city: user?.city
      })
    }
  }, [isOpenModalUpdate])

  const handleChangeAddress = () => {
    setIsOpenModalUpdate(true)
  }

  useEffect(() => {
    form.setFieldsValue(stateUserDetail)
  }, [form, stateUserDetail])

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeFromCart({ idProduct }))
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur?.price * cur?.amount))
    }, 0)
    return result
  }, [order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount * cur?.amount) / 100)
    }, 0)
    if (Number(result)) {
      return result
    }
    return 0
  }, [order])

  const deliveryMemo = useMemo(() => {
    if (priceMemo >= 1000000 && priceMemo < 5000000) {
      return 10000
    } else if (priceMemo >= 5000000 || order?.orderItemsSelected.length === 0) {
      return 0
    } else {
      return 20000
    }
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryMemo)
  }, [priceMemo, priceDiscountMemo, deliveryMemo])

  const handleRemoveAll = () => {
    if (listChecked?.length >= 1) {
      dispatch(removeAllFromCart({ listChecked }))
    }
  }

  const handlePayment = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error('vui lòng chọn sản phẩm')
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdate(true)
    } else {
      navigate('/payment')
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

  const { isLoading, data } = mutationUpdate

  const handleUpdate = () => {
  const { name, phone, address, city } = stateUserDetail
  if (name && phone && address && city) {
    mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetail }, {
      onSuccess: (data) => {
        dispatch(updateUser({
          ...user,        // giữ lại token, id, email...
          ...data?.data,  // cập nhật field mới
        }));
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

  const itemsDelivery = [
    {
      title: '20.000 VND',
      description: 'Dưới 1.000.000 VND',
    },
    {
      title: '10.000 VND',
      description: 'Từ 1.000.000 VND đến 5.000.000 VND',
    },
    {
      title: '0 VND',
      description: 'Trên 5.000.000 VND',
    },
  ]
  return (
    <div style={{ background: '#fff', width: '100%', height: '100vh' }}>
      <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
            <WrapperStyleDelivery>
              <StepComponent items={itemsDelivery} current={deliveryMemo === 10000 ? 1 :
                deliveryMemo === 20000 ? 0 : order?.orderItemsSelected.length === 0 ? 0 : 2} />
            </WrapperStyleDelivery>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', width: '390px' }}>
                <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                <span>Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span> Đơn giá </span>
                <span> Số lượng </span>
                <span> Thành tiền </span>
                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAll} />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                      <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} alt='img' />
                      <div style={{
                        width: '260px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}>{order?.name}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                        <WrapperPriceDiscount> - {order?.discount} %</WrapperPriceDiscount>
                      </span>
                      <WrapperCountOrder>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)}>
                          <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>

                        <WrapperInputNumber defaultValue={order?.amount} >{order?.amount} </WrapperInputNumber>

                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product, order?.amount === order?.countInStock)}>
                          <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                        </button>
                      </WrapperCountOrder>
                      <span style={{ color: 'rgb(255, 66, 78', fontSize: '13px' }} >{convertPrice(order?.price * order?.amount)}</span>
                      <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)} />
                    </div>
                  </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: '100%' }}>
              <WrapperInfo>
                <div style={{ fontSize: '15px' }}>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: 'bold' }}>{`${user?.address}-${user?.city}`}</span>
                  <span onClick={handleChangeAddress} style={{ color: 'blue', cursor: 'pointer' }}>Thay đổi</span>
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
            <ButtonComponent
              onClick={(() => handlePayment())}
              size={40}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '300px',
                borderRadius: '4px',
                border: 'none'
              }}
              textbutton={'Thanh toán'}
              styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isOpenModalUpdate} onCancel={handleCancel} onOk={handleUpdate}>
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
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
    </div>
  )
}

export default OrderPage