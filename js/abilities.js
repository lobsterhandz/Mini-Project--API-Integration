document.addEventListener("DOMContentLoaded", async () => {
    const abilitiesContainer = document.getElementById("abilitiesContainer");
    const loadingIndicator = document.getElementById("loading");

    try {
        // Fetch all abilities
        const response = await fetch("https://pokeapi.co/api/v2/ability/");
        const data = await response.json();
        const abilities = data.results;

        // Clear the loading message
        loadingIndicator.style.display = "none";

        // Display each ability as a button
        abilities.forEach(ability => {
            const abilityCard = `
                <div class="col-md-4 mb-3">
                    <button class="btn btn-outline-primary w-100 ability-btn" data-url="${ability.url}">
                        ${capitalizeFirstLetter(ability.name)}
                    </button>
                </div>
            `;
            abilitiesContainer.innerHTML += abilityCard;
        });

        // Add event listeners to fetch ability details
        document.querySelectorAll(".ability-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const url = button.getAttribute("data-url");
                await showAbilityDetails(url);
            });
        });
    } catch (error) {
        abilitiesContainer.innerHTML = `<div class="alert alert-danger text-center">Failed to load abilities: ${error.message}</div>`;
    }
});

// Fetch and display ability details
async function showAbilityDetails(url) {
    try {
        const response = await fetch(url);
        const ability = await response.json();

        // Find the English description
        const englishDescription = ability.effect_entries.find(entry => entry.language.name === "en");

        // Show ability details in a modal
        const modalHtml = `
            <div class="modal fade" id="abilityModal" tabindex="-1" aria-labelledby="abilityModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="abilityModalLabel">${capitalizeFirstLetter(ability.name)}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>${englishDescription ? englishDescription.effect : "No description available in English."}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML("beforeend", modalHtml);
        const modal = new bootstrap.Modal(document.getElementById("abilityModal"));
        modal.show();

        // Remove modal from DOM after hiding
        document.getElementById("abilityModal").addEventListener("hidden.bs.modal", () => {
            document.getElementById("abilityModal").remove();
        });
    } catch (error) {
        alert(`Failed to load ability details: ${error.message}`);
    }
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
