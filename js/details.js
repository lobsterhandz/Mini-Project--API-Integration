// Get Pokémon ID from URL Query String
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pokemonId = urlParams.get("id");

// Check if ID is provided
if (!pokemonId) {
    document.getElementById("pokemonDetails").innerHTML = `
        <div class="alert alert-warning text-center">
            No Pokémon ID provided! Please go back to the search page.
        </div>
    `;
} else {
    // Fetch and Display Pokémon Details
    fetchPokemonDetails(pokemonId);
}

async function fetchPokemonDetails(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
            throw new Error("Pokémon not found!");
        }

        const pokemon = await response.json();
        displayPokemonDetails(pokemon);
    } catch (error) {
        document.getElementById("pokemonDetails").innerHTML = `
            <div class="alert alert-danger text-center">
                Error: ${error.message}
            </div>
        `;
    }
}

function displayPokemonDetails(pokemon) {
    const pokemonDetailsDiv = document.getElementById("pokemonDetails");

    // Build Pokémon Details Card
    const detailsCard = `
        <div class="col-md-8">
            <div class="card shadow-sm">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body">
                    <h3 class="card-title text-capitalize">${pokemon.name}</h3>
                    <p class="card-text">
                        <strong>ID:</strong> ${pokemon.id} <br>
                        <strong>Type(s):</strong> ${pokemon.types.map(type => type.type.name).join(", ")} <br>
                        <strong>Abilities:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(", ")} <br>
                    </p>
                    <h5>Base Stats</h5>
                    <ul class="list-group mb-3">
                        ${pokemon.stats.map(stat => `
                            <li class="list-group-item">
                                <strong>${stat.stat.name}:</strong> ${stat.base_stat}
                            </li>
                        `).join("")}
                    </ul>
                </div>
            </div>
        </div>
    `;

    // Insert the card into the Pokémon details section
    pokemonDetailsDiv.innerHTML = detailsCard;
}
