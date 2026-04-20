export function buildArticleUrl(slug: string, uuid: string): string {
    const shortId = uuid.split("-")[0];
    return `${slug}-${shortId}.html`;
}