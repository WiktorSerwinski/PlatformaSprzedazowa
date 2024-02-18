import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Router";
import { PaginatedPage } from "../models/pagination";
import { reduxStore } from "../redux/configureReduxStore";

const sleep = ()=> new Promise(resolve=>setTimeout(resolve,500));

axios.defaults.baseURL= import.meta.env.VITE_API_URL;
axios.defaults.withCredentials=true

const responseBody=(response: AxiosResponse)=>response.data;

axios.interceptors.request.use(config => {
    const token = reduxStore.getState().account.user?.token;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config
})

axios.interceptors.response.use(async response=>{
    if(import.meta.env.DEV)await sleep();
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
            router.navigate('/blad-serwera',{state:{error:data}})
            break;
        case 404:
            router.navigate('/not-found',{state:{error:data}})
            break;
        case 403:
            toast.error("Potrzebne uprawnienia administratora")
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
const formRequests={
    postForm: (url: string, data: FormData) => axios.post(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody),
    putForm: (url: string, data: FormData) => axios.put(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody)
}
function createFormData(item: any) {
    const formData = new FormData();
    for (const key in item) {
        formData.append(key, item[key])
    }
    return formData;
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get("products",params),
    all: () => requests.get("products/allproducts"),
    details: (id: number) => requests.get(`products/${id}`),
    filters: () => requests.get('products/filters'),
    rate: (id: number, rate: number) => requests.post(`products/rateProduct?id=${id}&rate=${rate}`,{})
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
const Admin = {
    createProduct: (product: any) => formRequests.postForm('products/createProduct', createFormData(product)),
    updateProduct: (product: any,id: number) => formRequests.putForm(`products/editProduct?id=${id}`, createFormData(product)),
    deleteProduct: (id: number) => requests.delete(`products/deleteProduct?id=${id}`),
    createPrepCode: (amount:number,codeValue: string) => requests.post(`prepaidCode/generatePrepaidCode?amount=${amount}&codeValue=${codeValue}`,{}),
    changeorderStatus: (id: number) => requests.put(`orders/${id}/status`,{})
}


const apiService={
    Catalog,
    TestErrors,
    Basket,
    Account,
    Orders,
    Recharge,
    Admin
}


export default apiService;

