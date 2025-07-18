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
                    <Title level={3}>🎉 Order purchased successfully!</Title>
                    <Text>We have received your order. Thank you !</Text>
                </div>
            )
        }

        return (
            <div >
                <Title level={3} type='danger'>
                    ❌ Payment failed
                </Title>
                <Text type='secondary'>
                    Payment is failed or declined !
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
                Back To Home
            </Button>
        </Card>
    )
}
export default PaymentPage;
