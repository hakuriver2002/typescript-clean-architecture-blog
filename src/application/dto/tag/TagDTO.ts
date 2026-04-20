export interface CreateTagDTO {
    name: string;
}

export interface UpdateTagDTO {
    name?: string;
}

export interface TagResponseDTO {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}