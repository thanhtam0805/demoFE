import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLable, WrapperUploadFile } from './style'
import InputForm from '../../component/InputForm/InputForm'
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../component/LoadingComponent/Loading'
import * as message from '../../component/Message/Message'
import { updateUser } from '../../redux/slides/userSlice'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState(user?.email)
    const [name, setName] = useState(user?.name)
    const [phone, setPhone] = useState(user?.phone)
    const [address, setAddress] = useState(user?.address)
    const [avatar, setAvatar] = useState(user?.avatar)

    const mutation = useMutationHook(
        (data) => {
            const { id, access_token, ...rests } = data
            UserService.updateUser(id, rests, access_token)
        }
    )

    const dispatch = useDispatch()

    const { data, isLoading, isSuccess, isError } = mutation

    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])



    useEffect(() => {
        if (isSuccess) {
            message.success()
            handleGetDetailUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError])

    const handleOnChangeName = (value) => {
        setName(value)

    }
    const handleOnChangeEmail = (value) => {
        setEmail(value)

    }
    const handleOnChangePhone = (value) => {
        setPhone(value)

    }
    const handleOnChangeAddress = (value) => {
        setAddress(value)
    }

    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        mutation.mutate({ id: user?.id, name, email, phone, address, avatar, access_token: user?.access_token });
    }

    return (
        <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLable htmlFor="name">Name</WrapperLable>
                        <InputForm
                            id='name'
                            style={{ width: '300px' }}
                            value={name}
                            onChange={handleOnChangeName} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={20}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid #E30019',
                                borderRadius: '4px',
                                padding: '0 10px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: '#E30019', fontSize: '16px', fontWeight: 500 }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLable htmlFor="email">Email</WrapperLable>
                        <InputForm
                            id='email'
                            style={{ width: '300px' }}
                            value={email}
                            onChange={handleOnChangeEmail} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={20}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid #E30019',
                                borderRadius: '4px',
                                padding: '0 10px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: '#E30019', fontSize: '16px', fontWeight: 500 }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLable htmlFor="phone">Phone</WrapperLable>
                        <InputForm
                            id='phone'
                            style={{ width: '300px' }}
                            value={phone}
                            onChange={handleOnChangePhone} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={20}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid #E30019',
                                borderRadius: '4px',
                                padding: '0 10px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: '#E30019', fontSize: '16px', fontWeight: 500 }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLable htmlFor="address">Address</WrapperLable>
                        <InputForm
                            id='address'
                            style={{ width: '300px' }}
                            value={address}
                            onChange={handleOnChangeAddress} />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={20}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid #E30019',
                                borderRadius: '4px',
                                padding: '0 10px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: '#E30019', fontSize: '16px', fontWeight: 500 }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLable htmlFor="avatar">Avatar</WrapperLable>
                        <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} alt="avatar" />
                        )}

                        <ButtonComponent
                            onClick={handleUpdate}
                            size={20}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: '1px solid #E30019',
                                borderRadius: '4px',
                                padding: '0 10px'
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{ color: '#E30019', fontSize: '16px', fontWeight: 500 }}
                        ></ButtonComponent>
                    </WrapperInput>
                </WrapperContentProfile>
            </Loading>

        </div>
    )
}

export default ProfilePage