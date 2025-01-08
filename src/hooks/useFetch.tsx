import axiosReq from "@/utils/axios";
import { useEffect, useState } from "react";

const useFetch = (url: string, dependencies?: any) => {
    const [error, setError] = useState<string | boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<null | any>(null);
    const [update, setUpdate] = useState<number>(1);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const dataRes = await axiosReq.get(url);
                setData(dataRes.data);
                setLoading(false);
            } catch (error: any) {
                setLoading(false);
                setError(error.message);
            }
        };
        fetchData();
    }, [url, update, dependencies]);

    const refresh = () => {
        setUpdate((prev) => prev + 1);
    };

    return { data, loading, error, refresh };
};

export default useFetch;
