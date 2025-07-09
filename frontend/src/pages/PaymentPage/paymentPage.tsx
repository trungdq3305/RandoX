import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCreatePurchasePaymentHistoryMutation } from '../../features/payment/paymentAPI'
import { Button, Card, message, Typography } from 'antd'
const { Title, Text } = Typography

const PaymentPage: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [status, setStatus] = useState<'success' | 'error' | 'processing'>(
        'processing'
    )
    const [createPurchasePaymentHistory] = useCreatePurchasePaymentHistoryMutation();
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

    const renderContent = () => {
        if (status === 'processing') {
            return <Text>Đang xử lý thanh toán...</Text>
        }

        if (status === 'success') {
            return (
                <>
                    <Title level={3}>🎉 Thanh toán thành công!</Title>
                    <Text>Chúng tôi đã nhận được thanh toán của bạn. Xin cảm ơn!</Text>
                </>
            )
        }

        return (
            <>
                <Title level={3} type='danger'>
                    ❌ Thanh toán thất bại!
                </Title>
                <Text type='secondary'>
                    Giao dịch không thành công hoặc bị từ chối.
                </Text>
            </>
        )
    }

    return (
        <Card style={{ maxWidth: 500, margin: '40px auto', textAlign: 'center' }}>
            {renderContent()}
            <Button
                type='primary'
                onClick={() => navigate('/')}
                style={{ marginTop: 24 }}
            >
                Về trang chủ
            </Button>
        </Card>
    )
}
export default PaymentPage;
