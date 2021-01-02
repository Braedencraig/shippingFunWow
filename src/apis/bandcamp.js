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
    const bodyParameters = {
      key: "value",
    };
    const getBands = await axios.post(
      "/api/account/1/my_bands",
      bodyParameters,
      config
    );
    return getBands;
};

export const getOrdersUnshipped = async (token, bands) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const paramTest = {
      band_id: bands.data.bands[2].band_id,
      unshipped_only: true,
    };
    const allOrders = await axios.post(
      "/api/merchorders/3/get_orders",
      paramTest,
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
    
    const paramTest = {
      band_id: bands.data.bands[2].band_id,
      start_time: recentDateFrom
    };
    const allRecentOrders = await axios.post(
      "/api/merchorders/3/get_orders",
      paramTest,
      config
    );
    return allRecentOrders
}