document.addEventListener("DOMContentLoaded", async () => {
    const typesContainer = document.getElementById("typesContainer");
    const loadingIndicator = document.getElementById("loading");

    try {
        // Fetch all Pokémon types
        const response = await fetch("https://pokeapi.co/api/v2/type/");
        const data = await response.json();
        const types = data.results;

        // Clear the loading message
        loadingIndicator.style.display = "none";

        // Display each type as a button
        types.forEach(type => {
            const typeCard = `
                <div class="col-md-4 mb-3">
                    <button class="btn btn-primary w-100 type-btn" data-url="${type.url}">
                        ${capitalizeFirstLetter(type.name)}
                    </button>
                </div>
            `;
            typesContainer.innerHTML += typeCard;
        });

        // Add event listeners to fetch Pokémon for each type
        document.querySelectorAll(".type-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const url = button.getAttribute("data-url");
                await fetchPokemonByType(url);
            });
        });
    } catch (error) {
        typesContainer.innerHTML = `<div class="alert alert-danger text-center">Failed to load Pokémon types: ${error.message}</div>`;
    }
});

// Fetch Pokémon for a specific type
async function fetchPokemonByType(url) {
    const typesContainer = document.getElementById("typesContainer");
    try {
        // Fetch data for the selected type
        const response = await fetch(url);
        const data = await response.json();
        const pokemons = data.pokemon;

        // Clear the container
        typesContainer.innerHTML = `<h2 class="text-center mb-4">${capitalizeFirstLetter(data.name)} Pokémon</h2>`;

        // Display each Pokémon as a clickable card
        pokemons.forEach(p => {
            const pokemonCard = `
                <div class="col-md-3 mb-3">
                    <div class="card shadow-sm text-center">
                        <a href="details.html?id=${p.pokemon.name}" class="text-decoration-none">
                            <div class="card-body">
                                <h5 class="card-title text-capitalize">${p.pokemon.name}</h5>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            typesContainer.innerHTML += pokemonCard;
        });
    } catch (error) {
        typesContainer.innerHTML = `<div class="alert alert-danger text-center">Failed to load Pokémon: ${error.message}</div>`;
    }
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
