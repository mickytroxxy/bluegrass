import axios from 'axios';
import { useState } from 'react';

const BASE_URL = 'http://192.168.18.229:3000';
const MEAL_DB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

export type FetchDataTypes = {
    endPoint: string;
    method: 'POST' | 'GET' | 'UPDATE' | 'DELETE';
    data?: any;
};

const useFetch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async ({ endPoint, method, data }: FetchDataTypes) => {
        try {
            setLoading(true);
            setError(null);
            // Check if endPoint is a full URL or just a path
            const url = endPoint.startsWith('http') ? endPoint : BASE_URL + endPoint;
            let response = await axios({method, url, data});
            return response.data;
        } catch (error) {
            console.log('Error fetching data:', error);
            setError('Failed to fetch data');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { fetchData, loading, error };
};

export default useFetch;
