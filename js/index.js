document.addEventListener("DOMContentLoaded", async () => {
    const pokemonGrid = document.getElementById("pokemonGrid");

    try {
        // Fetch 20 random Pokémon
        for (let i = 0; i < 20; i++) {
            const randomId = Math.floor(Math.random() * 898) + 1; // Pokémon IDs range from 1 to 898
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const pokemon = await response.json();
            renderPokemonCard(pokemon, pokemonGrid);
        }
    } catch (error) {
        pokemonGrid.innerHTML = `<div class="alert alert-danger text-center">Failed to load Pokémon: ${error.message}</div>`;
    }
});

function renderPokemonCard(pokemon, container) {
    const types = pokemon.types.map(type => `<span class="card-type type-${type.type.name}">${type.type.name}</span>`).join(" ");
    const pokemonCard = `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card shadow-sm">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="card-img-top">
                <div class="card-body text-center">
                    <h5 class="card-title text-capitalize">${pokemon.name}</h5>
                    <div>${types}</div>
                    <a href="details.html?id=${pokemon.id}" class="btn btn-primary mt-3">View Details</a>
                </div>
            </div>
        </div>
    `;
    container.innerHTML += pokemonCard;
}
