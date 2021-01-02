import axios from "axios";
// ADD TRY CATCHES TO ALL API CALLS

const chitChatTkn = process.env.REACT_APP_CHITCHATS_API_SECRET

export const chitChatsInit = async () => {
    const res = await axios.get('/clients/608245/shipments' , {
        headers: {
            Authorization: chitChatTkn
        }})
    return res
}

export const createShipment = async (orderToBeShipped) => {
    console.log(orderToBeShipped)
    const {ship_to_name, ship_to_street, ship_to_street_2, ship_to_city, ship_to_state, ship_to_country_code, ship_to_zip, buyer_phone,  buyer_email, sub_total, currency, paypal_id} = orderToBeShipped

    const postageType = () => {
        if(ship_to_country_code === 'CA') {
            return "chit_chats_canada_tracked"
        } else if(ship_to_country_code === 'US') {
            return "usps_media_mail"
        } else {
            return "asendia_priority_tracked"
        }
    }
    const postage = postageType()

    const shipmentBody = {
        name: ship_to_name,
        address_1: ship_to_street,
        address_2: ship_to_street_2,
        city: ship_to_city,
        province_code: ship_to_state,
        postal_code: ship_to_zip,
        country_code: ship_to_country_code,
        phone: buyer_phone,
        package_contents: "merchandise",
        description: "Phonographic Record",
        value: sub_total,
        value_currency: currency,
        order_store: "other",
        order_id: paypal_id,
        package_type: "parcel",
        size_x: 33,
        size_y: 33,
        size_z: 4,
        weight: 1.2,
        size_unit: "cm",
        weight_unit: "lb",
        signature_requested: false,
        insurance_requested: 'no',
        ship_date: "today",
        postage_type: postage
    }
    // weight is 0.6 + # recs x 0.6 NEED TO SEE WHAT THIS LOOKS LIKE
    // change rest based on vinyl or other
    console.log(shipmentBody)

    const res = await axios.post('/clients/608245/shipments',
    shipmentBody,
     {
        headers: {
            Authorization: chitChatTkn
        }
    })
    return res
}
