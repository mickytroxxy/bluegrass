import { useEffect, useState } from "react";

export const defaultRegisterCms = {
    explore:'Explore app',
    welcome:`Welcome to\nPantry by Marble`,
    welcomeSub:'Sign up for easy payment, collection and much more',
    fullName:'Full Name',
    email:'Email',
    password:'Password',
    mobileNumber:'Mobile number',
    login:'Sign In',
    loginSub:'Have an account?',
    loginSubAction:'Login',
    or:'Or',
    register:'Sign Up',
    registerSub:'By sigining up you agree to our,',
    Terms:'Terms',
    DataPolicy:'Data Policy',
    CookiesPolicy:'Cookies Policy'
}

export const useCms = () => {
    const [cms,setCms] = useState(
        [
            {
                screen:'register',
                data:defaultRegisterCms
            }
        ]
    );
    const getCms = (screen:'register') => {
        if(screen === 'register'){
            interface RegisterCms {
                explore: string;
                welcome: string;
                welcomeSub: string;
                fullName: string;
                email: string;
                password: string;
                mobileNumber: string;
                login: string;
                register: string;
                loginSub: string;
                loginSubAction: string;
                or: string;
                registerSub: string;
                Terms: string;
                DataPolicy: string;
                CookiesPolicy: string;
            }
            return cms.find(item => item.screen === screen)?.data as RegisterCms;
        }
    }
    useEffect(() => {
        //fetch cms data from api
        //setCms(data);
    },[]);

    return {cms,getCms};
}
