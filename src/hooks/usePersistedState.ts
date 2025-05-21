import { useEffect, useState } from "react";

const Store = new Map<string, unknown>();

export const usePersistedState = <S>(
    id: string,
    initialState: S | (() => S)
) => {
    const stateFromStore = Store.has(id) ? (Store.get(id) as S) : undefined;
    const [state, dispatch] = useState<S>(stateFromStore ?? initialState);
    useEffect(() => {
        Store.set(id, state);
    }, [state, id]);
    return [state, dispatch] as const;
};

export const removeFromState = (id: string) => {
    Store.delete(id);
};