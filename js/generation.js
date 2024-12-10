document.addEventListener("DOMContentLoaded", async () => {
    const generationsContainer = document.getElementById("generationsContainer");
    const loadingIndicator = document.getElementById("loading");

    try {
        // Fetch all Pokémon generations
        const response = await fetch("https://pokeapi.co/api/v2/generation/");
        const data = await response.json();
        const generations = data.results;

        // Clear the loading message
        loadingIndicator.style.display = "none";

        // Display each generation as a button
        generations.forEach((generation, index) => {
            const generationCard = `
                <div class="col-md-4 mb-3">
                    <button class="btn btn-primary w-100 generation-btn" data-url="${generation.url}">
                        Generation ${index + 1}
                    </button>
                </div>
            `;
            generationsContainer.innerHTML += generationCard;
        });

        // Add event listeners to fetch Pokémon by generation
        document.querySelectorAll(".generation-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const url = button.getAttribute("data-url");
                await fetchPokemonByGeneration(url);
            });
        });
    } catch (error) {
        generationsContainer.innerHTML = `<div class="alert alert-danger text-center">Failed to load generations: ${error.message}</div>`;
    }
});

// Fetch Pokémon for a specific generation
async function fetchPokemonByGeneration(url) {
    const generationsContainer = document.getElementById("generationsContainer");
    try {
        // Fetch data for the selected generation
        const response = await fetch(url);
        const generation = await response.json();
        const pokemons = generation.pokemon_species;

        // Clear the container
        generationsContainer.innerHTML = `<h2 class="text-center mb-4">Generation ${generation.name} Pokémon</h2>`;

        // Display each Pokémon as a clickable card
        pokemons.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
        pokemons.forEach(p => {
            const pokemonCard = `
                <div class="col-md-3 mb-3">
                    <div class="card shadow-sm text-center">
                        <a href="details.html?id=${p.name}" class="text-decoration-none">
                            <div class="card-body">
                                <h5 class="card-title text-capitalize">${p.name}</h5>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            generationsContainer.innerHTML += pokemonCard;
        });
    } catch (error) {
        generationsContainer.innerHTML = `<div class="alert alert-danger text-center">Failed to load Pokémon: ${error.message}</div>`;
    }
}
