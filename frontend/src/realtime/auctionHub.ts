import * as signalR from '@microsoft/signalr'

let connection: signalR.HubConnection

export const connectToAuctionHub = async (
  sessionId: string,
  onNewBid: (bidderName: string, amount: number) => void,
  onAuctionEnded: (winnerName: string, amount: number) => void,
  onTimeExtended: (newEndTime: string) => void
) => {
  const apiBase = import.meta.env.VITE_API_ENDPOINT
  if (!apiBase) {
    console.error('❌ VITE_API_ENDPOINT chưa được cấu hình.')
    return
  }

  const hubUrl = `${apiBase.replace('/api', '')}/hubs/auction`

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .withAutomaticReconnect()
    .build()

  connection.on('ReceiveNewBid', onNewBid)
  connection.on('AuctionEnded', onAuctionEnded)
  connection.on('TimeExtended', onTimeExtended)

  try {
    await connection.start()
    await connection.invoke('JoinSession', sessionId)
    console.log('✅ Connected to SignalR hub')
  } catch (err) {
    console.error('❌ Không thể kết nối SignalR:', err)
  }
}

export const sendBid = async (
  sessionId: string,
  bidderName: string,
  amount: number
) => {
  if (connection?.state === 'Connected') {
    await connection.invoke('NotifyNewBid', sessionId, bidderName, amount)
  }
}

export const disconnectFromAuctionHub = async (sessionId: string) => {
  if (connection?.state === 'Connected') {
    await connection.invoke('LeaveSession', sessionId)
    await connection.stop()
    console.log('🛑 Disconnected from SignalR')
  }
}
