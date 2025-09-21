import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Space } from 'antd'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import Inputcomponent from '../InputComponent/Inputcomponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import * as message from '../../component/Message/Message'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import { useQuery } from '@tanstack/react-query'
import { getBase64 } from '../../utils'



const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const searchInput = useRef(null);
  const user = useSelector((state) => state?.user)


  const [stateUserDetail, setStateUserDetail] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: ''
  })

  const [form] = Form.useForm()


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

  const mutationDeleted = useMutationHook(
    (data) => {
      const { id,
        token,
      } = data
      const res = UserService.deleteUser(
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
      const res = UserService.deleteManyUser(
        ids,
        token)
      return res
    }

  )

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    return res
  }

  const fetchGetUserDetail = async (rowSelected) => {
    const res = await UserService.getDetailUser(rowSelected)
    if (res?.data) {
      setStateUserDetail({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res?.data?.avatar
      })
    }
    setIsLoadingUpdate(false)

  }

  useEffect(() => {
    form.setFieldsValue(stateUserDetail)
  }, [form, stateUserDetail])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetUserDetail(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailProduct = () => {
    setIsOpenDrawer(true)
  }

  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

  /////////////////////////////////////////////////////////////////////////////////////////////
  const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
  const { isLoading: isLoadingUsers, data: users } = queryUser
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
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
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
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      filters: [
        {
          text: 'TRUE',
          value: true,
        },
        {
          text: 'FALSE',
          value: false,
        },
      ],
      render: (isAdmin) => (isAdmin ? 'TRUE' : 'FALSE'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,
    },
  ];
  const dataTable = users?.data?.length && users?.data?.map((user) => {
    return { ...user, key: user._id }
  })
  //, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE'

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  /////////////////////////////////////////////////////
  useEffect(() => {
  if (isSuccessDeleted && dataDeleted) {
    if (dataDeleted.status === 'OK') {
      message.success(dataDeleted.message );
      handleCancelDelete();
    } else if (dataDeleted.status === 'ERR') {
      message.error(dataDeleted.message );
      handleCancelDelete();
    }
  } else if (isErrorDeleted) {
    message.error("Có lỗi xảy ra!");
  }
}, [isSuccessDeleted, dataDeleted, isErrorDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetail({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }


  const handleOnchangeDetail = (e) => {
    setStateUserDetail({
      ...stateUserDetail,
      [e.target.name]: e.target.value
    })
  }


  const handleOnChangeAvatarDetail = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetail({
      ...stateUserDetail,
      avatar: file.preview
    })

  }

  const onUpdateUser = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetail }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const handleDeleteUser = () => {
    mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const handleDeleteManyUsers = (ids) => {
    mutationDeletedMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

      <div style={{ marginTop: '20px' }}>
        <TableComponent handleDeleteMany={handleDeleteManyUsers} columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            },
          };
        }} />
      </div>

      <DrawerComponent tittle='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateUser}
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
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Inputcomponent value={stateUserDetail.email} onChange={handleOnchangeDetail} name="email" />
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
              label="Avatar"
              name="avatar"
              rules={[{ required: true, message: 'Please input product avatar!' }]}
            >
              <WrapperUploadFile onChange={handleOnChangeAvatarDetail} maxCount={1}>
                <Button>Select File</Button>
                {stateUserDetail?.avatar && (
                  <img src={stateUserDetail?.avatar} style={{
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
      <ModalComponent forceRender title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa tài khoản này không?</div>
        </Loading>
      </ModalComponent>

    </div>
  )
}

export default AdminUser