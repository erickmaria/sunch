type FetchConfig = {
    method?: string
    url: string,
    headers?: Record<string, string>
}
export async function fetchData(config: FetchConfig): Promise<any> {
    return (async () => {
        try {
            const response = await fetch(config.url, {
                method: config.method,
                headers: config.headers
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error.message);

            return data;
        } catch (error) {
            throw new Error((error as any).message);
        }
    })();
}
