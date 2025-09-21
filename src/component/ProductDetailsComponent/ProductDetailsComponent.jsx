import { Col, Image, Rate, Row, Badge } from 'antd'
import React, { useEffect, useState } from 'react'
import { MinusOutlined, PlusOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import * as UserService from '../../services/UserService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addToCart, resetOrder } from '../../redux/slides/orderSlice'
import { convertPrice, initFacebookSDK } from '../../utils'
import * as message from '../../component/Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'

const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const [errorLimitOrder, setErrorLimitOrder] = useState(false)
    const user = useSelector((state) => state?.user)
    const order = useSelector((state) => state?.order)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [isFavorite, setIsFavorite] = useState(false)
    const [favorites, setFavorites] = useState([])

    const onChange = (value) => setNumProduct(Number(value))

    const fetchGetProductDetail = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getDetailProduct(id)
        return res.data
    }

    useEffect(() => { initFacebookSDK() }, [])

    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item?.product === productDetail?._id)
        if ((orderRedux?.amount + numProduct) <= productDetail?.countInStock || (!orderRedux && productDetail?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if (productDetail?.countInStock === 0) {
            setErrorLimitOrder(true)
        }
    }, [numProduct])

    useEffect(() => {
        if (order.isSuccessOrder) {
            message.success('Thêm sản phẩm vào giỏ hàng thành công')
        }
        return () => { dispatch(resetOrder()) }
    }, [order.isSuccessOrder])

    const { isLoading, data: productDetail } = useQuery(['products-detail', idProduct], fetchGetProductDetail, { enabled: !!idProduct })

    useEffect(() => {
        const fetchFavorites = async () => {
            if (user?.id && user?.access_token && productDetail?._id) {
                const res = await UserService.getFavorites(user.id, user.access_token)
                setFavorites(res?.data || [])
                setIsFavorite((res?.data || []).some(item => item._id === productDetail._id))
            } else {
                setIsFavorite(false)
            }
        }
        fetchFavorites()
    }, [user?.id, user?.access_token, productDetail?._id])

    const handleChangeCount = (type, limit) => {
        if (type === 'increase') {
            if (!limit) setNumProduct(numProduct + 1)
        } else {
            if (!limit) setNumProduct(numProduct - 1)
        }
    }

    const handleAddToCart = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            const orderRedux = order?.orderItems?.find((item) => item?.product === productDetail?._id)
            if ((orderRedux?.amount + numProduct) <= productDetail?.countInStock || (!orderRedux && productDetail?.countInStock > 0)) {
                dispatch(addToCart({
                    orderItem: {
                        name: productDetail?.name,
                        amount: numProduct,
                        image: productDetail?.image,
                        price: productDetail?.price,
                        product: productDetail?._id,
                        discount: productDetail?.discount,
                        countInStock: productDetail?.countInStock,
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }

    const handleToggleFavorite = async () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
            return
        }
        if (isFavorite) {
            const res = await UserService.removeFavorite(user.id, productDetail._id, user.access_token)
            if (res.status === 'OK') {
                setIsFavorite(false)
                message.success('Đã bỏ khỏi yêu thích!')
            } else {
                message.error(res.message || "Lỗi khi bỏ khỏi yêu thích!")
            }
        } else {
            const res = await UserService.addFavorite(user.id, productDetail._id, user.access_token)
            if (res.status === 'OK') {
                setIsFavorite(true)
                message.success('Đã thêm vào yêu thích!')
            } else {
                message.error(res.message || "Lỗi khi thêm vào yêu thích!")
            }
        }
    }

    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetail?.image} alt="image product" preview={false} />
                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 500 }}>{productDetail?.name}</h1>
                    <div>
                        <Rate allowHalf defaultValue={productDetail?.rating} value={productDetail?.rating} />
                        <span style={{ fontSize: 15, color: '#888' }}> | Đã bán 9090909099+</span>
                    </div>
                    <div style={{ background: '#fafafa', borderRadius: 4, margin: "12px 0" }}>
                        <h1 style={{ fontSize: 32, fontWeight: 500, marginRight: 8, padding: 10 }}>
                            {convertPrice(productDetail?.price)}
                        </h1>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                        <span>Giao đến </span>
                        <span style={{ textDecoration: 'underline', fontWeight: 500 }}>{user?.address}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <ButtonComponent
                            size={20}
                            styleButton={{
                                background: isFavorite ? "#fff0f6" : "#fff",
                                height: 40,
                                width: 40,
                                border: "1.5px solid #ff4d6d",
                                borderRadius: "50%",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            onClick={handleToggleFavorite}
                            textbutton={
                                isFavorite ?
                                    <HeartFilled style={{ color: 'red', fontSize: 22 }} /> :
                                    <HeartOutlined style={{ color: '#ff4d6d', fontSize: 22 }} />
                            }
                        />
                        <span style={{ color: "#ff4d6d", fontWeight: 500 }}>{isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}</span>
                    </div>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}>Số Lượng</div>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: 100, border: '1px solid #ccc', borderRadius: 4 }}>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <input
                                style={{ width: 40, border: 'none', textAlign: 'center' }}
                                type="number"
                                value={numProduct}
                                min={1}
                                max={productDetail?.countInStock}
                                onChange={e => setNumProduct(Number(e.target.value))}
                            />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetail?.countInStock)} >
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                            <ButtonComponent
                                size={20}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px',
                                }}
                                onClick={handleAddToCart}
                                textbutton={'Chọn Mua'}
                                styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}
                            />
                            {errorLimitOrder && <div style={{ color: 'red' }}>Sản phẩm đã hết hàng</div>}
                        </div>
                        <ButtonComponent
                            size={20}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13, 92, 182)',
                                borderRadius: '4px',
                            }}
                            textbutton={'Mua Trả Sau'}
                            styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '16px' }}
                        />
                    </div>
                </Col>
                <CommentComponent
                    dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href}
                    width="1270"
                    marginBottom="20px"
                />
            </Row>
        </Loading>
    )
}

export default ProductDetailsComponent
