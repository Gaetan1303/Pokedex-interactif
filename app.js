document.addEventListener('DOMContentLoaded', () => {
  const pokemonListElement = document.getElementById('pokemon-list');
  const searchInput = document.getElementById('search');
  const nameElement = document.getElementById('name');
  const typesElement = document.getElementById('types');
  const ImageElement = document.getElementById('image');

  let allPokemons = [];

  async function fetchPokemons() {
    try {
      const response = await fetch('https://pokebuildapi.fr/api/v1/pokemon');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des Pokémons', error);
      pokemonListElement.innerHTML = '<li>Erreur de chargement des Pokémons.</li>';
    }
  }

  function displayPokemonList(pokemons) {
    pokemonListElement.innerHTML = '';
    if (pokemons.length === 0) {
      pokemonListElement.innerHTML = '<li>Aucun Pokémon trouvé.</li>';
      return;
    }
    
    pokemons.forEach(pokemon => {
      const li = document.createElement('li');
      li.textContent = pokemon.name;
      li.addEventListener('click', () => showPokemonDetails(pokemon.id));
      pokemonListElement.appendChild(li);
    });
  }

  async function showPokemonDetails(pokemonId) {
    try {
      const response = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${pokemonId}`);
      const data = await response.json();
      
      nameElement.textContent = data.name;
      typesElement.textContent = data.apiTypes.map(type => type.name).join(', ');
      ImageElement.src = data.image;
      ImageElement.alt = `Image de ${data.name}`;

    } catch (error) {
      console.error('Erreur lors de la récupération des détails', error);
      nameElement.textContent = 'Erreur';
      typesElement.textContent = 'Détails non disponibles';
      ImageElement.src = '';
    }
  }

  function filterPokemons(pokemons, query) {
    return pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchInput.addEventListener('input', (event) => {
    const query = event.target.value;
    const filteredPokemons = filterPokemons(allPokemons, query);
    displayPokemonList(filteredPokemons);
  });

  fetchPokemons().then(pokemons => {
    if (pokemons) {
        allPokemons = pokemons;
        displayPokemonList(allPokemons);
        
        if (allPokemons.length > 0) {
            showPokemonDetails(allPokemons[0].id);
        }
    }
  });
});