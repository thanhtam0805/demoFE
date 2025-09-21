import React, { useEffect, useRef, useState } from 'react'
import TypeProduct from '../../component/TypeProduct/TypeProduct'
import { WrapperButton, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../component/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.png'
import slider2 from '../../assets/images/slider2.png'
import slider3 from '../../assets/images/slider3.png'
import CardComponent from '../../component/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../component/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(6)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [typeProducts, setTypeProducts] = useState([])

  const fetchAllProducts = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2]?.toLowerCase();
    const res = await ProductService.getAllProducts(search, limit);

    return res;
  };


  const fetchAllTypeProducts = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') {
      setTypeProducts(res?.data)
    }

    return res
  }

  const { isLoading, data: products, isPreviousData } = useQuery(['products', limit, searchDebounce], fetchAllProducts, { retry: 3, retryDelay: 1000, keepPreviousData: true })

  useEffect(() => {
    fetchAllTypeProducts()
  }, [])

  return (
    <Loading isLoading={isLoading || loading}>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        <WrapperTypeProduct>
          {typeProducts.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>


      </div>
      <div className="body" style={{ width: '100%', backgroundColor: '#f8f8fc' }}>
        <div id="container" style={{ maxWidth: '1270px', margin: '0 auto' }}>
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <WrapperProducts>
            {products?.data?.map((product) => (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                selled={product.selled}
                discount={product.discount}
                id={product._id}
              />
            ))}
          </WrapperProducts>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <WrapperButton
              textbutton={isPreviousData ? 'Load more' : 'Xem Thêm'}
              type="outline"
              styleButton={{
                border: '1px solid red',
                color: `${products?.total === products?.data?.length ? '#ccc' : '#dc3545'}`,
                marginTop: '20px',
                marginBottom: '20px',
                width: '240px',
                height: '38px',
                borderRadius: '4px',
              }}
              disabled={products?.total === products?.data?.length || products?.totalPage === 1}
              styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
              onClick={() => setLimit((prev) => prev + 6)}
            />
          </div>
        </div>
      </div>

    </Loading>
  )
}

export default HomePage