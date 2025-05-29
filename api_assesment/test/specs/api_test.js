const ipsStackApi = require('../api/ips_Stack_Api');
const { expect } = require('chai');

describe('IPStack API Tests (POM-based)', () => {
  it('Verification with valid IP and its response', async () => {
    const ip = '134.201.250.155';
    const response = await ipsStackApi.getIpInfo(ip);

    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('ip', ip);
    expect(response.data).to.have.property('country_name').that.is.a('string');
  });

  it('Verification with multiple IPs (negative test)', async () => {
    const ips = '72.229.28.185,110.174.165.78';
    const response = await ipsStackApi.getIpInfo(ips);

    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.error && response.data.error.info) {
      console.log('API Error Info:', response.data.error.info);
    }

    expect(response.status).to.equal(200);
    expect(response.data.success).to.be.false;
    expect(response.data.error).to.have.property('code');
  });

  it('Verification with invalid IP', async () => {
    const response = await ipsStackApi.getIpInfo('999.999.999.999');

    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.error && response.data.error.info) {
      console.log('API Error Info:', response.data.error.info);
    }

    expect(response.status).to.equal(200);
    expect(response.data.success).to.be.false;
    expect(response.data.error).to.have.property('code');
  });

  it('Verification with invalid access key', async () => {
    const response = await ipsStackApi.getIpInfo('134.201.250.155', 'INVALID_KEY');

    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.error && response.data.error.info) {
      console.log('API Error Info:', response.data.error.info);
    }

    expect(response.status).to.equal(200);
    expect(response.data.success).to.be.false;
    expect(response.data.error).to.have.property('code');
  });
});
