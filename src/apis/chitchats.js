import axios from "axios";
import axiosWithDelimiterFile from '../apis/axios'

// ADD TRY CATCHES TO ALL API CALLS AND DO ERROR HANDLING FOR THE APPLICATION

const chitChatTkn = process.env.REACT_APP_CHITCHATS_API_SECRET_STAGING
const chitChatClientId = process.env.REACT_APP_CHITCHATS_API_CLIENT_ID_STAGING

export const createShipment = async (orderToBeShipped) => {
    try {
        // const {ship_to_name, ship_to_street, ship_to_street_2, ship_to_city, ship_to_state, ship_to_country_code, ship_to_zip, buyer_phone, buyer_email, sub_total, currency, paypal_id, quantity, order_total, item_name} = await orderToBeShipped
        console.log(orderToBeShipped)
        let postageType = () => {
            if(orderToBeShipped[0].ship_to_country_code === 'SI') {
                return "usps_first_class_package_international_service"
            } else if(orderToBeShipped[0].ship_to_country_code === 'CA') {
                return "chit_chats_canada_tracked"
            } else if(orderToBeShipped[0].ship_to_country_code === 'US') {
                return "usps_media_mail"
            } else {    
                return "asendia_priority_tracked"
            }
        }

        let postage = postageType()
        console.log(postage)
    
        // let shipmentBody = {
        //     name: orderToBeShipped[0].ship_to_name,
        //     address_1: orderToBeShipped[0].ship_to_street,
        //     address_2: orderToBeShipped[0].ship_to_street_2,
        //     city: orderToBeShipped[0].ship_to_city,
        //     province_code: orderToBeShipped[0].ship_to_state,
        //     postal_code: orderToBeShipped[0].ship_to_zip,
        //     country_code: orderToBeShipped[0].ship_to_country_code,
        //     phone: orderToBeShipped[0].buyer_phone,
        //     package_contents: "merchandise",
        // Phonographic Record, T-Shirt ------------
        //     description: "Phonographic Record",
        // Every Item is $25 ------------------------- use for value, so quantity x $25
        // quantity/order_toal is actually how many of each individual item 2 is 2 records.
        //     value: orderToBeShipped[0].sub_total,
        //     value_currency: orderToBeShipped[0].currency,
        //     order_store: "other",
        //     order_id: orderToBeShipped[0].paypal_id,
        //     package_type: "parcel",
        // T-shirt by itself, is 26-x, 34-y, 4-z, Vinyl or Vinyl + T-shirt, 33x 33y 4z
        //         1-3 Items Z4
        // 4-20 Items Z13
        // 20+ Items Z27
        //     size_x: 33,
        //     size_y: 33,
        //     size_z: 4,
        // WEIGHT!?!!?!??!?!?!
        //     weight: 1.2,
        //     size_unit: "cm",
        //     weight_unit: "lb",
        //     signature_requested: false,
        //     insurance_requested: 'no',
        //     ship_date: "today",
        //     postage_type: postage
        // }

        // console.log(shipmentBody)
    
        // const res = await axios.post(`/clients/${chitChatClientId}/shipments`,
        // shipmentBody,
        //  {
        //     headers: {
        //         Authorization: chitChatTkn
        //     }
        // })
    
        // return {
        //     id: res.data.shipment.id,
        //     tracking: res.data.shipment.tracking_url,
        //     rates: res.data.shipment.rates,
        //     name: ship_to_name
        // }
        
    } catch (error) {
        console.log(error)
    }
}

export const getShipment = async (id) => {
    const res = await axios.get(`/clients/${chitChatClientId}/shipments/${id}`, {
        headers: {
            Authorization: chitChatTkn
        }  
    });
    if(res.status === 200) {
        return res
    } else {
        console.log('HERERERE')
        return false
    }
}

export const buyShipment = async (shipmentId, postageType = null) => {
    if(postageType === null) {
        const res = await axiosWithDelimiterFile.patch(`/clients/${chitChatClientId}/shipments/${shipmentId}/buy`, null, {
            headers: {
                Authorization: chitChatTkn
            }
        })
        if(res.status === 200) {
            return true
        }
        // if(res.status === 400) {
        //     const res = await axios.patch(`/clients/${chitChatClientId}/shipments/${shipmentId}/buy`, null, {
        //         headers: {
        //             Authorization: chitChatTkn
        //         }
        //     })
        //     return true
        // }
    } else {
        const params = {
            postage_type: postageType
        }
        const res = await axios.patch(`/clients/${chitChatClientId}/shipments/${shipmentId}/buy`, params, {
            headers: {
                Authorization: chitChatTkn
            }
        })
        if(res.status === 200) {
            return true
        }
    }
}
