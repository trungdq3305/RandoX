import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCreatePurchasePaymentHistoryMutation } from '../../features/payment/paymentAPI'
import { Button, Card, message, Typography } from 'antd'
import './paymentPage.css'
import { useClearCartMutation } from '../../features/cart/cartAPI'
const { Title, Text } = Typography

const PaymentPage: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [status, setStatus] = useState<'success' | 'error' | 'processing'>(
        'processing'
    )
    const [createPurchasePaymentHistory] = useCreatePurchasePaymentHistoryMutation();
    const [clearCart] = useClearCartMutation();
    useEffect(() => {
        const rawData: Record<string, string> = Object.fromEntries(
            searchParams.entries()
        )

        console.log('🔍 VNPay Query Params:', rawData)

        const responseCode = rawData.vnp_ResponseCode

        if (!responseCode) {
            message.error('Thiếu thông tin thanh toán từ VNPay')
            setStatus('error')
            return
        }

        const payload = {
            ...rawData,
        }

        createPurchasePaymentHistory(payload)
            .unwrap()
            .then(() => {
                setStatus(responseCode === '00' ? 'success' : 'error')
            })
            .catch((err) => {
                console.error('❌ Không thể lưu trạng thái thanh toán:', err)
                message.error('Không thể cập nhật trạng thái thanh toán')
                setStatus('error')
            })
    }, [searchParams, createPurchasePaymentHistory])

    useEffect(() => {
        if (status === 'success') {
            clearCart({})
                .unwrap()
                .then(() => {
                    console.log('🛒 Đã xóa giỏ hàng sau khi thanh toán thành công');
                })
                .catch((error) => {
                    console.error('❌ Lỗi xóa giỏ hàng:', error);
                    message.error('Có lỗi xảy ra khi xóa giỏ hàng');
                });
        }
    }, [status, clearCart]);

    const renderContent = () => {
        if (status === 'processing') {
            return <Text>Đang xử lý thanh toán...</Text>
        }

        if (status === 'success') {
            return (
                <div >
                    <Title level={3}>🎉 Thanh toán thành công!</Title>
                    <Text>Chúng tôi đã nhận được thanh toán của bạn. Xin cảm ơn!</Text>
                </div>
            )
        }

        return (
            <div >
                <Title level={3} type='danger'>
                    ❌ Thanh toán thất bại!
                </Title>
                <Text type='secondary'>
                    Giao dịch không thành công hoặc bị từ chối.
                </Text>
            </div>
        )
    }
    return (
        <Card style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }} className='payment-container'>
            {renderContent()}
            <Button
                type='primary'
                onClick={() => navigate('/')}
                style={{ marginTop: 24 }}
                className='return-button'
            >
                Về trang chủ
            </Button>
        </Card>
    )
}
export default PaymentPage;
