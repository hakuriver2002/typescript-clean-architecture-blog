import { Request, Response } from "express";
import { container } from "../../../infrastructure/container";

export class TagController {
    private json(res: Response, statusCode: number, payload: unknown) {
        return res.status(statusCode).json(payload);
    }

    private jsonAction(res: Response, statusCode: number, result: unknown, message: string) {
        return this.json(res, statusCode, { result, message });
    }

    async create(req: Request, res: Response) {
        const { name } = req.body;
        const result = await container.createTagUseCase.execute({ name });
        return this.jsonAction(res, 201, result, "Tag created successfully");
    }

    async getAll(req: Request, res: Response) {
        const page = Number(req.query.page) || 1;
        const pageSize = Number(req.query.limit) || 10;
        const search = typeof req.query.search === "string" ? req.query.search : undefined;

        const result = await container.getAllTagsUseCase.execute(page, pageSize, search);

        return this.json(res, 200, result);
    }

    async getById(req: Request, res: Response) {
        const id = String(req.params.id);

        const result = await container.getTagByIdUseCase.execute(id);

        return this.json(res, 200, result);
    }

    async getBySlug(req: Request, res: Response) {
        const slug = String(req.params.slug);

        const result = await container.getTagBySlugUseCase.execute(slug);

        return this.json(res, 200, result);
    }

    async getByName(req: Request, res: Response) {
        const name = String(req.params.name);

        const result = await container.getTagByNameUseCase.execute(name);

        return this.json(res, 200, result);
    }

    async update(req: Request, res: Response) {
        const id = String(req.params.id);
        const { name } = req.body;

        const result = await container.updateTagUseCase.execute(id, { name });
        return this.jsonAction(res, 200, result, "Tag updated successfully");
    }

    async delete(req: Request, res: Response) {
        const id = String(req.params.id);

        await container.deleteTagUseCase.execute(id);
        return this.json(res, 200, {
            message: "Tag deleted successfully",
        });
    }
}

export const tagController = new TagController();
