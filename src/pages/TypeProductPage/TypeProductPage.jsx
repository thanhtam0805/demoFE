import React, { useEffect, useState } from 'react';
import NavbarComponent from '../../component/NavbarComponent/NavbarComponent';
import CardComponent from '../../component/CardComponent/CardComponent';
import { Col, Pagination, Row } from 'antd';
import { WrapperNavbar, WrapperProducts } from './style';
import { useLocation } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import Loading from '../../component/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);
    const { state: type } = useLocation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        limit: 10,
        total: 1
    });
    const [selectedPriceRange, setSelectedPriceRange] = useState([]);

    const filterProductsByPrice = (product) => {
        const price = product.price;

        // Show all products if no price range is selected
        if (selectedPriceRange.length === 0) {
            return true;
        }

        // Otherwise, filter based on the selected price range
        return (
            (selectedPriceRange.includes('under_10') && price < 10_000_000) ||
            (selectedPriceRange.includes('10_15') && price >= 10_000_000 && price < 15_000_000) ||
            (selectedPriceRange.includes('15_20') && price >= 15_000_000 && price < 20_000_000) ||
            (selectedPriceRange.includes('20_25') && price >= 20_000_000 && price < 25_000_000) ||
            (selectedPriceRange.includes('25_30') && price >= 25_000_000 && price < 30_000_000) ||
            (selectedPriceRange.includes('over_30') && price > 30_000_000)
        );
    };

    const fetchProductType = async (type, page, limit) => {
        setLoading(true);
        const res = await ProductService.getProductType(type, page, limit);
        if (res?.status === 'OK') {
            setLoading(false);
            setProducts(res?.data);
            setPagination({ ...pagination, total: res?.totalPage });
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (type) {
            fetchProductType(type, pagination.page, pagination.limit);
        }
    }, [type, pagination.page, pagination.limit]);

    const onChange = (current, pageSize) => {
        setPagination({ ...pagination, page: current - 1, limit: pageSize });
    };

    const handlePriceChange = (priceRange) => {
        setSelectedPriceRange(priceRange);
    };

    return (
        <Loading isLoading={loading}>
            <div style={{ width: '100%', background: '#f8f8fc' }}>
                <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                    <Row style={{ flexWrap: 'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)' }}>
                        <WrapperNavbar span={4}>
                            <NavbarComponent onPriceChange={handlePriceChange} />
                        </WrapperNavbar>
                        <Col span={20} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <WrapperProducts>
                                {products
                                    .filter((pro) => {
                                        if (searchDebounce === '') {
                                            return pro;
                                        } else if (pro?.name?.toLowerCase()?.includes(searchDebounce.toLowerCase())) {
                                            return pro;
                                        }
                                    })
                                    .filter(filterProductsByPrice)
                                    .map((product) => (
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
                            <Pagination
                                defaultCurrent={pagination?.page + 1}
                                total={pagination?.total}
                                onChange={onChange}
                                style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    );
};

export default TypeProductPage;
