document.addEventListener("DOMContentLoaded", () => {
    const totalItems = 1302;
    const itemsPerPage = 20;
    let currentPage = 1;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let currentUrl = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${itemsPerPage}`;
    let nextUrl = null;
    let prevUrl = null;

    document.getElementById("total-pages").textContent = totalPages;

    fetchPokeAPI(currentUrl);

    document.getElementById("next").addEventListener("click", () => {
        if (nextUrl) {
            currentPage++;
            fetchPokeAPI(nextUrl);
        }
    });

    document.getElementById("prev").addEventListener("click", () => {
        if (prevUrl) {
            currentPage--;
            fetchPokeAPI(prevUrl);
        }
    });

    document.getElementById("first").addEventListener("click", () => {
        currentPage = 1;
        fetchPokeAPI(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${itemsPerPage}`);
    });

    document.getElementById("last").addEventListener("click", () => {
        currentPage = totalPages;
        const lastPageOffset = (totalPages - 1) * itemsPerPage;
        fetchPokeAPI(`https://pokeapi.co/api/v2/pokemon?offset=${lastPageOffset}&limit=${itemsPerPage}`);
    });

    document.getElementById("toggle-theme").addEventListener("click", () => {
        const themeStylesheet = document.getElementById("theme-stylesheet");
        if (themeStylesheet.getAttribute("href") === "css/light-theme.css") {
            themeStylesheet.setAttribute("href", "css/dark-theme.css");
        } else {
            themeStylesheet.setAttribute("href", "css/light-theme.css");
        }
    });

    async function fetchPokeAPI(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();

            nextUrl = data.next;
            prevUrl = data.previous;
            //Se agrega el número de la página actual 
            document.getElementById("current-page").textContent = currentPage;

            displayPokemon(data.results);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    }

    async function displayPokemon(pokemons) {
        const pokemonList = document.getElementById("pokemon-list");
        pokemonList.innerHTML = "";

        pokemons.forEach((pokemon) => {
            const pokemonItem = document.createElement("div");
            pokemonItem.textContent = pokemon.name;
            pokemonItem.addEventListener("click", () => showDetail(pokemon.url));
            pokemonList.appendChild(pokemonItem);
        });
    }

    async function showDetail(url) {
        try {
            const response = await fetch(url);
            const pokemon = await response.json();

            const pokemonImg = document.getElementById("pokemon-img");
            //Ruta de las imagenes de la api
            pokemonImg.src = pokemon.sprites.other['dream_world'].front_default || pokemon.sprites.front_default;
            pokemonImg.alt = pokemon.name;

            const detailContent = document.getElementById("detail-content");
            detailContent.innerHTML = `
                <div>
                    <h2>${pokemon.name}</h2>
                    <p>Peso: ${pokemon.weight}</p>
                    <p>Altura: ${pokemon.height}</p>

                    ${pokemon.abilities.map(abilityInfo => `<p>Habilidad: ${abilityInfo.ability.name}</p>`).join('')}
                    
                    ${pokemon.types.map(typeInfo => `<p>Tipo: ${typeInfo.type.name}</p>`).join('')}
                    
                    
                    
                </div>
            `;
        } catch (error) {
            console.error("Error al obtener detalles del Pokémon:", error);
        }
    }
});
