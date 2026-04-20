export class ArticleDomainService {
    static validateTags(tagIds: string[]) {
        if (tagIds.length > 3) {
            throw new Error("Maximum 3 tags allowed");
        }
    }
}