document.addEventListener("DOMContentLoaded", async () => {
    const rssFeedContainer = document.getElementById("rssFeed");
    const rssUrl = "https://www.pocketmonsters.net/rss"; // Pokémon Database RSS feed

    try {
        // Use a proxy to fetch the RSS feed and convert it to JSON
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();

        if (data.status !== "ok") {
            throw new Error("Failed to fetch RSS feed");
        }

        rssFeedContainer.innerHTML = ""; // Clear loading text

        // Display each news item as a card
        data.items.forEach(item => {
            const newsCard = `
                <div class="col-md-4 mb-3">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">
                                <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
                            </h5>
                            <p class="card-text">${item.description.slice(0, 100)}...</p>
                        </div>
                    </div>
                </div>
            `;
            rssFeedContainer.innerHTML += newsCard;
        });
    } catch (error) {
        console.error("Failed to fetch RSS feed:", error.message);
        rssFeedContainer.innerHTML = `<div class="alert alert-danger text-center">Failed to load news: ${error.message}</div>`;
    }
});
