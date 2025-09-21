import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../utils';
import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import HeaderComponent from '../../component/HeaderComponent/HeaderComponent';
import AdminUser from '../../component/AdminUser/AdminUser';
import AdminProduct from '../../component/AdminProduct/AdminProduct';
import OrderAdmin from '../../component/AdminOrder/OrderAdmin';


const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <AppstoreOutlined />),
        getItem('Đơn hàng', 'order', <ShoppingCartOutlined />),

    ];

    const [keySelected, setKeySelected] = useState('')

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser />
            case 'product':
                return <AdminProduct />
            case 'order':
                return <OrderAdmin />
            default:
                return <></>
        }
    }

    const handleOnClick = ({ key }) => {
        setKeySelected(key)
    }

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <div style={{ display: 'flex' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                        height: '100vh',
                    }}
                    items={items}
                    onClick={handleOnClick}
                />
                <div style={{ flex: '1', padding: '15px' }}>
                    {renderPage(keySelected)}
                </div>
            </div>
        </>


    )
}

export default AdminPage