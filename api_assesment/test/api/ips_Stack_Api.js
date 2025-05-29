const axios = require('axios');

class IpsStackApi {
  constructor() {
    this.baseUrl = 'http://api.ipstack.com'; 
    this.accessKey = '1871c4de7f9c26ebd3bc7fe4dae4d880';
  }

  async getIpInfo(ip, key = this.accessKey) {
    const url = `${this.baseUrl}/${ip}?access_key=${key}`;
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      if (error.response) {
        return error.response; // includes status and data with error info
      }
      throw error; // for network or unexpected issues
    }
  }
}

module.exports = new IpsStackApi();
