import { google } from 'googleapis';

// Initialize the OAuth2 client
// const oauth2Client = new google.auth.OAuth2(
//   {  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//     client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//     redirect_uri: 'http://localhost:3000/api/auth/google/callback'}
// );

// const googleAds = google.ads({ version: 'v11' });

// export const grantManagerAccess = async (managerCustomerId, clientCustomerId, refreshToken) => {
//   oauth2Client.setCredentials({
//     refresh_token: refreshToken,
//   });

//   const request = {
//     customerClientLink: {
//       clientCustomerId: clientCustomerId,
//       status: 'PENDING',
//     },
//   };

//   try {
//     const response = await googleAds.customers.customerClientLinks.create({
//       customerId: managerCustomerId,
//       requestBody: request,
//       auth: oauth2Client,
//     });

//     console.log('Linked account: ', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error linking account: ', error);
//     throw error;
//   }
// };


