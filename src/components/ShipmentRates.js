import React, { useEffect, useState } from 'react'
import { buyShipment } from '../apis/chitchats'

const ShipmentRates = ({ rates, shipId }) => {
    let namesOfRates = []
    rates.map(rate => namesOfRates.push(rate.postage_type))
    const hasAsendia = namesOfRates.includes('asendia_priority_tracked')

    const [rate, setRate] = useState('')

    useEffect(() => {
    }, [hasAsendia, rates, rate])

    return (
        <>
        {rates.length !== 0 && !hasAsendia ? (
            //  NEED A USER FROM SLOVENIA SO I CAN TEST THIS WHEN ASENDIA IS NOT AVAILABLE
            <>
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
                    // This could be just a function call
                }}>Buy shipment with selected rate</button>
            </>
        ) : ''}
        </>
    )
}

export default ShipmentRates