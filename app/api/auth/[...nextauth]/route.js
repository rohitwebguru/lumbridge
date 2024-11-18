// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from '../../../lib/mongodb';
import {fetchScopesUsingSlug} from '../../../context/Globaldata'

// let cachedScopes = [];
// let loginscopes = [
//     "openid",
//     "email",
//     "profile",
// ]; 
// let scopes =[];
// const fetchScopes = async () => {
//     if (from == 'access') {
//         try {
//             const fetchedScopes = await fetchScopesUsingSlug(from);
//             if (fetchedScopes && fetchedScopes.google) {
//                 cachedScopes = fetchedScopes.google || [];
//             }
//         } catch (error) {
//             console.error("Error fetching additional scopes:", error);
//         }
//     }else{
//         loginscopes = ['openid','email','profile','https://www.googleapis.com/auth/adwords','https://www.googleapis.com/auth/analytics','https://www.googleapis.com/auth/tagmanager.manage.accounts','https://www.googleapis.com/auth/business.manage','https://www.googleapis.com/auth/webmasters']
//     }

//     scopes = [...loginscopes, ...cachedScopes];

// };

// await fetchScopes();
export const authOptions = {
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    // cookies: {
    //     sessionToken: {
    //         name: `__Secure-next-auth.session-token`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: 'lax',
    //             path: '/',
    //         },
    //     },
    // },
    
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
            authorization: {
                url: "https://accounts.google.com/o/oauth2/v2/auth",
                params: {
                    redirect_uri: "http://localhost:3000/api/auth/callback/google",
                    scope : [
                        'email',
                        'profile',
                        'openid',
                        'https://www.googleapis.com/auth/adwords',
                        'https://www.googleapis.com/auth/analytics',
                        'https://www.googleapis.com/auth/tagmanager.manage.accounts',
                        'https://www.googleapis.com/auth/business.manage',
                        'https://www.googleapis.com/auth/webmasters'
                      ].join(' '),
                    response_type: "code",
                },
            },
        }),
        FacebookProvider({
            clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
            clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
            authorization: {
                params: {
                    // redirect_uri: "https://7bc8-45-248-162-227.ngrok-free.app/api/auth/callback/facebook",
                    scope: "email public_profile pages_manage_posts pages_manage_engagement pages_show_list ads_management business_management catalog_management ads_management leads_retrieval read_insights instagram_basic pages_show_list pages_manage_metadata page_events instagram_manage_comments instagram_content_publish"
                },
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
            },
            async authorize(credentials) {
                const client = await clientPromise;
                const db = client.db("lumbridge_db");

                const user = await db.collection("users").findOne({ email: credentials.email });
                if (user) {
                    return { id: user._id, email: user.email };
                } else {
                    throw new Error("User not found");
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const client = await clientPromise;
            const db = client.db("lumbridge_db");
            // const scope ={
            //     "openid": true,
            //     "email": true,
            //     "profile": true,
            //     "https://www.googleapis.com/auth/adwords": true,
            //     "https://www.googleapis.com/auth/webmasters": true,
            //     "https://www.googleapis.com/auth/business.manage": true,
            //     "https://www.googleapis.com/auth/analytics": true,
            //     "https://www.googleapis.com/auth/tagmanager.manage.accounts": true,
            //     "https://www.googleapis.com/auth/content": true
            // };

            const scope = {
                facebook: {
                    "email": true,
                    "public_profile": true,
                    "pages_manage_posts": true,
                    "pages_manage_engagement": true,
                    "pages_show_list": true,
                    "ads_management": true,
                    "business_management": true,
                    "catalog_management": true,
                    "leads_retrieval": true,
                    "read_insights": true,
                    "instagram_basic": true,
                    "instagram_manage_insights": true
                },
                google: {
                    "openid": true,
                    "email": true,
                    "profile": true,
                    "https://www.googleapis.com/auth/adwords": true,
                    "https://www.googleapis.com/auth/webmasters": true,
                    "https://www.googleapis.com/auth/business.manage": true,
                    "https://www.googleapis.com/auth/analytics": true,
                    "https://www.googleapis.com/auth/tagmanager.manage.accounts": true,
                    "https://www.googleapis.com/auth/content": true
                }
            };

            const email = user.email || profile.email;
            const name = user.name || profile.name;
            const { provider, access_token, expires_at } = account;
            
            // const scope = provider === 'facebook' ? facebookScopes : provider === 'google' ? googleScopes : null;
            console.log('session emial', email ,name);
            let plan = null;

            const existingUser = await db.collection("users").findOne({ email });

            if (!existingUser) {

                plan = 'free'
                let plan_expiry = 'lifetime'
                let credits = 1;
                const now = new Date();
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const formattedDateTime = now.toLocaleString('en-US', { timeZone: userTimeZone });

                await db.collection("users").insertOne({
                    email,
                    name,
                    provider,
                    access_token,
                    plan,
                    plan_expiry,
                    plan_activated_on: formattedDateTime,
                    credits,
                    scope,
                    token_expires_at: expires_at
                });
            } else {
                await db.collection("users").updateOne(
                    { email },
                    {
                        $set: {
                            name,
                            provider,
                            access_token,
                            plan,
                            expires_at
                        },
                    }
                );
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            const scope = {
                facebook: {
                    "email": true,
                    "public_profile": true,
                    "pages_manage_posts": true,
                    "pages_manage_engagement": true,
                    "pages_show_list": true,
                    "ads_management": true,
                    "business_management": true,
                    "catalog_management": true,
                    "leads_retrieval": true,
                    "read_insights": true,
                    "instagram_basic": true,
                    "instagram_manage_insights": true
                },
                google: {
                    "openid": true,
                    "email": true,
                    "profile": true,
                    "https://www.googleapis.com/auth/adwords": true,
                    "https://www.googleapis.com/auth/webmasters": true,
                    "https://www.googleapis.com/auth/business.manage": true,
                    "https://www.googleapis.com/auth/analytics": true,
                    "https://www.googleapis.com/auth/tagmanager.manage.accounts": true,
                    "https://www.googleapis.com/auth/content": true
                }
            };
            session.accessToken = token.accessToken;
            session.scope = scope;
           
            return session;
        },
    },
    debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
