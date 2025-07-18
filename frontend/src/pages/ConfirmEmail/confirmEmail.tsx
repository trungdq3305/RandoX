
import { useEffect } from 'react';
import { useConfirmEmailMutation } from '../../features/auth/emailAPI';
import { Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography

function ConfirmEmail() {
    const [confirmEmail] = useConfirmEmailMutation();
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');

        if (token && email) {
            confirmEmail({ token, email })
                .unwrap()
                .then(() => {
                    console.log('Tài khoản đã được xác thực thành công');
                    // Chuyển hướng hoặc hiển thị thông báo thành công
                })
                .catch((err) => {
                    console.error('Lỗi xác thực tài khoản:', err);
                    // Hiển thị thông báo lỗi
                });
        }
    }, [confirmEmail]);
    return (
        <Card style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }} className='payment-container'>
            <div >
                <Title level={3}>🎉 Account confirmed successfully !</Title>
                <Text>Start your journey with blindbox now !!</Text>
            </div>
            <Button
                type='primary'
                onClick={() => navigate('/')}
                style={{ marginTop: 24 }}
                className='return-button'
            >
                Back To Home
            </Button>
        </Card>
    );
}

export default ConfirmEmail;