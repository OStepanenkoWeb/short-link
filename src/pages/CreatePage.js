import React, {useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/AuthContext";

export const CreatePage = () => {
    const history = useHistory();
    const [link, setLink] = useState();
    const { request } = useHttp();
    const auth = useContext(AuthContext);

    useEffect(() => {
        window.M.updateTextFields()
    }, []);
    const pressHandler = async event => {
        if(event.key === 'Enter') {
            try{
                const data = await request(
                    '/api/link/generate',
                    'POST',
                    {from: link},
                    {Authorization: `Bearer ${auth.token}`}
                    );
                console.log(data)
                history.push(`/detail/${data.link._id}`)
            }catch (e) {
                console.log(`Ошибка генерации ссылки ${e}`)
            }
        }
    };

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
                <div className="input-field">
                    <i className="material-icons prefix">link</i>
                    <input
                        id="link"
                        type="text"
                        value={link}
                        placeholder='Вставьте ссылку'
                        onChange={e => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link" className="white-text">Введите ссылку</label>
                </div>
            </div>
        </div>
    )
};