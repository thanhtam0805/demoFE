import React from 'react'
import ProductDetailsComponent from '../../component/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ width: '100%', background: '#efefef' }}>
      <div style={{ width: '1270px', height: '100%', margin: '0 auto' }}>
        <h2><span style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { navigate('/') }}>Trang chu</span> - Chi tiết sản phẩm</h2>
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>

  )
}

export default ProductDetailPage