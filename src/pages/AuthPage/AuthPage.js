import React, {useContext, useEffect, useState} from "react";
import classes from "./AuthPage.module.scss"
import {useHttp} from "../../hooks/http.hook";
import {useMessage} from "../../hooks/message.hook";
import {AuthContext} from "../../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const classAuthPage = `row ${classes.AuthPage}`;
    const { loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        message(error);
        clearError()
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields()
    }, []);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form});

            message(data.message)
        } catch (e) {}
    };

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form});

            auth.login(data.token, data.userId);
        } catch (e) {}
    };


    return (
        <div className={classAuthPage}>
            <div className="col s6 offset-s3">
                <h1>Сокращение ссылок</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <i className="material-icons prefix">email</i>
                                <input
                                    id="email"
                                    type="text"
                                    className="validate"
                                    value={form.email}
                                    onChange={changeHandler}
                                    name="email"
                                />
                                    <label htmlFor="email" className="white-text">Email</label>
                            </div>
                            <div className="input-field">
                                <i className="material-icons prefix">vpn_key</i>
                                <input
                                    id="password"
                                    type="password"
                                    className="validate"
                                    value={form.password}
                                    onChange={changeHandler}
                                    name="password"
                                />
                                <label htmlFor="password" className="white-text">Пароль</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            onClick={loginHandler}
                            className="btn yellow darken-4 "
                            disabled={loading}

                        >
                            Войти
                        </button>
                        <button
                            onClick={registerHandler}
                            className="btn grey lighten-1 black-text"
                            disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
};