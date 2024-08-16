import type { Story } from "../types/index"


export class StoryService {
    private endpoint = 'https://raw.githubusercontent.com/papua-opensource/mops/master/data.json';
    private stories: Story[] = [];

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

    // Schedule a random story each night at midnight
    scheduleRandomStoryAtMidnight(callback: (slug: string | undefined) => void): void {
        const now = new Date();
        const midnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0,
            0,
            0,
            0
        );

        const timeUntilMidnight = midnight.getTime() - now.getTime();

        setTimeout(() => {
            const randomSlug = this.getRandomSlug();
            callback(randomSlug);

            // Schedule the next midnight callback
            this.scheduleRandomStoryAtMidnight(callback);
        }, timeUntilMidnight);
    }
}

// Example usage
// export const storyService = new StoryService();

// Wait until stories are fetched, then use the functions
// setTimeout(() => {
//     console.log('All stories:', storyService.getAllStories());

//     const specificStory = storyService.getStoryBySlug('pelajaran-matematika');
//     console.log('Specific story by slug:', specificStory);

//     const randomSlug = storyService.getRandomSlug();
//     console.log('Random slug:', randomSlug);

//     // Schedule a random story selection at midnight
//     storyService.scheduleRandomStoryAtMidnight((slug) => {
//         console.log('Random story slug selected at midnight:', slug);
//     });
// }, 2000); // Allow 2 seconds for stories to be fetched



// import type { ApiResponse, Story } from "../types/index";

// // Fungsi untuk mendapatkan semua data
// export async function getAllStories(): Promise<Story[]> {
//     try {
//         const response = await fetch('https://raw.githubusercontent.com/papua-opensource/mops/master/data.json');
//         const data: ApiResponse = await response.json();
//         return data.stories;
//     } catch (error) {
//         console.error('Error fetching all stories:', error);
//         return [];
//     }
// }

// // Fungsi untuk mendapatkan data spesifik berdasarkan judul
// export async function getStoryByTitle(title: string): Promise<Story | undefined> {
//     try {
//         const response = await fetch('https://raw.githubusercontent.com/papua-opensource/mops/master/data.json');
//         const data: ApiResponse = await response.json();
//         return data.stories.find(story => story.title === title);
//     } catch (error) {
//         console.error('Error fetching story by title:', error);
//         return undefined;
//     }
// }

// // Contoh penggunaan
// async function main() {
//     // Mendapatkan semua cerita
//     const allStories = await getAllStories();
//     console.log('All stories:', allStories);

//     // Mendapatkan cerita spesifik berdasarkan judul
//     const specificStory = await getStoryByTitle('Pelajaran Matematika');
//     console.log('Specific story:', specificStory);
// }

// main();