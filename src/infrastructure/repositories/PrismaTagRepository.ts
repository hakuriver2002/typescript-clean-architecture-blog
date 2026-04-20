import { prisma } from "../db/prisma";
import { Tag } from "@prisma/client";
import {
    TagRepository,
    CreateTagInput,
    UpdateTagInput,
} from "../../domain/repositories/TagRepository";

export class PrismaTagRepository implements TagRepository {
    private toDomain(tag: Tag) {
        return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt,
        };
    }

    async create(input: CreateTagInput) {
        const tag = await prisma.tag.create({
            data: {
                name: input.name,
                slug: input.slug,
            },
        });

        return this.toDomain(tag);
    }

    async findById(id: string) {
        const tag = await prisma.tag.findUnique({
            where: { id },
        });

        return tag ? this.toDomain(tag) : null;
    }

    async findBySlug(slug: string) {
        const tag = await prisma.tag.findUnique({
            where: { slug },
        });

        return tag ? this.toDomain(tag) : null;
    }

    async findByIds(ids: string[]) {
        const tags = await prisma.tag.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        return tags.map((tag) => this.toDomain(tag));
    }

    async findAll(page: number, pageSize: number) {
        const skip = (page - 1) * pageSize;

        const [data, total] = await Promise.all([
            prisma.tag.findMany({
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
            }),
            prisma.tag.count(),
        ]);

        return {
            data: data.map((tag) => this.toDomain(tag)),
            total,
        };
    }

    async update(id: string, input: UpdateTagInput) {
        const tag = await prisma.tag.update({
            where: { id },
            data: {
                name: input.name,
                slug: input.slug,
            },
        });

        return this.toDomain(tag);
    }

    async delete(id: string) {
        await prisma.tag.delete({
            where: { id },
        });
    }

    async findByName(name: string) {
        const tag = await prisma.tag.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });

        return tag ? this.toDomain(tag) : null;
    }
}