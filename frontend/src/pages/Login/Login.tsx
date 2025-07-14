import { Layout, Typography, Row } from 'antd'
import { LoginForm } from '../../components/Authentication/LoginForm'
import Logo from '../../assets/Logo.png'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

const { Content } = Layout
const { Title } = Typography

export default function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    const userData = Cookies.get('userData')
      ? JSON.parse(Cookies.get('userData') as string)
      : null
    if (userData) {
      navigate('/')
    }
  }, [navigate])

  return (
    <Layout
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFDAF9',
        backgroundImage: 'linear-gradient(to bottom, white, #FFDAF9)',
      }}
    >
      <Content
        style={{
          width: '80%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Row gutter={[32, 32]} align='middle'>
          {/* Hình ảnh minh họa */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              width: '100%',
              maxWidth: '600px',
              marginBottom: '32px',
              height: '100%',
            }}
          >
            <div>
              <img
                src={Logo}
                alt='Login'
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                }}
              />
            </div>
            {/* Form đăng nhập */}
            <div>
              <div>
                <Title
                  level={2}
                  style={{ textAlign: 'center', marginBottom: '24px' }}
                >
                  Đăng nhập
                </Title>
                <LoginForm />
              </div>
            </div>
          </div>
        </Row>
      </Content>
    </Layout>
  )
}
