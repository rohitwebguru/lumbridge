import { NextResponse } from 'next/server';
import { GoogleAdsApi } from 'google-ads-api';
import { google } from 'googleapis';
import axios from 'axios';
export async function POST(req) {
  const data = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    developer_token: process.env.NEXT_PUBLIC_GOOGLE_DEVELOPER_TOKEN,
     };
  const googleAdsClient = new GoogleAdsApi(data);
  // const { managerCustomerId, clientCustomerId, refreshToken } = req.body(); 
  let rt = '1//0glDNBLbNl_zrCgYIARAAGBASNwF-L9IrWD-CaWcX-Xk3rVbgGNr1cBUa2_Mcngb3K7Xw17xCr3EiFFuQ8NDFrtIs4iR5dD2BQJc'
let at = 'ya29.a0AcM612yd-bHCKRHn8DM0ESnnOEwqmljGTxt_ovclM0BoRLZd8PawAGSVd7A35A7wtUdy-GqbHBcyVrkb7-bbLZR7iiHbijRJ68_b2IsA0DtQgTqRvelQq9owBHN_4pBbdyQ8RWDDbhyD1YZlF68189mQsPEknIBp23LvbvmQaCgYKATkSARESFQHGX2MiOlq9RKIJuxnxygm5S-9Kxg0175'
  try {
    console.log(googleAdsClient)
    const customers = await googleAdsClient.listAccessibleCustomers(rt);
    console.log('Linked account: ', customers.resource_names);

    let mainId = customers.resource_names?.[0]?.split('/').pop()

    let mcc = googleAdsClient.Customer({
      customer_id: mainId,
      refresh_token: rt,
      login_customer_id: mainId,
    })
    
    let clusterClients = await mcc.report({
      entity: 'customer_client',
      attributes: ['customer_client.id', 'customer_client.resource_name', 'customer_client.descriptive_name'],
    })

    console.log('clusterClients')
    console.log(clusterClients)
    
    const accountDetails = [];

    // // Loop through each customer resource name to get the account details
    // for (const resourceName of customers.resource_names) {
    //     const customerId = resourceName.split('/')[1]; // Extract the customer ID

    //     const customerUrl = `https://googleads.googleapis.com/v17/customers/${customerId}`;

    //     // Fetching the customer details for each account
    //     const customerResponse = await axios.get(customerUrl, {
    //         headers: {
    //             Authorization: `Bearer ${at}`,
    //             'developer-token': process.env.NEXT_PUBLIC_GOOGLE_DEVELOPER_TOKEN,
    //         },
    //     });

    //     // Adding the customer details to the array
    //     accountDetails.push({
    //         customerId,
    //         name: customerResponse.data.descriptiveName, // The account name
    //         currency: customerResponse.data.currencyCode, // Account currency
    //         timezone: customerResponse.data.timeZone, // Account time zone
    //     });
    // }


    return NextResponse.json({ customers, accountDetails }, { status: 200 });
  } catch (error) {
    console.error('Error linking account: ', error);
    return NextResponse.json({ error: 'Error linking account.' }, { status: 500 });
  }
};

