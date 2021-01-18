import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic, CancelTokenSource } from 'axios';
/**
 * Custom HTTP request client
 */
export default class API {
    static instance: API = null;
    static getInstance = () => {
    if (API.instance == null) {
        API.instance = new API();
    }
    return API.instance;
}
    cancelToken: CancelTokenSource;
    http: AxiosInstance;
    constructor() {
        this.cancelToken = axios.CancelToken.source();

        this.http = axios.create({
            baseURL: 'http://localhost:3000',
            cancelToken: this.cancelToken.token,
        });

 }
    logError(error: any) {
        console.warn(error);
    }
    /**
     * Get Roles from Sever
     * @param success
     * called when http request resolves without errors
     * @param error
     * called when an error occurs during the http call
     */
    public getRoleList(params = {}, success: (res: AxiosResponse) => void, error: (reason: any) => void = this.logError) {
     this.http.get('searchRoles',{params}).then(success, error);
    }
}
