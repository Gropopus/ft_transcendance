export interface Irelationship {
    id?: number,
    user?: number,
    target?: number;
    type?: relationshipType;
}

export enum relationshipType {
    REQUEST = 'request',
    FRIEND = 'friend',
    BLOCK = 'block',
}   
