import { Link, useNavigate, useParams } from "react-router-dom"
import Input from "../components/Input"
import Button from "../components/Button"
import { useItemStore } from "../store/useItemStore"
import { useEffect, useState } from "react"
import { useUserStore } from "../store/useUserStore"
import { api } from "../api/api"

const ItemDetail = () => {

    const [bids, setBids] = useState([])
    const { id } = useParams()
    const [item, setItem] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [timerId, setTimerId] = useState(undefined)
    const session = useUserStore(state => state.session)
    const navigate = useNavigate()
    const [isOwner, setIsOwner] = useState(undefined)

    const handleBid = async (e) => {
        e.preventDefault()

        if (!session) return navigate('/register')
        setError("")

        const form = e.target
        const amount = Number(form.bidInput.value)

        try {
            await api.createBid({ id, amount })
            form.reset()
            setBids((await api.getItemBids(id)).data)
        } catch (err) {
            setError(err?.message ?? String(err))
        }
    }


    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            try {
                const res = await api.getItemDetails(id)
                setItem(res.data)
            } catch (error) {
                console.error(error)
                setError(error.item || "чтото пошло не так")
            }
            finally {
                setIsLoading(false)

            }
        }

        const loadBids = async () => {
            setIsLoading(true)
            try {
                setBids((await api.getItemBids(id)).data)
            } catch (error) {
                setError(error.message || "Something went wrong")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        load()
        loadBids()
        setTimerId(setInterval(() => {
            (async () => {
                try {
                    const res = await api.getItemBids(id)
                    setBids(res.data)
                } catch (error) { }
            })()
        }, 10000))
        return () => {
            clearInterval(timerId)
        }

    }, [])

    useEffect(() => {
        session && item && setIsOwner(session?.user?.id === item.userId)
    }, [session, item])

    const handleDelete = async () => {
        try {
            await api.deleteItems({ id })
            await useItemStore.getState().getItems()
            navigate("/")
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.message || "Не удалось удалить товар")
        }
        clearInterval(timerId)
    }





    return (
        <div className="container">

            <Link to={"/"}>← Вернуться к списку товаров</Link>

            <div className="item-detail">
                {isLoading && <p>загрузка..</p>}
                {!isLoading && error && <p>{error}</p>}
                {!isLoading && !error && item && (<>
                    <div className="item-header">
                        <div>
                            <img src={item.imageUrl} className="item-image-large" />
                        </div>

                        <div className="item-info">
                            <span className="item-status">{item.status}</span>

                            <h1 className="item-title-large">{item.title}</h1>

                            <div className="item-seller-info">
                                <div className="seller-avatar">TS</div>
                                <div className="seller-details">
                                    <div className="seller-name">{item.username}</div>
                                    <div className="seller-date">{item.createdAt}</div>
                                </div>
                            </div>

                            <div className="item-description-full">
                                {item.description}
                            </div>

                            <div className="price-section">
                                <div className="starting-price">Начальная цена:</div>
                                <div className="current-price">{item.price}</div>
                                {bids.length > 0 && <div className="highest-bid">Текущая ставка: {bids[0].amount}</div>
                                }
                                <form className="bid-form" onSubmit={handleBid}>
                                    <Input
                                        type="number"
                                        name="bidInput"
                                        className="bid-input"
                                        placeholder="Введите вашу ставку (мин. 70 001 ₽)"
                                        min={item.highestBid}
                                        step="100"
                                    />



                                    {!isOwner && <Button type="submit" className="btn-bid">Сделать ставку</Button>
                                    }

                                    {isOwner && (
                                        <Button onClick={handleDelete} type="button" className="btn-delete" >
                                            Удалить товар
                                        </Button>
                                    )}
                                </form>
                            </div>

                        </div>
                    </div>

                    <div className="bids-section">
                        <div className="bids-header">
                            <h2 className="bids-title">История ставок</h2>
                            <span className="bids-count">{bids.length}</span>
                        </div>

                        <div className="bids-list">
                            {bids.length === 0 && <p>Ставок пока нет</p>}
                            {bids.map((bid, index) => (
                                <div
                                    className={`bid-item ${index === 0 ? "highest-bid-item" : ""}`}
                                    key={bid.id}
                                >
                                    <div className="bid-user">
                                        <div className="bid-avatar">
                                            {bid.username?.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="bid-details">
                                            <span className="bid-username">{bid.username}</span>
                                            <span className="bid-time">
                                                {new Date(bid.createdAt).toLocaleString("ru-RU")}
                                            </span>
                                        </div>
                                        {index === 0 && (
                                            <span className="highest-badge">🏆 Лидирует</span>
                                        )}
                                    </div>
                                    <div className="bid-amount">{bid.amount} ₽</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>)}
            </div>
        </div>
    )
}

export default ItemDetail