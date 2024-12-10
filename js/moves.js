document.addEventListener("DOMContentLoaded", async () => {
    const movesContainer = document.getElementById("movesContainer");
    const loadingIndicator = document.getElementById("loading");

    try {
        // Fetch Pokémon moves from PokeAPI
        const response = await fetch("https://pokeapi.co/api/v2/move/");
        if (!response.ok) {
            throw new Error("Failed to fetch Pokémon moves!");
        }

        const data = await response.json();
        const moves = data.results;

        // Hide loading indicator
        loadingIndicator.style.display = "none";

        // Render Pokémon moves
        moves.forEach(move => {
            const moveCard = `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title text-capitalize">${move.name}</h5>
                            <button class="btn btn-primary" onclick="viewMoveDetails('${move.url}')">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            `;
            movesContainer.innerHTML += moveCard;
        });
    } catch (error) {
        // Show error message
        loadingIndicator.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
    }
});

// Fetch and Display Move Details
async function viewMoveDetails(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch move details!");
        }

        const move = await response.json();
        alert(`
            Name: ${move.name}
            Type: ${move.type.name}
            Power: ${move.power || "N/A"}
            Accuracy: ${move.accuracy || "N/A"}
            Effect: ${move.effect_entries[0]?.effect || "No description available."}
        `);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}
