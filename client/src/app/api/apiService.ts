import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Router";
import { PaginatedPage } from "../models/pagination";
import { reduxStore } from "../redux/configureStore";

const sleep = ()=> new Promise(resolve=>setTimeout(resolve,500));

axios.defaults.baseURL='http://localhost:5000/api/'
axios.defaults.withCredentials=true

const responseBody=(response: AxiosResponse)=>response.data;

axios.interceptors.request.use(config => {
    const token = reduxStore.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config
})

axios.interceptors.response.use(async response=>{
    await sleep();
    const pagination = response.headers['pagination'];
    if(pagination){
        response.data = new PaginatedPage(response.data,JSON.parse(pagination));
        return response;
    }
    return response
},(error: AxiosError)=>{
    const {data,status}= error.response as AxiosResponse;
    switch(status){
        case 400:
            if(data.errors){
                const modelStateErrors: string[]=[];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error('nieprawidłowe zapytanie');
            break;
        case 401:
            toast.error('Błąd Autoryzacji');
            break;
        case 500:
            router.navigate('/server-error',{state:{error:data}})
            break;
        case 404:
            router.navigate('/not-found',{state:{error:data}})
            break;
        default:
            break;
        }

    return Promise.reject(error.response);
})


const requests={
    get: (url: string,params?: URLSearchParams)=> axios.get(url,{params}).then(responseBody),
    post: (url: string, body:object)=> axios.post(url,body).then(responseBody),
    put: (url: string, body: object)=> axios.put(url,body).then(responseBody),
    delete: (url: string)=> axios.delete(url).then(responseBody),

}

const Catalog = {
    list: (params: URLSearchParams) => requests.get("products",params),
    details: (id: number) => requests.get(`products/${id}`),
    filters: () => requests.get('products/filters'),
    rate: (id: number, rate: number) => requests.post(`products?id=${id}&rate=${rate}`,{})
}

const TestErrors= {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorised'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')
}

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number,quantity =1)=> requests.post(`basket?product_id=${productId}&quantity=${quantity}`,{}),
    deleteItem: (productId: number,quantity =1)=> requests.delete(`basket?product_id=${productId}&quantity=${quantity}`),
}

const Account = {
    login: (values: any) => requests.post('account/login',values),
    register: (values: any) => requests.post('account/register',values),
    currentUser: () => requests.get('account/currentUser'),
    fetchAddress: () => requests.get('account/savedAddress')
}

const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (params: any) => requests.post('orders',params)
}

const Recharge = {
    use: (codeWritten: string) => requests.post(`prepaidCode/usePrepCode?codeWritten=${codeWritten}`,{})
}


const apiService={
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Recharge
}


export default apiService;

