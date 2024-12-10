const yourTeam = [];
const opponentTeam = [];
const maxTeamSize = 6;
const battleLog = document.getElementById("battleLog");

// Utility: Delay Function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add Pokémon to Your Team
document.getElementById("searchButton").addEventListener("click", async () => {
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    const searchResultDiv = document.getElementById("searchResult");

    // Clear previous results
    searchResultDiv.innerHTML = "";

    if (!searchInput) {
        searchResultDiv.innerHTML = `<div class="alert alert-warning">Please enter a Pokémon name or ID!</div>`;
        return;
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput}`);
        const pokemon = await response.json();
        addToTeam(pokemon, yourTeam, "yourTeam");
    } catch (error) {
        searchResultDiv.innerHTML = `<div class="alert alert-danger">Pokémon not found!</div>`;
    }
});

// Add Pokémon to Team Function
function addToTeam(pokemon, team, containerId) {
    if (team.length >= maxTeamSize) {
        alert("Your team is full!");
        return;
    }

    if (team.some(p => p.id === pokemon.id)) {
        alert(`${pokemon.name} is already in your team!`);
        return;
    }

    pokemon.currentHp = pokemon.stats[0].base_stat; // Set HP
    team.push(pokemon);
    renderTeam(team, containerId);
}

// Render Team
function renderTeam(team, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    team.forEach(pokemon => {
        const card = `
            <div class="card text-center me-2 mb-2" style="width: 100px;">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="card-img-top">
                <div class="card-body">
                    <p class="card-title text-capitalize">${pokemon.name}</p>
                    <p>HP: ${pokemon.currentHp}</p>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
    toggleBattleButton();
}

// Generate Opponent's Team
document.getElementById("generateOpponent").addEventListener("click", async () => {
    opponentTeam.length = 0;
    for (let i = 0; i < maxTeamSize; i++) {
        const randomId = Math.floor(Math.random() * 898) + 1;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const pokemon = await response.json();
        pokemon.currentHp = pokemon.stats[0].base_stat; // Set HP
        opponentTeam.push(pokemon);
    }
    renderTeam(opponentTeam, "opponentTeam");
    toggleBattleButton();
});

// Enable/Disable Battle Button
function toggleBattleButton() {
    const battleButton = document.getElementById("battleButton");
    if (yourTeam.length > 0 && opponentTeam.length > 0) {
        battleButton.disabled = false;
    } else {
        battleButton.disabled = true;
    }
}

// Battle Simulation
document.getElementById("battleButton").addEventListener("click", async () => {
    battleLog.innerHTML = "<h4 class='text-center'>Battle Begins!</h4>";
    const yourTeamCopy = [...yourTeam];
    const opponentTeamCopy = [...opponentTeam];
    let round = 1;

    while (yourTeamCopy.length > 0 && opponentTeamCopy.length > 0) {
        const attacker = yourTeamCopy[0];
        const defender = opponentTeamCopy[0];

        // Your Pokémon attacks
        await addBattleLog(`Round ${round}: ${attacker.name} attacks ${defender.name}!`);
        const damage = calculateDamage(attacker, defender);
        defender.currentHp -= damage;
        await addBattleLog(`${attacker.name} dealt ${damage} damage! ${defender.name} has ${Math.max(defender.currentHp, 0)} HP left.`);

        if (defender.currentHp <= 0) {
            await addBattleLog(`${defender.name} fainted!`);
            opponentTeamCopy.shift(); // Remove fainted Pokémon
        }

        // Opponent Pokémon attacks if still alive
        if (opponentTeamCopy.length > 0) {
            const counterDamage = calculateDamage(defender, attacker);
            await addBattleLog(`${defender.name} attacks ${attacker.name}!`);
            attacker.currentHp -= counterDamage;
            await addBattleLog(`${defender.name} dealt ${counterDamage} damage! ${attacker.name} has ${Math.max(attacker.currentHp, 0)} HP left.`);

            if (attacker.currentHp <= 0) {
                await addBattleLog(`${attacker.name} fainted!`);
                yourTeamCopy.shift(); // Remove fainted Pokémon
            }
        }

        round++;
    }

    // Determine Winner
    if (yourTeamCopy.length > 0) {
        await addBattleLog("<h4 class='text-center text-success'>Your Team Wins!</h4>");
    } else {
        await addBattleLog("<h4 class='text-center text-danger'>Opponent's Team Wins!</h4>");
    }
});

async function addBattleLog(message, type = "info") {
    const logMessage = document.createElement("p");
    logMessage.innerHTML = message;
    logMessage.className = `battle-log-${type}`;
    battleLog.appendChild(logMessage);

    // Auto-scroll with smooth behavior
    battleLog.scrollTo({
        top: battleLog.scrollHeight,
        behavior: "smooth",
    });

    // Delay for the animation pace
    await delay(1000);
}

// Damage Calculation
function calculateDamage(attacker, defender) {
    const attackStat = attacker.stats[1].base_stat; // Attack
    const defenseStat = defender.stats[2].base_stat; // Defense
    return Math.max(10, Math.floor(attackStat - defenseStat / 3)); // Minimum damage of 10
}
async function addBattleLog(message, highlight = false) {
    const logMessage = document.createElement("p");
    logMessage.innerHTML = message;
    if (highlight) {
        logMessage.style.color = highlight === "win" ? "green" : "red";
        logMessage.style.fontWeight = "bold";
    }
    battleLog.appendChild(logMessage);
    battleLog.scrollTop = battleLog.scrollHeight; // Auto-scroll
    await delay(1000); // 1 second delay
}

// Update Health Bar
function updateHealthBar(pokemon, damage) {
    const healthBar = document.getElementById(`health-${pokemon.id}`);
    const hpText = document.getElementById(`hp-${pokemon.id}`);
    pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
    hpText.textContent = pokemon.currentHp;

    const healthPercentage = (pokemon.currentHp / pokemon.stats[0].base_stat) * 100;
    healthBar.style.width = `${healthPercentage}%`;

    if (healthPercentage > 50) {
        healthBar.style.backgroundColor = "#28a745"; // Green
    } else if (healthPercentage > 20) {
        healthBar.style.backgroundColor = "#ffc107"; // Yellow
    } else {
        healthBar.style.backgroundColor = "#dc3545"; // Red
    }
}

function animateCard(pokemon, action) {
    const card = document.getElementById(`pokemon-${pokemon.id}`);
    if (!card) return;

    if (action === "attacking") {
        card.classList.add("attacking");
        setTimeout(() => card.classList.remove("attacking"), 1000);
    } else if (action === "damaged") {
        card.classList.add("damaged");
        setTimeout(() => card.classList.remove("damaged"), 500);
    } else if (action === "fainted") {
        card.classList.add("fainted");
        setTimeout(() => {
            card.style.opacity = "0"; // Fade out
        }, 1000);
    }
}


document.getElementById("battleButton").addEventListener("click", async () => {
    battleLog.innerHTML = "<h4 class='text-center'>Battle Begins!</h4>";
    const yourTeamCopy = [...yourTeam];
    const opponentTeamCopy = [...opponentTeam];
    let round = 1;

    while (yourTeamCopy.length > 0 && opponentTeamCopy.length > 0) {
        const attacker = yourTeamCopy[0];
        const defender = opponentTeamCopy[0];

        // Your Pokémon attacks
        animateCard(attacker, "attacking");
        await addBattleLog(`Round ${round}: ${attacker.name} attacks ${defender.name}!`);
        const damage = calculateDamage(attacker, defender);
        updateHealthBar(defender, damage);
        animateCard(defender, "damaged");
        await addBattleLog(`${attacker.name} dealt ${damage} damage! ${defender.name} has ${Math.max(defender.currentHp, 0)} HP left.`);

        if (defender.currentHp <= 0) {
            await addBattleLog(`${defender.name} fainted!`, "faint");
            animateCard(defender, "fainted");
            opponentTeamCopy.shift(); // Remove fainted Pokémon
        }

        // Opponent Pokémon attacks if still alive
        if (opponentTeamCopy.length > 0) {
            const counterDamage = calculateDamage(defender, attacker);
            animateCard(defender, "attacking");
            await addBattleLog(`${defender.name} attacks ${attacker.name}!`);
            updateHealthBar(attacker, counterDamage);
            animateCard(attacker, "damaged");
            await addBattleLog(`${defender.name} dealt ${counterDamage} damage! ${attacker.name} has ${Math.max(attacker.currentHp, 0)} HP left.`);

            if (attacker.currentHp <= 0) {
                await addBattleLog(`${attacker.name} fainted!`, "faint");
                animateCard(attacker, "fainted");
                yourTeamCopy.shift(); // Remove fainted Pokémon
            }
        }

        round++;
    }

    // Determine Winner
    if (yourTeamCopy.length > 0) {
        await addBattleLog("<h4 class='text-center text-success'>Your Team Wins!</h4>", "win");
        highlightTeam("yourTeam");
    } else {
        await addBattleLog("<h4 class='text-center text-danger'>Opponent's Team Wins!</h4>", "lose");
        highlightTeam("opponentTeam");
    }

    // Highlight Winning Team
    function highlightTeam(teamId) {
        const team = document.getElementById(teamId);
        if (team) {
            team.style.border = "5px solid gold";
            team.style.transition = "border 0.5s ease-in-out";
        }
    }
});
