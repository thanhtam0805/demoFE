import React, { useEffect, useState } from 'react'
import { Badge, Col, Popover } from 'antd'
import { WraperHeader, WraperTextHeader, WraperHeaderAccount, WraperTextHeaderSmall, WrapperContentPopup } from './style'
import ButtonInput from '../Button/ButtonInput'
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlice'
import { searchProduct } from '../../redux/slides/productSlice';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [search, setSearch] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const order = useSelector((state) => state.order)
    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }

    const handleLogout = async () => {
        await UserService.logoutUser()
        dispatch(resetUser())
    }

    useEffect(() => {
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
    }, [user?.name, user?.avatar])

    const content = (
        <div>
            <WrapperContentPopup onClick={() => handleClick('profile')}>Thông tin người dùng</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClick('favorite')}>Sản phẩm yêu thích</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => handleClick('admin')}>Quản lý hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClick('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClick()}>Đăng Xuất</WrapperContentPopup>


        </div>
    );

    const handleClick = (type) => {
        if (type === 'profile') {
            navigate('/profile-user')
        } else if (type === 'favorite') {
            navigate('/favorite')
        } else if (type === 'admin') {
            navigate('/system/admin')
        } else if (type === 'my-order') {
            navigate('/my-order', {
                state: {
                    id: user?.id,
                    token: user?.access_token
                }
            })
        } else {
            handleLogout()
        }
        setIsOpenPopup(false)
    }

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    return (
        // style={{ width: '100%', background: '#E30019', display: 'flex', justifyContent: 'center' }}
        <div >
            <WraperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>
                <Col span={6}>
                    <WraperTextHeader onClick={() => navigate('/')} style={{ cursor: 'pointer' }}> EStore </WraperTextHeader>
                </Col>

                {!isHiddenSearch && (
                    <Col span={12}>
                        <ButtonInput
                            size="large"
                            // bordered={false}
                            textbutton="Tìm kiếm"
                            placeholder="Tìm kiếm sản phẩm"
                            onChange={onSearch}
                        />
                    </Col>
                )}

                <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
                    <WraperHeaderAccount>
                        {userAvatar ? (
                            <img src={userAvatar} alt="avatar" style={{
                                height: '30px',
                                width: '30px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} />
                        ) : (
                            <UserOutlined style={{ fontSize: '30px', color: '#fff' }} />
                        )}

                        {user?.access_token ? (
                            <>
                                <Popover content={content} trigger="click" open={isOpenPopup}>
                                    <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName || user.email}</div>
                                </Popover>

                            </>

                        ) : (
                            <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                                <WraperTextHeaderSmall>Đăng nhập/Đăng kí</WraperTextHeaderSmall>
                                <div>
                                    <WraperTextHeaderSmall>Tài Khoản</WraperTextHeaderSmall>
                                    <CaretDownOutlined />
                                </div>
                            </div>
                        )}
                    </WraperHeaderAccount>
                    {!isHiddenCart && (
                        <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
                            <Badge count={order?.orderItems?.length} size='small'>
                                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            </Badge>
                            <WraperTextHeaderSmall>Giỏ hàng</WraperTextHeaderSmall>
                        </div>
                    )}



                </Col>
            </WraperHeader>
        </div >
    )
}

export default HeaderComponent