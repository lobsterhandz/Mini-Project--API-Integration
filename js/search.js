// Fetch Pokémon Data and Render Results
document.getElementById("searchButton").addEventListener("click", async () => {
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("results");

    // Clear previous results
    resultsDiv.innerHTML = "";

    if (!searchInput) {
        resultsDiv.innerHTML = `<div class="alert alert-warning text-center">Please enter a Pokémon name or ID!</div>`;
        return;
    }

    try {
        // Fetch data from PokeAPI
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput}`);
        if (!response.ok) {
            throw new Error("Pokémon not found!");
        }

        const pokemonData = await response.json();
        displayPokemon(pokemonData);
    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert alert-danger text-center">Error: ${error.message}</div>`;
    }
});

// Function to Display Pokémon Data
function displayPokemon(pokemon) {
    const resultsDiv = document.getElementById("results");

    // Build the Pokémon card
    const pokemonCard = `
        <div class="col-md-6 col-lg-4">
            <div class="card text-center shadow-sm">
                <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                <div class="card-body">
                    <h5 class="card-title text-capitalize">${pokemon.name}</h5>
                    <p class="card-text">
                        <strong>ID:</strong> ${pokemon.id} <br>
                        <strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}
                    </p>
                    <a href="./details.html?id=${pokemon.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        </div>
    `;

    // Insert the card into the results section
    resultsDiv.innerHTML = pokemonCard;
}
