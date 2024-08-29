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
            // Sort stories by id
            this.stories.sort((a, b) => a.id - b.id);
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

    // Get the next story in sequence
    getNextStory(): Story | undefined {
        if (this.stories.length === 0) return undefined;

        this.lastUsedIndex = (this.lastUsedIndex + 1) % this.stories.length;
        return this.stories[this.lastUsedIndex];
    }

    // Get the current story's slug
    getCurrentStorySlug(): string | undefined {
        if (this.lastUsedIndex === -1 || this.stories.length === 0) return undefined;
        return this.stories[this.lastUsedIndex].slug;
    }
}