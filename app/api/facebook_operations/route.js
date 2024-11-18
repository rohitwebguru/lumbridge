import { NextResponse } from 'next/server';
import axios from 'axios';
import clientPromise from '../../lib/mongodb';

// const role_business_user = (function () {
//     const days = {
//         FINANCE_EDITOR: "FINANCE_EDITOR",
//         FINANCE_ANALYST: "FINANCE_ANALYST",
//         ADS_RIGHTS_REVIEWER: "ADS_RIGHTS_REVIEWER",
//         ADMIN: "ADMIN",
//         EMPLOYEE: "EMPLOYEE",
//         DEVELOPER: "DEVELOPER",
//         PARTNER_CENTER_ADMIN: "PARTNER_CENTER_ADMIN",
//         PARTNER_CENTER_ANALYST: "PARTNER_CENTER_ANALYST",
//         PARTNER_CENTER_OPERATIONS: "PARTNER_CENTER_OPERATIONS",
//         PARTNER_CENTER_MARKETING: "PARTNER_CENTER_MARKETING",
//         PARTNER_CENTER_EDUCATION: "PARTNER_CENTER_EDUCATION",
//         MANAGE:"MANAGE",
//         DEFAULT:"DEFAULT",
//         FINANCE_EDIT: "FINANCE_EDIT",
//         FINANCE_VIEW: "FINANCE_VIEW"
//     };
//     return {
//         get: function (name) {
//             return days[name];
//         }
//     };
// })();

export async function POST(request) {
    const client = await clientPromise;
    const db = client.db("lumbridge_db");
    const { data } = await request.json();
    var url = "https://graph.facebook.com/"

    // if (!accessToken) {
    //     return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
    // }

    try {
        // if(data?.operation == 'create_partner_user'){
                let urlGetBusinessPartner = url + 'v21.0/me/businesses'
                var user = await db.collection("users").findOne({email:data?.email});
            // if(!!user && user?.access_token != null && !!user?.links){
                const businessPartner = await axios.get(urlGetBusinessPartner,{params:{access_token:user?.access_token}})
                var partnerBusiness = businessPartner.data.data[2];
                console.log(partnerBusiness)

                // return await axios.post(urlGetBusinessPartner,{params:{access_token:data.client_access_token}}).then((res) => {
                //     console.log(res.data);
                //     return NextResponse.json({message:res.data}, { status: 200 });
                // }).catch((err) => {
                //     console.log(err);
                //     return NextResponse.json({error:err}, { status: 500 });
                // });

                let urlAddPartnerUser = url +  data?.client_business_id + "/business_users"

                // console.log(app_id.data)
                return await axios.post(urlAddPartnerUser,{},{
                    params:{
                        email: data.email,
                        role:"ADMIN",
                        access_token:data?.client_access_token
                    }
                })
                .then(async(res) => {
                    console.log(res)

                    // var sysUser = await axios.get(url + partnerBusiness?.id + '/system_users',{params:{
                    //     access_token:user?.access_token
                    // }})

                    // var sysUser = await axios.get(url + '122106792092605494' + '/access_token',{params:{
                    //     access_token:user?.access_token
                    // }})

                    // console.log(sysUser.data)


                    // return await axios.post(url + partnerBusiness?.id + '/system_users',{},{params:{
                    //     name:"Rohit-Admin",
                    //     role:"ADMIN",
                    //     access_token:user?.access_token
                    // }}).then(async(res) => {
                    //     console.log(res)
                    //     return NextResponse.json({data:res.data},{status:200})
                    //     // await axios.post(url + partnerBusiness?.id + '/access_token',{},{
                    //     //     params:{
                    //     //         app_id:app_id.data.data[0].app.id,
                    //     //         scope: 'email,manage_fundraisers,publish_video,catalog_management,pages_manage_cta, pages_manage_instant_articles,read_page_mailboxes,ads_read,pages_messaging,pages_messaging_subscriptions, instagram_manage_insights,leads_retrieval,whatsapp_business_management,instagram_manage_messages,page_events commerce_account_read_settings,commerce_account_manage_orders,commerce_account_read_orders,pages_read_engagement, pages_manage_metadata,pages_read_user_content,pages_manage_ads,pages_manage_posts,pages_manage_engagement, whatsapp_business_messaging,instagram_shopping_tag_products,instagram_branded_content_brand, instagram_branded_content_creator,instagram_branded_content_ads_brand,instagram_manage_events,manage_app_solution, commerce_account_read_reports,public_profile,pages_manage_posts,pages_manage_engagement,pages_show_list, ads_management,business_management,catalog_management,ads_management,leads_retrieval,read_insights,instagram_basic, pages_show_list,pages_manage_metadata,page_events,instagram_manage_comments,instagram_content_publish, pages_read_engagement,business_management,ads_management',
                    //     //         business_user_id:
                    //     //     }
                    //     // })
                    // }).catch((err) => {
                    //     console.log(err)
                    //     return NextResponse.json({data:err},{status:500})
                    // })
                    // return await axios.post(url + 'v21.0/' + data.client_business_id + '/access_token',{},{
                    //     params:{
                    //         scope:"ads_management,pages_read_engagement,business_management",
                    //         app_id:process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
                    //         // app_id:"549633227604581",
                    //         access_token:data?.system_user_partner_access_token
                    //     }
                    // }).then((res) => {
                    //     console.log(res.data)
                    //     return NextResponse.json({message:res.data},{status:200})
                    // }).catch((err) => {
                    //     console.log(err.error_user_msg)
                    //     return NextResponse.json({error:err.message},{status:500})
                    // })
                    console.log(res)
                    return NextResponse.json({message: res.data}, {status:200});
                }).catch((err) => {
                    console.log(err.response)
                    return NextResponse.json({error:err.message},{status:500})
                })

                // await axios.post('/' + data.client_business_id + '/access_token',{})
            // }
        // }


        // let urlGetBusinessPartner = url + 'v21.0/me/permissions'
        // var user = await db.collection("users").findOne({email:data?.email});
        // const businessPartner = await axios.get(urlGetBusinessPartner,{params:{access_token:data?.client_access_token}});

        // return NextResponse.json({data:businessPartner.data}, { status: 200 });
    } catch (error) {
        console.error('Error fetching ad accounts:', error.response ? error.response.data : error.message);
        return NextResponse.json({error:error}, { status: 500 });
    }
}
