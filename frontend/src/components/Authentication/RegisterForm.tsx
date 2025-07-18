import { Form, Input, Button, DatePicker, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../../features/auth/authApi'
import dayjs from 'dayjs'

export const RegisterForm = () => {
  const [form] = Form.useForm()
  const [register, { isLoading }] = useRegisterMutation()
  const navigate = useNavigate()

  const handleSubmit = async (values: any) => {
    try {
      const response = await register({
        email: values.email,
        password: values.password,
        dob: dayjs(values.dob).format('YYYY-MM-DD'), // 👈 CHUYỂN ĐỊNH DẠNG TẠI ĐÂY
        phoneNumber: values.phoneNumber,
        roleId: 'a1fdb0c2-0daf-4bb0-b075-a3cc0b2febeb',
        fullname: ""
      }).unwrap()
      console.log(response)
      notification.success({
        message: 'Đăng ký thành công',
        description: 'Vui lòng kiểm tra email để xác thực tài khoản.',
      })

      navigate('/login')
    } catch (error: any) {
      notification.error({
        message: 'Đăng ký thất bại',
        description: error?.data?.message || 'Đã xảy ra lỗi không xác định.',
      })
    }
  }

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSubmit}
      name='register-form'
      autoComplete='on'
      style={{
        minWidth: '400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      initialValues={{
        dob: null,
      }}
    >
      {/* Email */}
      <Form.Item
        name='email'
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' },
        ]}
      >
        <Input
          placeholder='Email'
          style={{
            height: '65px',
          }}
        />
      </Form.Item>

      {/* Password */}
      <Form.Item
        name='password'
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu!' },
          { min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' },
        ]}
      >
        <Input.Password
          placeholder='Mật khẩu'
          style={{
            height: '65px',
          }}
        />
      </Form.Item>

      {/* Retype password */}
      <Form.Item
        name='retypePassword'
        dependencies={['password']}
        rules={[
          { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(
                'Mật khẩu nhập lại không khớp!'
              )
            },
          }),
        ]}
      >
        <Input.Password
          placeholder='Nhập lại mật khẩu'
          style={{
            height: '65px',
          }}
        />
      </Form.Item>

      {/* DOB */}
      <Form.Item
        name='dob'
        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
      >
        <DatePicker
          placeholder='Ngày sinh'
          format='YYYY-MM-DD'
          style={{
            height: '65px',
            width: '100%',
          }}
        />
      </Form.Item>

      {/* Phone Number */}
      <Form.Item
        name='phoneNumber'
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          {
            pattern: /^\d{10,11}$/,
            message: 'Số điện thoại không hợp lệ!',
          },
        ]}
      >
        <Input
          placeholder='Số điện thoại'
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
              Đăng ký
            </div>
          </Button>
          <Button
            type='link'
            onClick={() => navigate('/login')}
            style={{ padding: 0, margin: 0 }}
          >
            <span
              style={{
                color: '#000',
              }}
            >
              Đã có tài khoản?
            </span>
            <span style={{ fontWeight: 'bold', color: '#000' }}> Đăng nhập</span>
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
