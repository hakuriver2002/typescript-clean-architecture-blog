import { Tag } from "../entities/Tag";

export interface CreateTagInput {
    name: string;
    slug: string;
}

export interface UpdateTagInput {
    name?: string;
    slug?: string;
}

export interface TagRepository {
    create(input: CreateTagInput): Promise<Tag>;
    findById(id: string): Promise<Tag | null>;
    findBySlug(slug: string): Promise<Tag | null>;
    findByIds(ids: string[]): Promise<Tag[]>;
    findAll(page: number, pageSize: number): Promise<{ data: Tag[]; total: number }>;
    update(id: string, input: UpdateTagInput): Promise<Tag>;
    delete(id: string): Promise<void>;
    findByName(name: string): Promise<Tag | null>;
}