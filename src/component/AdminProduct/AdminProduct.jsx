import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Select, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import Inputcomponent from '../InputComponent/Inputcomponent'
import { getBase64, renderOptions } from '../../utils'
import { WrapperUploadFile } from './style'
import * as ProductService from '../../services/ProductService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../component/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'



const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [typeSelect, setTypeSelect] = useState('')
    const searchInput = useRef(null);
    const user = useSelector((state) => state?.user)

    const initial = () => ({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: '',
        newType: '',
        discount: '',
    })
    const [stateProduct, setStateProduct] = useState(initial())

    const [stateProductDetail, setStateProductDetail] = useState(initial())

    const [form] = Form.useForm()

    const mutation = useMutationHook(
        (data) => {
            const { name,
                price,
                description,
                rating,
                image,
                type,
                countInStock,
                discount
            } = data

            const res = ProductService.createProduct(
                {
                    name,
                    price,
                    description,
                    rating,
                    image,
                    type,
                    countInStock,
                    discount
                }
            )
            return res
        }
    )

    const mutationUpdate = useMutationHook(
        (data) => {
            const { id,
                token,
                ...rests
            } = data

            const res = ProductService.updateProduct(
                id,
                token,
                { ...rests })
            return res
        }

    )

    const mutationDeleted = useMutationHook(
        (data) => {
            const { id,
                token,
            } = data
            const res = ProductService.deleteProduct(
                id,
                token)
            return res
        }

    )

    const mutationDeletedMany = useMutationHook(
        (data) => {
            const {
                token, ...ids
            } = data
            const res = ProductService.deleteManyProduct(
                ids,
                token)
            return res
        }

    )

    const getAllProducts = async () => {
        const res = await ProductService.getAllProducts()
        return res
    }

    const fetchGetProductDetail = async (rowSelected) => {
        const res = await ProductService.getDetailProduct(rowSelected)
        if (res?.data) {
            setStateProductDetail({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                image: res?.data?.image,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                discount: res?.data?.discount,
            })
        }
        setIsLoadingUpdate(false)

    }
    useEffect(() => {
        if (!isModalOpen) {
            form.setFieldsValue(stateProductDetail)
        } else {
            form.setFieldsValue(initial())
        }
    }, [form, stateProductDetail, isModalOpen])

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetProductDetail(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const handleDetailProduct = () => {
        setIsOpenDrawer(true)
    }

    const fetchAllTypeProducts = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany



    const typeProducts = useQuery({ queryKey: ['type-products'], queryFn: fetchAllTypeProducts })
    const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
    const { isLoading: isLoadingProducts, data: products } = queryProduct
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }} onClick={handleDetailProduct} />
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters) => {
        clearFilters();
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Inputcomponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={`${selectedKeys[0] || ''}`}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{
        //                 backgroundColor: '#ffc069',
        //                 padding: 0,
        //             }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>= 500000',
                    value: '>=',
                },
                {
                    text: '< 500000',
                    value: '<',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 500000
                } else {
                    return record.price < 500000
                }
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>= 3',
                    value: '>=',
                },
                {
                    text: '< 3',
                    value: '<',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.rating >= 3
                } else {
                    return record.rating < 3
                }
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,

        },
    ];
    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id }
    })


    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess])

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
            discount: '',
        })
        form.resetFields()
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetail({
            name: '',
            price: '',
            description: '',
            rating: '',
            image: '',
            type: '',
            countInStock: '',
        })
        form.resetFields()
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            rating: stateProduct.rating,
            image: stateProduct.image,
            type: stateProduct.type === 'addType' ? stateProduct.newType : stateProduct.type,
            countInStock: stateProduct.countInStock,
            discount: stateProduct.discount
        };

        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch();
            },
            onSuccess: (data) => {
                if (data?.status === 'ERR' && data?.message === 'The name of the product already exists') {
                    message.error('Product with this name already exists.');
                } else if (data?.status === 'OK') {
                    message.success('Product created successfully.');
                    handleCancel();
                }
            },
            onError: () => {
                message.error('An error occurred while creating the product.');
            }
        });
    };


    const handleOnchange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleOnchangeDetail = (e) => {
        setStateProductDetail({
            ...stateProductDetail,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const handleOnChangeAvatarDetail = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetail({
            ...stateProductDetail,
            image: file.preview
        })

    }

    const onUpdateProduct = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetail }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleDeleteManyProduct = (ids) => {
        mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
        })

    }


    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style={{ marginTop: ' 10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined />Add</Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent handleDeleteMany={handleDeleteManyProduct} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        },
                    };
                }} />
            </div>
            <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input product name!' }]}
                        >
                            <Inputcomponent value={stateProduct.name} onChange={handleOnchange} name="name" />

                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input product type!' }]}
                        >
                            <Select
                                name="type"
                                value={stateProduct.type}
                                onChange={handleChangeSelect}
                                options={renderOptions(typeProducts?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === 'addType' && (
                            <Form.Item
                                label='New type'
                                name="newType"
                                rules={[{ required: true, message: 'Please input product type!' }]}
                            >
                                <Inputcomponent value={stateProduct.newType} onChange={handleOnchange} name="newType" />
                            </Form.Item>
                        )}

                        <Form.Item
                            label="Count in Stock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input stock!' }]}
                        >
                            <Inputcomponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input product price!' }]}
                        >
                            <Inputcomponent value={stateProduct.price} onChange={handleOnchange} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input product description!' }]}
                        >
                            <Inputcomponent value={stateProduct.description} onChange={handleOnchange} name="description" />
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input product rating!' }]}
                        >
                            <Inputcomponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                        </Form.Item>

                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[{ required: true, message: 'Please input product discount!' }]}
                        >
                            <Inputcomponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>

                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input product image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>


                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent tittle='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input product name!' }]}
                        >
                            <Inputcomponent value={stateProductDetail.name} onChange={handleOnchangeDetail} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input product type!' }]}
                        >
                            <Inputcomponent value={stateProductDetail.type} onChange={handleOnchangeDetail} name="type" />
                        </Form.Item>

                        <Form.Item
                            label="Count in Stock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input stock!' }]}
                        >
                            <Inputcomponent value={stateProductDetail.countInStock} onChange={handleOnchangeDetail} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input product price!' }]}
                        >
                            <Inputcomponent value={stateProductDetail.price} onChange={handleOnchangeDetail} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input product description!' }]}
                        >
                            <Inputcomponent value={stateProductDetail.description} onChange={handleOnchangeDetail} name="description" />
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input product rating!' }]}
                        >
                            <Inputcomponent value={stateProductDetail.rating} onChange={handleOnchangeDetail} name="rating" />
                        </Form.Item>

                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[{ required: true, message: 'Please input product discount!' }]}
                        >
                            <Inputcomponent value={stateProductDetail.discount} onChange={handleOnchangeDetail} name="discount" />
                        </Form.Item>

                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input product image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeAvatarDetail} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProductDetail?.image && (
                                    <img src={stateProductDetail?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>


                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminProduct