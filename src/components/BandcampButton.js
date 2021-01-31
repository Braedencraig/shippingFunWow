import React, { useState, useEffect } from 'react'
import { getAllShipments } from '../apis/chitchats'
import { markAsShipped } from '../apis/bandcamp'


export default function BandcampButton({ token, unfilledOrders }) {
    const [allShip, setAllShip] = useState(null)

    useEffect(async () => {
        const allShipments = await getAllShipments()
        setAllShip(allShipments)
    }, [setAllShip])

    const markShipped = async (token, order_id, tracking_url) => {
        const markShipped = await markAsShipped(token, order_id, tracking_url)
    }

    return (
        <button onClick={async () => {
            allShip.data.map(shipment => {
                if(shipment.status === 'ready') {
                    markShipped(token, shipment.order_id, shipment.tracking_url)
                }
            })
        }}>
            Send confirmation email to customer and mark shipped bandcamp
        </button>
    )
}
