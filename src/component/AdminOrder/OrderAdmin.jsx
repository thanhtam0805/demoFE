import { WrapperHeader } from './style'
import { Button, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import Inputcomponent from '../InputComponent/Inputcomponent'
import { useSelector } from 'react-redux'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { convertPrice } from '../../utils'



const OrderAdmin = () => {

  const user = useSelector((state) => state?.user)



  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token)
    return res
  }



  const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
  const { isLoading: isLoadingOrders, data: orders } = queryOrder
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
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
          // ref={searchInput}
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
      }
    },

  });

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('userName'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address'),
    },

    {
      title: 'Paid',
      dataIndex: 'isPaid',
      sorter: (a, b) => a.isPaid.length - b.isPaid.length,
      ...getColumnSearchProps('isPaid'),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
      ...getColumnSearchProps('paymentMethod'),
    },
    {
      title: 'Delivered',
      dataIndex: 'isDelivered',
      sorter: (a, b) => a.isDelivered.length - b.isDelivered.length,
      ...getColumnSearchProps('isDelivered'),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice.length - b.totalPrice.length,
      ...getColumnSearchProps('totalPrice'),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => {
        const date = new Date(text);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      },
      ...getColumnSearchProps('createdAt'),
    }

  ];
  const dataTable = orders?.data?.length && orders?.data?.map((order) => {
    console.log('order', order)
    return {
      ...order, key: order._id, userName: order?.shippingAdress?.fullName, phone: order?.shippingAdress?.phone,
      address: order?.shippingAdress?.address, paymentMethod: order?.paymentMethod, isPaid: order?.isPaid ? 'Yes' : 'No', isDelivered: order?.isDelivered ? 'Yes' : 'No',
      totalPrice: convertPrice(order?.totalPrice)
    }
  })



  return (
    <div>
      <WrapperHeader>Quản lý Order</WrapperHeader>
      <div style={{ marginTop: '20px' }}>
        <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} />
      </div>



    </div>
  )
}

export default OrderAdmin