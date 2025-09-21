import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../component/InputForm/InputForm'
import ButtonComponent from '../../component/ButtonComponent/ButtonComponent'
import logo from '../../assets/images/logologin.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../component/LoadingComponent/Loading'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlice'

const SignInPage = () => {


  const [isShowPassword, setIsShowPassword] = useState(false)
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()


  const navigate = useNavigate()

  const mutation = useMutationHook(
    data => UserService.loginUser(data)
  )

  const { data, isLoading, isSuccess } = mutation

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      if (location?.state) {
        navigate(location?.state);
      } else {
        navigate('/');
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token));
      localStorage.setItem('refresh_token', JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token);
        }
      }
    }
  }, [isSuccess, data]);

  const handleGetDetailUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }))
  }



  const handleNavigateSignup = () => {
    navigate('/sign-up')
  }


  const handleNavigateForgotPassword = () => {
    navigate('/forgot-password')
  }

  const handleOnChangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnChangePassword = (value) => {
    setPassword(value)
  }

  const handleSignin = () => {
    mutation.mutate({ email, password })
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
      <div style={{ width: '800px, height: 445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
        <WrapperContainerLeft>
          <h1 style={{ fontSize: '20px' }}>Xin chào</h1>
          <p style={{ fontSize: '15px' }}>Đăng nhập hoặc Tạo tài khoản</p>
          <InputForm style={{ marginBottom: '10px' }}
            placeholder="abc@gmail.com"
            value={email}
            onChange={handleOnChangeEmail} />
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >
            </span>
            <InputForm placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnChangePassword} />
          </div>

          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message} </span>}

          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={email === '' || password === ''}
              onClick={handleSignin}
              size={20}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '100%',
                border: 'none',
                borderRadius: '4px',
                margin: '26px 0 10px',
              }}
              textbutton={'Đăng nhập'}
              styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}
            ></ButtonComponent>
          </Loading>


          <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignup}>Tạo tài khoản</WrapperTextLight></p>
          <p>Quên mật khẩu? <WrapperTextLight onClick={handleNavigateForgotPassword}>Lấy lại mật khẩu</WrapperTextLight></p>

        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image src={logo} preview={false} alt="image-logo" height="203px" width="203px" />
          <h4>Mua sắm tại EStore</h4>
          <span>Siêu ưu đãi mỗi ngày</span>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignInPage