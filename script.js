document.addEventListener("DOMContentLoaded", function() {
    const storiesContainer = document.getElementById("stories-container");

    // Ambil data cerita dari URL yang disediakan
    fetch("https://raw.githubusercontent.com/antheiz/mops/master/data.json")
        .then(response => response.json())
        .then(data => {
            // Tampilkan cerita dalam HTML
            data.stories.forEach(story => {
                const storyElement = document.createElement("div");
                storyElement.classList.add("story");

                const titleElement = document.createElement("h2");
                titleElement.textContent = story.title;
                storyElement.appendChild(titleElement);

                const descriptionElement = document.createElement("p");
                descriptionElement.textContent = story.description;
                storyElement.appendChild(descriptionElement);

                const scenesElement = document.createElement("ul");
                story.scenes.forEach(scene => {
                    const sceneElement = document.createElement("li");
                    if (scene.type === "description") {
                        sceneElement.textContent = scene.content;
                    } else if (scene.type === "dialogue") {
                        sceneElement.textContent = `${scene.speaker}: ${scene.message}`;
                    }
                    scenesElement.appendChild(sceneElement);
                });
                storyElement.appendChild(scenesElement);

                storiesContainer.appendChild(storyElement);
            });
        })
        .catch(error => {
            console.error("Error fetching stories:", error);
        });
});
