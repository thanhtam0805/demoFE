
import React, { useEffect } from 'react'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../../component/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { WrapperContainer, WrapperFooterItem, WrapperHeaderItem, WrapperItemOrder, WrapperListOrder, WrapperStatus } from './style'
import { convertPrice } from '../../utils'
import { useLocation, useNavigate } from 'react-router-dom'
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as message from '../../component/Message/Message'


const MyOrder = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(state?.id, state?.token)
    return res.data
  }
  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: !!(state?.id && state?.token)
  })
  const { isLoading, data } = queryOrder

  const handleDetailOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token
      }
    })
  }

  const mutation = useMutationHook(
    (data) => {
      const { id, token, orderItems } = data
      const res = OrderService.cancelOrder(id, token, orderItems)
      return res
    }
  )

  const handleCancelOrder = (order) => {
    mutation.mutate({ id: order?._id, token: state?.token, orderItems: order?.orderItems }, {
      onSuccess: () => {
        queryOrder.refetch()
      }
    })
  }

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success()
    } else if (isErrorCancel) {
      message.error()
    }
  }, [isSuccessCancel, isErrorCancel])


  const renderProduct = (data) => {
    return data?.map((order) => {
      return <WrapperHeaderItem key={order?.id}>
        <img src={order?.image}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            border: '1px solid #f5f5f5',
            padding: '4px'
          }}
        />
        <div style={{
          width: 260,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          marginLeft: '10px',
          fontSize: '14px',
        }}>
          {order?.name}
        </div>
        <span style={{ fontSize: '13px', color: '#242424', marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
      </WrapperHeaderItem>
    })
  }

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ margin: '0 auto', width: '1270px', height: '100%' }}>
          <h2>Đơn hàng của tôi</h2>
          <WrapperListOrder>
            {Array.isArray(data) && data.map((order) => {
              return (
                <WrapperItemOrder key={order?.id}>
                  <WrapperStatus>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                    <div><span style={{ color: 'red' }}>Giao hàng: </span>{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</div>
                    <div><span style={{ color: 'red' }}>Thanh toán: </span>{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</div>
                  </WrapperStatus>

                  {renderProduct(order?.orderItems)}

                  <WrapperFooterItem>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: 'red', fontWeight: 'bold', marginRight: '5px' }}>Tổng tiền: </span>
                      <span
                        style={{ fontSize: '14px', color: '#242424', fontWeight: 700 }}
                      >{convertPrice(order?.totalPrice)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <ButtonComponent
                        onClick={() => handleCancelOrder(order)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #dc3545',
                          borderRadius: '4px',
                        }}
                        textbutton={'Hủy đơn hàng'}
                        styleTextButton={{ color: '#000', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      <ButtonComponent
                        onClick={() => handleDetailOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid #dc3545',
                          borderRadius: '4px',
                        }}
                        textbutton={'Chi tiết đơn hàng'}
                        styleTextButton={{ color: '#000', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                    </div>

                  </WrapperFooterItem>
                </WrapperItemOrder>

              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>

  )
}

export default MyOrder