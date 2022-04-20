import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { IUser } from "../models/User";
import AuthService from "../servises/AuthServise";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor () {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoadin(bool: boolean) {
        this.isLoading = bool;
    }

    async sign (email: string, password: string, login: boolean) {
        try {
            const response = login ? await AuthService.login(email, password) : await AuthService.registration(email, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log((e as any).response?.data?.message);
        }

    }

    async logout () {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            console.log((e as any).response?.data?.message);
        }

    }

    async checkAuth() {
        try {
            this.setLoadin(true);
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log((e as any).response?.data?.message);
        } finally {
            this.setLoadin(false);
        }
    }
}