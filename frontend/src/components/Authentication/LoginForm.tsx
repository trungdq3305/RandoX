import { Form, Input, Button, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useLoginMutation } from '../../features/auth/authApi'

export const LoginForm = () => {
  const [form] = Form.useForm()
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()

  const validateInput = (value: string) => {
    if (!value) return Promise.reject('Vui lòng nhập email!')
    if (/^\d{10}$/.test(value)) return Promise.resolve()
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return Promise.resolve()
    return Promise.reject('Email không hợp lệ!')
  }

  const handleSubmit = async (values: { email?: string; password: string }) => {
    try {
      const response = await login({
        email: values.email || '',
        password: values.password,
      }).unwrap()
      console.log(response)
      const token = response.data

      if (token) {
        Cookies.set('userToken', token, { expires: 7 })
        navigate('/')
      } else {
        notification.error({
          message: 'Lỗi phản hồi',
          description: 'Không tìm thấy accessToken trong phản hồi từ server.',
        })
      }
    } catch (error: any) {
      notification.error({
        message: 'Đăng nhập thất bại',
        description: error?.data?.message || 'Đã xảy ra lỗi không xác định',
      })
    }
  }

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSubmit}
      name='login-form'
      autoComplete='on'
      style={{
        minWidth: '400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Form.Item
        name='email'
        rules={[{ validator: (_, value) => validateInput(value) }]}
      >
        <Input
          placeholder='Email'
          style={{
            height: '65px',
          }}
        />
      </Form.Item>

      <Form.Item
        name='password'
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
      >
        <Input.Password
          placeholder='Mật khẩu'
          style={{
            height: '65px',
          }}
        />
      </Form.Item>

      <Form.Item>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Button
            type='primary'
            htmlType='submit'
            loading={isLoading}
            style={{
              height: '65px',
              backgroundColor: '#7FAAFB',
            }}
          >
            <div
              style={{
                color: '#000',
                fontSize: '16px',
              }}
            >
              Đăng nhập
            </div>
          </Button>
          <Button
            type='link'
            onClick={() => navigate('/register')}
            style={{ padding: 0, margin: 0 }}
          >
            <span
              style={{
                color: '#000',
              }}
            >
              Bạn mới biết đến RandoX?
            </span>
            <span style={{ fontWeight: 'bold', color: '#000' }}>Đăng ký</span>
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
