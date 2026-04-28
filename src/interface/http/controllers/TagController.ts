import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";

export class TagController {
    async create(req: Request, res: Response) {
        const { name } = req.body;

        const result = await container.createTagUseCase.execute({ name });

        res.status(201).json({
            result,
            message: "Tag created successfully"
        });
    }

    async getAll(req: Request, res: Response) {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.limit) || 10;
        const search = typeof req.query.search === "string" ? req.query.search : undefined;

        const result = await container.getAllTagsUseCase.execute(page, pageSize, search);

        res.status(200).json(result);
    }

    async getById(req: Request, res: Response) {
        const id = String(req.params.id);

        const result = await container.getTagByIdUseCase.execute(id);

        res.status(200).json(result);
    }

    async getBySlug(req: Request, res: Response) {
        const slug = String(req.params.slug);

        const result = await container.getTagBySlugUseCase.execute(slug);

        res.status(200).json(result);
    }

    async getByName(req: Request, res: Response) {
        const name = String(req.params.name);

        const result = await container.getTagByNameUseCase.execute(name);

        res.status(200).json(result);
    }

    async update(req: Request, res: Response) {
        const id = String(req.params.id);
        const { name } = req.body;

        const result = await container.updateTagUseCase.execute(id, { name });

        res.status(200).json({
            result,
            message: "Tag updated successfully"
        });
    }

    async delete(req: Request, res: Response) {
        const id = String(req.params.id);

        const result = await container.deleteTagUseCase.execute(id);

        res.status(200).json({
            result,
            message: "Tag deleted successfully"
        });
    }
}

export const tagController = new TagController();
