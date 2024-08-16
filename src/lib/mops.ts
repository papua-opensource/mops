import type { Story } from "../types/index"


export class StoryService {
    private endpoint = 'https://raw.githubusercontent.com/papua-opensource/mops/dataset/data.json';
    private stories: Story[] = [];
    private dailyStory: Story | null = null;
    private lastUpdated: Date | null = null;

    constructor() {
        this.fetchStories();
    }

    // Fetch all stories from the endpoint
    async fetchStories(): Promise<void> {
        try {
            const response = await fetch(this.endpoint);
            const data = await response.json();
            this.stories = data.stories;
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

    // Get a random slug (used for the random story each night)
    getRandomSlug(): string | undefined {
        if (this.stories.length === 0) return undefined;

        const randomIndex = Math.floor(Math.random() * this.stories.length);
        return this.stories[randomIndex].slug;
    }
}