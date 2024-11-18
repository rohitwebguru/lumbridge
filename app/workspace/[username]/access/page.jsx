
"use client";
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { signIn } from 'next-auth/react';
import Image from 'next/image'

export default function Connections() {
  const { username } = useParams();
  const name = username.replace(/-/g, ' ');

  const access = window ? window.location.href.split('/').pop() : null;

  const [userDetails, setUserDetails] = useState('');
  const [userScopes, setUserscopes] = useState();
  const [error, setError] = useState('');
  const [grantinfo, setGrantinfo] = useState('');
  const [successmsg, setSuccessmsg] = useState('');
  const [accountid, setAccountid] = useState('');
  const [tagmanager, setTagmanager] = useState('');
  const [Listing, setListing] = useState({

  });
  // const [pageOpen, setPageOpen] = useState(false)
  // const [selectedPage, setSelectedPage] = useState(null)
  const [instagramOpen, setInstagramOpen] = useState(false)
  const [pageOpen, setPageOpen] = useState({});
  const [selectedPages, setSelectedPages] = useState({});
  const [selectedInstagram, setSelectedInstagram] = useState(null)

  // const handlePageSelect = (page) => {
  //   setSelectedPage(page)
  //   setPageOpen(false)
  // }
  const handlePageSelect = (page, key) => {
    setSelectedPages((prevSelected) => ({
      ...prevSelected,
      [key]: page,
    }));
    setPageOpen((prevPageOpen) => ({
      ...prevPageOpen,
      [key]: false,
    }));
  };

  const handleRemovePage = (key) => {
    setSelectedPages((prevSelected) => ({
      ...prevSelected,
      [key]: null,
    }));
  };

  const handleInstagramSelect = (account) => {
    setSelectedInstagram(account)
    setInstagramOpen(false)
  }

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('/api/getuserdetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: name,
      });

      const data = await response.json();

      if (data.success) {
        const { name, email, provider } = data.data;
        setUserDetails({ name, email, provider });
        setError('');
      } else {
        setError(data.message);
        setUserDetails(null);
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Something went wrong');
    }
  };

  const fetchscopesusingslug = async () => {
    try {
      const res = await fetch('/api/get-link-from-scope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: access,
          username: name
        }),
      });

      const data = await res.json();
      if (data.success) {
        setUserscopes(data.data.scopes);

        setError('');
      } else {
        setError(data.message);
        setUserscopes(null);
      }
    } catch (error) {
      console.error('Error fetching user details:', err);
      setError('Something went wrong');
    }
  };

  useEffect(() => {
    console.log(userScopes);
  }, [userScopes]);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch('/api/get-accesstoken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: name, slug: access }),
        });

        const data = await response.json();

        if (data) {
          console.log('List retrieved:', data.data?.clients[0]?.access_token);
          const accessToken = data.data?.clients[0]?.access_token;
          let scopes = userScopes;
          setGrantinfo(data.data?.clients[0])
          await getuseraccountlisting(accessToken, scopes);
          // console.log('hjhjhj',scopes);
          //  await getApiEndpoint(scopes);
        } else {
          console.error('Failed to retrieve list:', data.message);
        }
      } catch (error) {
        console.error('Error fetching list:', error);
      }
    };

    fetchAccessToken();
  }, [name, access, userScopes]);

  const getuseraccountlisting = async (accessToken, scopes) => {
    try {
      if (scopes?.google && Array.isArray(scopes.google) && scopes.google.length > 0) {
        const userScopes = scopes.google.flat();

        for (const scope of userScopes) {
          const matchedPermission = googlePermissions.find(
            (permission) => permission.scope === scope
          );

          if (matchedPermission) {
            let response, data;
            switch (matchedPermission.name) {
              case 'Google Ads':
                response = await fetch('/api/access_googleads', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  googleAds: data.data || [],
                }));
                break;
              case 'Analytics':
                response = await fetch('/api/access_googleanayltics', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  analytics: data.accounts || [],
                }));
                break;
              case 'Tag Manager':
                response = await fetch('/api/access_list_tagmanager', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  tagManager: data.container || [],
                }));
                break;
              case 'Business Profile':
                response = await fetch('/api/access_business', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  businessProfile: data.data || [],
                }));
                break;
              case 'Google Search Console':
                response = await fetch('/api/access_googlesearchconsole', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  searchConsole: data.data || [],
                }));
                break;
              default:
                console.error('No API available for this Google scope');
            }
          }
        }
      }

      if (scopes?.facebook && Array.isArray(scopes.facebook) && scopes.facebook.length > 0) {
        const userScopes = scopes.facebook.flat();

        for (const scope of userScopes) {
          const matchedFacebookPermission = facebookPermissions.find(
            (permission) => permission.scope === scope
          );

          if (matchedFacebookPermission) {
            let response, data;
            switch (matchedFacebookPermission.name) {
              case 'Ad Account':
                response = await fetch('/api/access_facebookadaccount', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  adacount: data.data || [],
                }));
                break;
              case 'Facebook Page':
                response = await fetch('/api/access_facebookpage', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  fbpage: data.data || [],
                }));
                break;
              case 'Instagram Page':
                response = await fetch('/api/access_instagrampage', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  instagramPage: data.instagramAccounts || [],
                }));
                break;
              case 'Pixel':
                response = await fetch('/api/access_facebookpixel', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  pixel: data.pixel || [],
                }));
                break;
              case 'Catalog':
                response = await fetch('/api/access_facebookcatalog', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ accessToken }),
                });
                data = await response.json();
                setListing((prevState) => ({
                  ...prevState,
                  catalog: data.catalog || [],
                }));
                break;
              default:
                console.error('No API available for this Facebook scope');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };


  // const getuseraccountlisting = async (accessToken, scopes) => {
  //   try {
  //     const apiCalls = [];

  //     if (scopes?.google && Array.isArray(scopes.google) && scopes.google.length > 0) {
  //       const userScopes = scopes.google.flat();

  //       userScopes.forEach(scope => {
  //         const matchedPermission = googlePermissions.find(permission =>
  //           permission.scope === scope
  //         );

  //         if (matchedPermission) {
  //           switch (matchedPermission.name) {
  //             case 'Google Ads':
  //               apiCalls.push(fetch('/api/access_googleads', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             case 'Analytics':
  //               apiCalls.push(fetch('/api/access_googleanayltics', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             case 'Tag Manager':
  //               apiCalls.push(fetch('/api/access_list_tagmanager', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             case 'Business Profile':
  //               apiCalls.push(fetch('/api/access_businessprofile', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             case 'Google Search Console':
  //               apiCalls.push(fetch('/api/access_googlesearchconsole', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             default:
  //               console.error('No API available for this Google scope');
  //           }
  //         }
  //       });
  //     }

  //     if (scopes?.facebook && Array.isArray(scopes.facebook) && scopes.facebook.length > 0) {
  //       const userScopes = scopes.facebook.flat();

  //       userScopes.forEach(scope => {
  //         const matchedFacebookPermission = facebookPermissions.find(permission =>
  //           permission.scope === scope
  //         );

  //         if (matchedFacebookPermission) {
  //           switch (matchedFacebookPermission.name) {
  //             case 'Ad Account':
  //               apiCalls.push(fetch('/api/access_facebookadaccount', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             case 'Facebook Page':
  //               apiCalls.push(fetch('/api/access_facebookpage', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             case 'Instagram Page':
  //               apiCalls.push(fetch('/api/access_instagrampage', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             case 'Pixel':
  //               apiCalls.push(fetch('/api/access_facebookpixel', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             case 'Catalog':
  //               apiCalls.push(fetch('/api/access_facebookcatalog', {
  //                 method: 'POST',
  //                 headers: {
  //                   'Content-Type': 'application/json',
  //                 },
  //                 body: JSON.stringify({ accessToken }),
  //               }));
  //               break;
  //             default:
  //               console.error('No API available for this Facebook scope');
  //           }
  //         }
  //       });
  //     }

  //     if (apiCalls.length === 0) {
  //       throw new Error('No API URL matched for provided scopes');
  //     }

  //     const responses = await Promise.all(apiCalls);
  //     console.log('1221', responses)
  //     for (const response of responses) {

  //       const data = await response.json();

  //       setListing((prevState) => ({
  //         ...prevState,
  //         fbpage: data.data || [],
  //         adacount: data.data || [],
  //       }));

  //       if (data.accounts || data.containers || data.businesses || data.websites || data.data) {

  //         // setListing( [ data.accounts || data.containers || data.businesses || data.           websites ||             data.data]);
  //         console.log('dadad',data)
  //       } else {
  //         console.error('Failed to retrieve list:', data.message);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching list:', error);
  //   }
  // };



  // const getuseraccountlisting = async (accessToken, scopes) => {
  //   try {
  //     let apiUrl = '';

  //     if (!scopes) {
  //       throw new Error('No scopes found.');
  //     }

  //     if (scopes.google && Array.isArray(scopes.google) && scopes.google.length > 0) {
  //       const userScopes = scopes.google[0];

  //       const matchedPermission = googlePermissions.find(permission =>
  //         userScopes.includes(permission.scope)
  //       );

  //       switch (matchedPermission?.name) {
  //         case 'Google Ads':
  //           apiUrl = '/api/access_googleads';
  //           break;
  //         case 'Analytics':
  //           apiUrl = '/api/access_googleanayltics';
  //           break;
  //         case 'Tag Manager':
  //           apiUrl = '/api/access_list_tagmanager';
  //           break;
  //         case 'Business Profile':
  //           apiUrl = '/api/access_businessprofile';
  //           break;
  //         case 'Google Search Console':
  //           apiUrl = '/api/access_googlesearchconsole';
  //           break;
  //         default:
  //           throw new Error('No API available for this Google scope');
  //       }
  //     }

  //     if (scopes.facebook && Array.isArray(scopes.facebook) && scopes.facebook.length > 0) {
  //       const userScopes = scopes.facebook[0];

  //       const matchedFacebookPermission = facebookPermissions.find(permission =>
  //         userScopes.includes(permission.scope)
  //       );

  //       switch (matchedFacebookPermission?.name) {
  //         case 'Ad Account':
  //           apiUrl = '/api/access_facebookadaccount';
  //           break;
  //         case 'Facebook Page':
  //           apiUrl = '/api/access_facebookpage';
  //           break;
  //         case 'Instagram Page':
  //           apiUrl = '/api/access_instagrampage';
  //           break;
  //         case 'Pixel':
  //           apiUrl = '/api/access_facebookpixel';
  //           break;
  //         case 'Catalog':
  //           apiUrl = '/api/access_facebookcatalog';
  //           break;
  //         default:
  //           throw new Error('No API available for this Facebook scope');
  //       }
  //     }

  //     if (!apiUrl) {
  //       throw new Error('No API URL matched for provided scopes');
  //     }

  //     const response = await fetch(apiUrl, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ accessToken }),
  //     });

  //     const data = await response.json();

  //     if (data.accounts || data.containers || data.businesses || data.websites || data.data) {
  //       setListing(data.accounts || data.containers || data.businesses || data.websites || data.data);

  //     } else {
  //       console.error('Failed to retrieve list:', data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching list:', error);
  //   }
  // };
  console.log('state:', Listing);

  var state = `${userDetails?.email}-${access}`;

  var currentuseremail = userDetails?.email;
  // google signin
  const handlelogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `http://localhost:3000/api/auth/google/callback`;
    const responseType = 'code';
    let scope = userScopes.google.join(' ');
    scope += ' email profile openid';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&access_type=offline&state=${state}`;

    const width = 600;
    const height = 800;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    const popup = window.open(
      googleAuthUrl,
      'GoogleAuth',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // if (popup) {
    //   popup.focus();
    // }

    window.addEventListener('message', async (event) => {
      if (event.data && event.data.success) {
        const clientData = event.data.clientData;
        console.log('121', clientData)
        try {
          const response = await fetch('/api/clientdataupdate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentuseremail,
              clientData: clientData,
              access,
            }),
          });

          const data = await response.json();

          if (data.success) {
            console.log('List retrieved:', data);

            if (popup && !popup.closed) {
              popup.close();
            }
            getuseraccountlisting(clientData.access_token, userScopes);
            setGrantinfo(clientData);
          } else {
            console.error('Failed to retrieve list:', data.message);
          }
        } catch (error) {
          console.error('Error fetching list:', error);
        }
      }
    });
  };

  // fb signin
  const handleSignIn = async () => {
    const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const redirectUri = `http://localhost:3000/api/auth/facebook/callback`;
    const responseType = 'code';
    let scope = 'email manage_fundraisers publish_video catalog_management pages_manage_cta pages_manage_instant_articles read_page_mailboxes ads_read pages_messaging pages_messaging_subscriptions instagram_manage_insights leads_retrieval whatsapp_business_management instagram_manage_messages page_events commerce_account_read_settings commerce_account_manage_orders commerce_account_read_orders pages_read_engagement pages_manage_metadata pages_read_user_content pages_manage_ads pages_manage_posts pages_manage_engagement whatsapp_business_messaging instagram_shopping_tag_products instagram_branded_content_brand instagram_branded_content_creator instagram_branded_content_ads_brand instagram_manage_events manage_app_solution commerce_account_read_reports public_profile pages_manage_posts pages_manage_engagement pages_show_list ads_management business_management catalog_management ads_management leads_retrieval read_insights instagram_basic pages_show_list pages_manage_metadata page_events instagram_manage_comments instagram_content_publish pages_read_engagement business_management ads_management';

    const facebookAuthUrl = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&state=${state}`;

    const width = 600;
    const height = 800;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    const popup = window.open(
      facebookAuthUrl,
      'FacebookAuth',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    window.addEventListener('message', async (event) => {
      if (event.data && event.data.success) {
        const clientData = event.data.clientData;
        console.log('121', clientData)
        localStorage.setItem('email',clientData?.email)
        try {
          const response = await fetch('/api/clientdataupdate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentuseremail,
              clientData: clientData,
              access,
            }),
          });

          const data = await response.json();

          if (data.success) {
            console.log('List retrieved:', data);

            if (popup && !popup.closed) {
              popup.close();
            }
            getuseraccountlisting(clientData.access_token, userScopes);
            setGrantinfo(clientData);
          } else {
            console.error('Failed to retrieve list:', data.message);
          }
        } catch (error) {
          console.error('Error fetching list:', error);
        }
      }
    });
  };

  const getApiEndpoint = async (scopes) => {
    try {
      // if (!scopes || !scopes?.google || !Array.isArray(scopes?.google) || scopes?.google.length === 0) {
      //   throw new Error('No Google scopes found.');
      // }

      const userScopes = scopes?.google[0];
      if (userScopes.includes('https://www.googleapis.com/auth/tagmanager.manage.accounts https://www.googleapis.com/auth/tagmanager.edit.containers https://www.googleapis.com/auth/tagmanager.readonly https://www.googleapis.com/auth/tagmanager.manage.users')) {
        return '/api/access_googletagmanager';
      }
      if (userScopes.includes('https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.manage.users')) {
        return '/api/grantaccess_googleanayltics';
      }
      if (userScopes.includes('https://www.googleapis.com/auth/webmasters')) {
        return '/api/grantaccess_googlesearchconsole';
      }
      return null;
    } catch (error) {
      console.error('Error in getApiEndpoint:', error.message);
      throw error;
    }
  };


  const givinggrant = async () => {
    try {

      const apiEndpoint = await getApiEndpoint(userScopes);
      if (!apiEndpoint) {
        console.error('No valid API endpoint found for the given scopes.');
        return;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: grantinfo.access_token,
          emailToGrant: grantinfo.email,
          accountId: tagmanager.accountId || tagmanager.siteUrl,
          containerId: tagmanager.containerId
        }),
      });

      const data = await response.json();

      if (data.message) {
        console.log('List retrieved:', data);
        setSuccessmsg(data.message);
        nextStep();
      } else {
        console.error('Failed to retrieve list:', data.message);
      }
    } catch (error) {
      console.error('Error fetching list:', error);
    }
  };

  // const givinggrant = async () => {
  //   try {
  //     const response = await fetch('/api/grantaccess_googleanayltics', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         accessToken: grantinfo.access_token,
  //         emailToGrant: grantinfo.email,
  //         accountId: accountid
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.message) {
  //       console.log('List retrieved:', data);
  //       setSuccessmsg(data.message)
  //       nextStep();
  //     } else {
  //       console.error('Failed to retrieve list:', data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching list:', error);
  //   }
  // }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  useEffect(() => {
    fetchUserDetails();
    fetchscopesusingslug();
  }, []);

  const steps = [
    { emoji: '🔗', label: 'Connect Google' },
    { emoji: '✅', label: 'Confirm Access' },
    { emoji: '🔧', label: 'Connected' },
  ]

  const [showDetails, setShowDetails] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const googlePermissions = [
    { name: 'Google Ads', scope: 'https://www.googleapis.com/auth/adwords' },
    { name: 'Analytics', scope: 'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.manage.users' },
    { name: 'Tag Manager', scope: 'https://www.googleapis.com/auth/tagmanager.manage.accounts https://www.googleapis.com/auth/tagmanager.edit.containers https://www.googleapis.com/auth/tagmanager.readonly https://www.googleapis.com/auth/tagmanager.manage.users' },
    { name: 'Business Profile', scope: 'https://www.googleapis.com/auth/business.manage' },
    { name: 'Google Search Console', scope: 'https://www.googleapis.com/auth/webmasters' }
  ];

  const facebookPermissions = [
    { name: 'Ad Account', scope: 'pages_manage_posts' },
    { name: 'Facebook Page', scope: 'pages_show_list' },
    { name: 'Instagram Page', scope: 'instagram_basic pages_read_engagement' },
    { name: 'Pixel', scope: 'ads_management business_management read_insights pages_manage_engagement' },
    { name: 'Catalog', scope: 'catalog_management' },
  ];

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function handledoubleclick(e, key) {
    // handlePageSelect(e.name);
    handlePageSelect(e.name, key);
    setAccountid(e.id);
    setTagmanager(e);
  }
  console.log('seemanager', tagmanager)
  const copyEmail = () => {
    navigator.clipboard.writeText(tagmanager)
  }
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden relative ">

      <div className="noise-bg"></div>
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">

          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">{userDetails?.email} is requesting Partner Access to your {userDetails?.provider} Assets</h2>
            <div className="text-sm text-gray-600 text-center">
              <p>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-500 hover:text-blue-600 focus:outline-none"
                >
                  📝 Details of the request: {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </p>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${showDetails ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="mt-2 text-sm text-gray-600">
                  <p>{userDetails?.provider} Account: {userDetails?.email}</p>
                  <p>Access Level: {capitalize(access)}</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ overflow: 'hidden' }} className="flex items-center justify-between mt-4 relative">
              <div className="absolute top-[22px] left-[6%] right-[6%] h-0.5 bg-gray-200"></div>
              <div
                className="absolute top-[22px] left-[6%] h-0.5 bg-blue-500 transition-all duration-300 ease-in-out"
                style={{ width: `${(currentStep - 1) * 44}%` }}
              ></div>
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 ${index + 1 <= currentStep
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-400 border-gray-300'
                      } z-10`}
                  >
                    {step.emoji}
                  </div>
                  <span className="mt-2 text-xs text-gray-500">{step.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto">
            <div className="p-4">

              {/* Step 1: Introduction */}
              {currentStep === 1 && (
                <div className="space-y-2">
                  <h2 className="text-2xl font-medium text-gray-900">Welcome</h2>
                  <p className="text-gray-600 text-sm pb-2">
                    We're excited to have you on board. This quick process grant us access to your marketing assets.
                  </p>

                  <div className="rounded-lg shadow-lg overflow-hidden max-w-md">
                    <img
                      src="/welcome.gif"
                      alt="Welcome GIF"
                      className="w-full h-auto"
                    />
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Let's Start
                  </button>
                </div>
              )}

              {/* Step 2: Sign In with Google */}
              {currentStep === 2 && userScopes && (
                Object.entries(userScopes).map(([provider, scopes]) => {
                  if (userDetails && userDetails.provider === provider && Array.isArray(scopes) && scopes.length > 0) {
                    const permissions = provider === 'google' ? googlePermissions : facebookPermissions;
                    return (
                      <div key={provider} className="w-full max-w-md mx-auto p-6 space-y-6">
                        <div className="flex items-center space-x-2">
                          {provider === 'google' ? (
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path><path fill="none" d="M1 1h22v22H1z"></path></svg>
                          ) : (
                            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 12.073c0-5.8-4.85-10.65-10.65-10.65S2.7 6.273 2.7 12.073c0 5.3 3.85 9.7 8.9 10.5v-7.4H8.5v-3.1h3.1V9.773c0-3.05 1.8-4.75 4.6-4.75 1.35 0 2.75.25 2.75.25v3h-1.55c-1.5 0-1.95.95-1.95 1.9v2.3h3.3l-.55 3.1h-2.75v7.4c5.05-.8 8.9-5.2 8.9-10.5z" />
                            </svg>
                          )}
                          <h1 className="text-2xl font-semibold">{capitalize(provider)} Assets</h1>
                        </div>

                        <div className="space-y-4">
                          {provider === 'google' ? (
                            <button onClick={handlelogin} className="flex items-center text-blue-600 hover:underline">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Refresh {capitalize(provider)} assets
                            </button>
                          ) : (
                            <button onClick={handleSignIn} className="flex items-center text-blue-600 hover:underline">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Refresh {capitalize(provider)} assets
                            </button>
                          )}


                          <p className="text-gray-600 text-sm">
                            Connect your {capitalize(provider)} account to provide us with the necessary permissions.
                          </p>

                          <div className="flex flex-wrap gap-1">
                            {provider === 'google' ? (
                              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path><path fill="none" d="M1 1h22v22H1z"></path></svg>
                            ) : (
                              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-5.8-4.85-10.65-10.65-10.65S2.7 6.273 2.7 12.073c0 5.3 3.85 9.7 8.9 10.5v-7.4H8.5v-3.1h3.1V9.773c0-3.05 1.8-4.75 4.6-4.75 1.35 0 2.75.25 2.75.25v3h-1.55c-1.5 0-1.95.95-1.95 1.9v2.3h3.3l-.55 3.1h-2.75v7.4c5.05-.8 8.9-5.2 8.9-10.5z" />
                              </svg>
                            )}
                            {scopes.map((scope, index) => {
                              const matchingPermission = permissions?.find(permission => permission.scope === scope);

                              return (
                                <div key={index}>
                                  <div className="text-sm text-gray-400 block">
                                    {matchingPermission ? matchingPermission.name : scope}
                                    {index < scopes.length - 1 && ', '}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-4">
                          {Object.keys(Listing).map((key) => (
                            <div key={key} className="space-y-2">
                              <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                                Choose {capitalize(key)} Accounts
                              </label>
                              <div className="relative">
                                <button
                                  id={key}
                                  onClick={() => setPageOpen({ ...pageOpen, [key]: !pageOpen[key] })}
                                  className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                >
                                  {selectedPages[key] ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {selectedPages[key]}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemovePage(key);
                                        }}
                                        className="ml-2 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:bg-blue-200 hover:text-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                      >
                                        <span className="sr-only">Remove page</span>
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                          ></path>
                                        </svg>
                                      </button>
                                    </span>
                                  ) : (
                                    <span className="block truncate">Select...</span>
                                  )}
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg
                                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${pageOpen[key] ? 'transform rotate-180' : ''
                                        }`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                </button>
                                <div
                                  className={`absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 p-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm transition-all duration-300 ease-in-out ${pageOpen[key] ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                    }`}
                                >
                                  {Listing[key].map((e, index) => {
                                    if (e.name || e.username) {
                                      return (
                                        <div
                                          key={e.id || index}
                                          className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white transition duration-150 ease-in-out rounded-md"
                                          onClick={() => handledoubleclick({ name: e.name, id: e.id, accountId: e.siteUrl? e.siteUrl: e.accountId, containerId: e.containerId }, key)}
                                        >
                                          {e.name || e.username}
                                        </div>
                                      );
                                    } else if (e.siteUrl) {
                                      return (
                                        <div
                                          key={index}
                                          style={{ color: e.permissionLevel !== 'siteOwner' ? 'red' : 'black' }}
                                          className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white transition duration-150 ease-in-out rounded-md"
                                          onClick={() => handledoubleclick({ name: e.siteUrl }, key)}
                                        >
                                          {e.permissionLevel !== 'siteOwner' ? e.siteUrl.split('sc-domain:')[1] : e.siteUrl}
                                        </div>
                                      );
                                    } else if (Array.isArray(e.container)) {
                                      return e.container.map((container) => (
                                        <div
                                          key={container.containerId}
                                          className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white transition duration-150 ease-in-out rounded-md"
                                          onClick={() =>
                                            handledoubleclick({
                                              name: container.name,
                                              accountId: container.accountId,
                                              containerId: container.containerId,
                                            }, key)
                                          }
                                        >
                                          {container.name}
                                        </div>
                                      ));
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>




                        {/* </div> */}
                        {/* </div> */}
                        {/* </div> */}
                        {
                          provider === 'facebook' ? (
                            <p className="text-sm text-gray-600">
                              Missing your Instagram Account? Make sure to connect your Instagram Account to one of your pages.{" "}
                              <a href="#" className="text-blue-600 hover:underline">Click here to learn how.</a>
                            </p>
                          ) : null
                        }


                        <button onClick={givinggrant} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out">
                          CONTINUE
                        </button>
                      </div>
                    );
                  }
                  return null;
                })
              )}




              {/* Step 3: Connect */}
              {currentStep === 3 && (
                <div className="space-y-2">
                  <h2 className="text-2xl font-medium text-gray-900">Connect</h2>


                  <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        You're almost done! <span className="text-2xl">✋</span>
                      </h2>
                      <p className="text-sm text-gray-600 mb-4">
                        To grant access to your Google Search Console asset {tagmanager.name}, follow these simple instructions:
                      </p>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-2">1. Copy your Agency's email address:</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={tagmanager.name}
                              readOnly
                              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={copyEmail}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              COPY
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium mb-2">2. Visit the following settings page:</p>
                          <a target='__blank' href={`https://search.google.com/search-console/users?resource_id=${tagmanager.name}`} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            OPEN SETTINGS PAGE
                          </a>
                        </div>
                        <div>
                          <p className="font-medium mb-2">3. Add your agency as an admin:</p>
                          <ol className="list-lower-alpha pl-5 space-y-1 text-sm">
                            <li>a. Click on Add User</li>
                            <li>b. Paste your Agency's email address</li>
                            <li>c. Assign the role</li>
                            <li>d. Click Add</li>
                          </ol>
                        </div>
                        <Image
                          src="/GoogleSearchConsoleAddUser.png"
                          alt="Settings screenshot"
                          width={300}
                          height={100}
                          className="border border-gray-200 rounded"
                        />
                        <div>
                          <p className="font-medium mb-2">Accounts to grant:</p>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>
                              <a target='__blank' href={`https://search.google.com/search-console/users?resource_id=${tagmanager.name}`} className="text-blue-600 hover:underline flex items-center gap-1">
                                {tagmanager.name}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <p className="flex items-center gap-2">
                          Done? Hit "Continue" <span className="text-xl">✋</span>
                        </p>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50">
                      <button onClick={givinggrant} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        CONTINUE
                      </button>
                    </div>
                  </div>


                  {/* <button
                    // onClick={generateOAuthLink}
                    onClick={handlelogin}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Connect
                  </button> */}
                </div>
              )}

              {/* Step 4: Thank You */}
              {currentStep === 4 && (
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">
                    {/* You're almost there! Click the button below to finalize your account setup. */}
                    {successmsg}
                  </p>

                  {/* <h2 className="text-2xl font-medium text-gray-900">Thank You!</h2> */}
                  {/* <p className="text-gray-600 text-sm">
                    Your accounts have been successfully connected. We're excited to have you on board!
                  </p> */}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-4">
            <p className='text-xs text-gray-400'>
              Our use and transfer of information received from Google to any other app adheres to the <a className="text-blue-600 hover:underline hover:cursor-pointer" href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>
          </div>
        </div>
      </div>
    </div >
  );
}
