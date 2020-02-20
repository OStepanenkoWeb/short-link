import {useCallback, useState} from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);

        try{
            if (body) {
                body = JSON.stringify(body);
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, {method, body, headers});
            const data = await response.json();

            if (!response.ok) {
                throw new Error( data.message ? `Ошибка сервера ${data.message}` : 'Неизвестная ошибка сервера')
            }

            return data
        }catch (e) {
            console.log(`Ошибка получения данных: ${e}`);
            setError(e.message);
            throw e
        }finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { loading, request, error,  clearError }
};