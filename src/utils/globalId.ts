export const toGlobalId = (typename: string, id: string | number) => {
    return `${typename}:${id}`;
};

export const fromGlobalId = (nodeID: string) => {
    const delimiterPos = nodeID.indexOf(':');
    const id = Number(nodeID.substring(delimiterPos + 1));
    const typename = nodeID.substring(0, delimiterPos);

    return { id, typename };
};
