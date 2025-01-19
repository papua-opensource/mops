import type { Story } from "../types/index"

export class StoryService {
    private endpoint = 'https://raw.githubusercontent.com/papua-opensource/mops/dataset/data.json';
    private stories: Story[] = [];
    private availableIndices: number[] = [];

    constructor() {
        this.fetchStories();
    }

    async fetchStories(): Promise<void> {
        try {
            const response = await fetch(this.endpoint);
            const data = await response.json();
            this.stories = data.stories;
            this.resetAvailableIndices();
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        }
    }

    private resetAvailableIndices(): void {
        this.availableIndices = Array.from(
            { length: this.stories.length },
            (_, index) => index
        );
    }

    getAllStories(): Story[] {
        return this.stories;
    }

    getStoryBySlug(slug: string): Story | undefined {
        return this.stories.find(story => story.slug === slug);
    }

    getNextStory(): Story | undefined {
        if (this.stories.length === 0) return undefined;

        // Cek apakah ada cerita untuk hari ini
        const today = new Date().toISOString().split('T')[0];
        const todayStory = this.stories.find(story => story.created_at === today);

        if (todayStory) {
            // Jika cerita hari ini ditemukan, hapus dari daftar available
            const todayIndex = this.stories.indexOf(todayStory);
            const availableIndex = this.availableIndices.indexOf(todayIndex);
            if (availableIndex !== -1) {
                this.availableIndices.splice(availableIndex, 1);
            }
            return todayStory;
        }

        // Jika tidak ada cerita hari ini, ambil random
        if (this.availableIndices.length === 0) {
            this.resetAvailableIndices();
        }

        const randomPosition = Math.floor(Math.random() * this.availableIndices.length);
        const selectedIndex = this.availableIndices[randomPosition];
        this.availableIndices.splice(randomPosition, 1);

        return this.stories[selectedIndex];
    }

    getCurrentStorySlug(): string | undefined {
        if (this.stories.length === 0) return undefined;

        // Cek dulu apakah ada cerita hari ini
        const today = new Date().toISOString().split('T')[0];
        const todayStory = this.stories.find(story => story.created_at === today);
        if (todayStory) {
            return todayStory.slug;
        }

        // Jika tidak, ambil cerita terakhir yang digunakan dari random selection
        const lastUsedIndex = this.stories.findIndex((story, index) =>
            !this.availableIndices.includes(index)
        );
        return lastUsedIndex !== -1 ? this.stories[lastUsedIndex].slug : undefined;
    }
}