import type { Story } from "../types/index"

export class StoryService {
    private endpoint = 'https://raw.githubusercontent.com/papua-opensource/mops/dataset/data.json';
    private stories: Story[] = [];
    private lastUsedIndex: number = -1;

    constructor() {
        this.fetchStories();
    }

    // Fetch all stories from the endpoint
    async fetchStories(): Promise<void> {
        try {
            const response = await fetch(this.endpoint);
            const data = await response.json();
            this.stories = data.stories;
            // Sort stories by created_at date
            this.stories.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        }
    }

    // Get all stories
    getAllStories(): Story[] {
        return this.stories;
    }

    // Get a specific story by slug
    getStoryBySlug(slug: string): Story | undefined {
        return this.stories.find(story => story.slug === slug);
    }

    // Get the next story in sequence based on the current date
    getNextStory(): Story | undefined {
        if (this.stories.length === 0) return undefined;

        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Cari cerita yang cocok dengan tanggal hari ini
        const nextStory = this.stories.find(story => story.created_at === today);

        if (nextStory) {
            // Simpan index cerita yang ditemukan
            this.lastUsedIndex = this.stories.indexOf(nextStory);
            return nextStory;
        }

        // Jika tidak ada cerita untuk hari ini, putar ulang dari awal
        this.lastUsedIndex = (this.lastUsedIndex + 1) % this.stories.length;
        return this.stories[this.lastUsedIndex];
    }

    // Get the current story's slug
    getCurrentStorySlug(): string | undefined {
        if (this.lastUsedIndex === -1 || this.stories.length === 0) return undefined;
        return this.stories[this.lastUsedIndex].slug;
    }
}
