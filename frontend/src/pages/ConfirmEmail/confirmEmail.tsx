import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Card, message, Typography } from 'antd'
import '../PaymentPage/paymentPage.css'
import { useConfirmEmailMutation } from '../../features/auth/authApi'
// const { Title, Text } = Typography

const ConfirmEmail: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [confirmEmail] = useConfirmEmailMutation();

    useEffect(() => {
        const rawData: Record<string, string> = Object.fromEntries(
            searchParams.entries()
        )
        console.log('🔍 Email Query Params:', rawData)
        const payload = {
            ...rawData,
        }

        const confirmRes = confirmEmail(payload).unwrap()
        console.log(confirmRes)
    }, [searchParams])

    // useEffect(() => {
    //     if (status === 'success') {
    //         clearCart({})
    //             .unwrap()
    //             .then(() => {
    //                 console.log('🛒 Đã xóa giỏ hàng sau khi thanh toán thành công');
    //             })
    //             .catch((error) => {
    //                 console.error('❌ Lỗi xóa giỏ hàng:', error);
    //                 message.error('Có lỗi xảy ra khi xóa giỏ hàng');
    //             });
    //     }
    // }, [status, clearCart]);

    // const renderContent = () => {
    //     if (status === 'processing') {
    //         return <Text>Đang xử lý thanh toán...</Text>
    //     }

    //     if (status === 'success') {
    //         return (
    //             <div >
    //                 <Title level={3}>🎉 Thanh toán thành công!</Title>
    //                 <Text>Chúng tôi đã nhận được thanh toán của bạn. Xin cảm ơn!</Text>
    //             </div>
    //         )
    //     }

    //     return (
    //         <div >
    //             <Title level={3} type='danger'>
    //                 ❌ Thanh toán thất bại!
    //             </Title>
    //             <Text type='secondary'>
    //                 Giao dịch không thành công hoặc bị từ chối.
    //             </Text>
    //         </div>
    //     )
    // }
    return (
        // <Card style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }} className='payment-container'>
        //     {renderContent()}
        //     <Button
        //         type='primary'
        //         onClick={() => navigate('/')}
        //         style={{ marginTop: 24 }}
        //         className='return-button'
        //     >
        //         Về trang chủ
        //     </Button>
        // </Card>
        <>
        </>
    )
}
export default ConfirmEmail;
