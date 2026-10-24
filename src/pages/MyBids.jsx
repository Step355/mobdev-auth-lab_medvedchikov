import { useEffect, useState } from "react"
import { api } from "../api/api"

const MyBids = () => {
    const [bids, setBids] = useState([])
    const totalCount = bids.length
    const winningCount = bids.filter((bid) => bid.isWinning).length
    const totalAmount = bids.reduce((sum, bid) => sum + Number(bid.amount), 0)

    useEffect(() => {
        const load = async () => {
            const res = await api.getMyBids()
            setBids(res.data)
        }
        load()
    }, [])

    return (
        <div className="container">

            <div class="page-header">
                <h1>Мои ставки</h1>
                <p class="page-subtitle">История ваших ставок на товары</p>
            </div>

            <div class="bids-summary">
                <div class="summary-card">
                    <span class="summary-value">{totalCount}</span>
                    <span class="summary-label">Всего ставок</span>
                </div>
                <div class={`summary-card ${winningCount > 0 ? "winning" : ""}`}>
                    <span class="summary-value">{winningCount}</span>
                    <span class="summary-label">Лидирующих ставок</span>
                </div>
                <div class="summary-card">
                    <span class="summary-value">{totalAmount.toLocaleString("ru-RU")} ₽</span>
                    <span class="summary-label">Общая сумма</span>
                </div>
            </div>

            <div className="bids-list">
                {bids.map((bid) => (
                    <div className={`bid-item ${bid.isWinning ? "winning" : ""}`} key={bid.id}>
                        <div className="bid-item-content">
                            <div className="bid-item-header">
                                <a href={`/item/${bid.itemId}`} className="bid-item-title">
                                    {bid.itemTitle}
                                </a>
                                {bid.isWinning ? (
                                    <span className="winning-badge"> Лидирую</span>
                                ) : (
                                    <span className="outbid-badge">Перебита</span>
                                )}
                            </div>
                            <div className="bid-item-meta">
                                <span>⏰ {new Date(bid.createdAt).toLocaleString("ru-RU")}</span>
                            </div>
                        </div>
                        <div className="bid-item-amount">
                            <span className="bid-amount">{Number(bid.amount).toLocaleString("ru-RU")} ₽</span>
                            <span className="bid-status">Моя ставка</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default MyBids