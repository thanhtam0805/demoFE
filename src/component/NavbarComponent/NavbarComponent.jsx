import React, { useEffect, useState } from 'react';
import { WrapperContent, WrapperLable, WrapperTextValue } from './style';
import { Checkbox } from 'antd';
import * as ProductService from '../../services/ProductService';
import { useNavigate } from 'react-router-dom';

const NavbarComponent = ({ onPriceChange }) => {
    const [types, setTypes] = useState([]);

    const navigate = useNavigate();

    const priceOptions = [
        { label: 'Dưới 10 triệu', value: 'under_10' },
        { label: 'Từ 10 - 15 triệu', value: '10_15' },
        { label: 'Từ 15 - 20 triệu', value: '15_20' },
        { label: 'Từ 20 - 25 triệu', value: '20_25' },
        { label: 'Từ 25 - 30 triệu', value: '25_30' },
        { label: 'Trên 30 triệu', value: 'over_30' },
    ];

    useEffect(() => {
        const fetchTypes = async () => {
            const res = await ProductService.getAllTypeProduct();
            if (res?.status === 'OK') {
                setTypes(res.data);
            }
        };
        fetchTypes();
    }, []);

    const handleNavigateType = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state: type });
    };

    const handlePriceChange = (checkedValues) => {
        onPriceChange(checkedValues); // Call the parent callback to update the selected price range
    };

    return (
        <div>
            <WrapperLable>Product Categories</WrapperLable>
            <WrapperContent>
                {types.map((type) => (
                    <WrapperTextValue key={type} onClick={() => handleNavigateType(type)} style={{ cursor: 'pointer' }}>
                        {type}
                    </WrapperTextValue>
                ))}
            </WrapperContent>
            <div style={{ marginTop: '20px', marginBottom: '120px' }}>
                <h4>Mức giá</h4>
                <Checkbox.Group
                    options={priceOptions}
                    onChange={handlePriceChange}
                />
            </div>
        </div>
    );
};

export default NavbarComponent;
