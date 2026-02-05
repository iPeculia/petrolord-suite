import { mockFAQs, mockArticles, mockVideos, mockGlossary } from '@/data/help/mockHelpData';

export class HelpGuideService {
    static async getOverview() {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            faqs: mockFAQs.slice(0, 3),
            recentArticles: mockArticles.slice(0, 3),
            featuredVideos: mockVideos.slice(0, 2)
        };
    }

    static async search(query) {
        const q = query.toLowerCase();
        return {
            faqs: mockFAQs.filter(f => f.question.toLowerCase().includes(q)),
            articles: mockArticles.filter(a => a.title.toLowerCase().includes(q)),
            videos: mockVideos.filter(v => v.title.toLowerCase().includes(q))
        };
    }

    static getFAQs() { return Promise.resolve(mockFAQs); }
    static getArticles() { return Promise.resolve(mockArticles); }
    static getVideos() { return Promise.resolve(mockVideos); }
    static getGlossary() { return Promise.resolve(mockGlossary); }
}