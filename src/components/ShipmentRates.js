import React, { useEffect, useState } from 'react'
import { buyShipment } from '../apis/chitchats'

const ShipmentRates = ({ rates, shipId, idx }) => {
    let namesOfRates = []
    rates.map(rate => namesOfRates.push(rate.postage_type))
    const hasAsendia = namesOfRates.includes('asendia_priority_tracked')

    const [rate, setRate] = useState('')
    const [shipmentBought, setShipmentBought] = useState(false)

    useEffect(() => {
    }, [hasAsendia, rates, rate, setShipmentBought])

    return (
        <>
        {rates.length !== 0 && !hasAsendia && !shipmentBought ? (
            <div className='selectShipment'>
                <h3>Please select an alternative shipment rate, asendia priority tracked unavailable</h3>
                <label htmlFor="rates">Choose a shipment rate:</label>
                <select name="rates" id="rates" onChange={(e) => {
                    setRate(e.target.value)
                }}>
                {rates.length !== 0 && rates.map(rate => {
                    return <option value={rate.postage_type}>{rate.postage_type}</option>
                })}
                </select>
                <button onClick={async () => {
                    const shipmentBought = await buyShipment(shipId, rate)
                    setShipmentBought(true)
                    const errorBoxes = Array.from(document.getElementsByClassName('error'))
                    errorBoxes.map(error => {
                        if(Array.from(error.children).length === 9) {
                            error.style.display = 'none'
                        }
                    })
                }}>Buy shipment with selected rate</button>
            </div>
        ) : ''}
        </>
    )
}

export default ShipmentRates