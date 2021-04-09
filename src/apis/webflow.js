import axios from 'axios'

const token = process.env.REACT_APP_WEBFLOW_API_TOKEN;
const webflowSiteId = process.env.REACT_APP_WEBFLOW_SITE_ID;

export const getOrdersUnshippedWebflow = async () => {
    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'accept-version': '1.0.0'
       },
      };
      const allOrders = await axios.get(
        `https://api.webflow.com/sites/${webflowSiteId}/orders`,
        config
      );
      const unfulfilled = await allOrders.data.filter(order => order.status === "unfulfilled")
      return unfulfilled;
    } catch (error) {
      console.log(error);
    }
};

export const markAsShippedWebflow = async (orderId, trackingUrl) => {
  try {
    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
        'accept-version': '1.0.0'
     },
    };
    const params = {
      sendOrderFulfilledEmail: true
    };
    const fulfillOrder = await axios.post(
      `https://api.webflow.com/sites/${webflowSiteId}/order/${orderId}/fulfill`,
      params,
      config
    );
    return fulfillOrder;
  } catch (error) {
    console.log(error);
  }
};