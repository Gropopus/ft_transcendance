export interface Irelationship {
    userId1?: number;
    userId2?: number;
    type?: relationshipType;
}

export enum relationshipType {
    REQUEST = 'request',
    FRIEND = 'friend',
    BLOCK = 'block',
}
