import axios from "axios";
// ADD TRY CATCHES TO ALL API CALLS

export const getCredentials = async () => {
    const client_id = process.env.REACT_APP_BANDCAMP_CLIENT_ID;
    const client_secret = process.env.REACT_APP_BANDCAMP_CLIENT_SECRET;
    const dataType = "json";
    const grant_type = "client_credentials";
    const credentials = await axios.post(
      `/oauth_token`,
      null,
      {
        params: {
          client_id,
          client_secret,
          dataType,
          grant_type,
        },
      }
    );
    return credentials;
};

export const getBands = async (token) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    // const bodyParameters = {
    //   key: "value",
    // };
    const getBands = await axios.post(
      "/api/account/1/my_bands",
      null,
      config
    );
    return getBands;
};

export const getOrdersUnshipped = async (token, bands) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const params = {
      band_id: bands.data.bands[2].band_id,
      unshipped_only: true,
    };
    const allOrders = await axios.post(
      "/api/merchorders/3/get_orders",
      params,
      config
    );
    return allOrders
}

export const getAllRecentOrders = async (token, bands) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const oneMonthsAgo = new Date();
    oneMonthsAgo.setMonth(oneMonthsAgo.getMonth() - 1);
    const recentDateFrom = `${oneMonthsAgo.getFullYear()}-${oneMonthsAgo.getMonth()}-01`
    
    const params = {
      band_id: bands.data.bands[2].band_id,
      start_time: recentDateFrom
    };
    const allRecentOrders = await axios.post(
      "/api/merchorders/3/get_orders",
      params,
      config
    );
    return allRecentOrders
}

export const markAsShipped = async (token, orderToBeShipped, trackingUrl) => {
  // THIS WORKS DONT USE BECAUSE IT FUCKS SHIT UP, ask alex to make a bunch of fake orders so I can mark as shipped?!?!?!?!
  // WHEN inducted/released, click buttton that takes all orders that are received and then markAsShipped, inducted on clikc, then send mark as shipped.
  // 
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const params = {
    items: [
      {
        id: orderToBeShipped.payment_id,
        id_type: "p",
        shipped: true,
        tracking_code: trackingUrl,
        notification: true,
        notification_message: `Your items will be shipped within 24 hours! Your tracking url is ${trackingUrl}`
      }
    ]
  }
    
  return params

  // const shippedOrder = await axios.post(
  //   "/api/merchorders/2/update_shipped",
  //   params,
  //   config
  // );
  // console.log(shippedOrder, 'ORDER SHIPPED?!?!')
  // return shippedOrder
}