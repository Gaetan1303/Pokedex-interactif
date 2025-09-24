document.addEventListener('DOMContentLoaded', () => {
  const pokemonListElement = document.getElementById('pokemon-list');
  const searchInput = document.getElementById('search');
  const nameElement = document.getElementById('name');
  const typesContainer = document.getElementById('types-container'); 
  const ImageElement = document.getElementById('image');
  const evolutionsElement = document.getElementById('evolutions'); 
  const statsElement = document.getElementById('stats');
  const resistancesElement = document.getElementById('resistances');

  let allPokemons = [];

  async function fetchPokemons() {
    try {
      const response = await fetch('https://pokebuildapi.fr/api/v1/pokemon');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('La Team Rocket a volé les Pokémons.', error);
      pokemonListElement.innerHTML = '<li>La Team Rocket a volé les Pokémons.</li>';
    }
  }
 
  function displayPokemonList(pokemons) {
    pokemonListElement.innerHTML = '';
    if (pokemons.length === 0) {
      pokemonListElement.innerHTML = '<li>La Team Rocket a volé les Pokémons.</li>';
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

      // AFFICHAGE DES TYPES (avec images)
      typesContainer.innerHTML = ''; 
      data.apiTypes.forEach(type => {
        const typeImage = document.createElement('img');
        typeImage.src = type.image;
        typeImage.alt = `Type ${type.name}`;
        typeImage.classList.add('type-icon'); 
        typesContainer.appendChild(typeImage);
      });
      
      // GESTION DES ÉVOLUTIONS
      let evolutionsText = '';
      if (data.apiEvolutions.length > 0) {
          evolutionsText = data.apiEvolutions.map(evo => evo.name).join(' → ');
      } else {
          evolutionsText = 'Aucune (forme finale ou non évolué)';
      }
      evolutionsElement.textContent = evolutionsText;

      ImageElement.src = data.image;
      ImageElement.alt = `Image de ${data.name}`;

    // Stats
    statsElement.innerHTML = `
      <strong>PV:</strong> ${data.stats.HP} | 
      <strong>Atq:</strong> ${data.stats.attack} | 
      <strong>Déf:</strong> ${data.stats.defense} | 
      <strong>Atq. Spé:</strong> ${data.stats.special_attack} |
      <strong>Déf. Spé:</strong> ${data.stats.special_defense} |
      <strong>Vit:</strong> ${data.stats.speed}
    `;

    // RÉSISTANCES 
    resistancesElement.innerHTML = '';

    // Filtrer les résistances selon le multiplicateur
    const weaknesses = data.apiResistances.filter(r => r.damage_multiplier > 1);
    const resistances = data.apiResistances.filter(r => r.damage_multiplier < 1 && r.damage_multiplier > 0);
    const immunities = data.apiResistances.filter(r => r.damage_multiplier === 0);

    let htmlContent = '';

    // Afficher les Faiblesses 
    if (weaknesses.length > 0) {
        const weakTypes = weaknesses.map(w => `${w.name} (${w.damage_multiplier}x)`).join(', ');
        htmlContent += `<strong>Faiblesses :</strong> <span style="color: red;">${weakTypes}</span>`;
    }
    
    // Ajouter un séparateur si nécessaire
    if (weaknesses.length > 0 && (resistances.length > 0 || immunities.length > 0)) {
        htmlContent += ' | ';
    }

    // Afficher les Résistances 
    if (resistances.length > 0) {
        const resistantTypes = resistances.map(r => `${r.name} (${r.damage_multiplier}x)`).join(', ');
        htmlContent += `<strong>Résistances :</strong> <span style="color: green;">${resistantTypes}</span>`;
    }

    // Ajouter un séparateur si nécessaire
    if (resistances.length > 0 && immunities.length > 0) {
        htmlContent += ' | ';
    }
    
    // Afficher les Immunités
    if (immunities.length > 0) {
        const immuneTypes = immunities.map(i => i.name).join(', ');
        htmlContent += `<strong>Immunité :</strong> <span style="color: blue;">${immuneTypes}</span>`;
    }
    
    if (htmlContent === '') {
        // Affiché si toutes les résistances sont à 1x
        htmlContent = 'Neutre (1x) contre la plupart des types.';
    }

    resistancesElement.innerHTML = htmlContent;

    } catch (error) {
      console.error('La Team Rocket a volé les Pokémons.', error);
      nameElement.textContent = 'TEAM ROCKET !!';
      typesContainer.innerHTML = 'Hmmm, le Professeur Chen est occupé';
      evolutionsElement.textContent = 'Essaye de trouver des pierres d\'évolutions';
      statsElement.innerHTML = 'Stats non disponibles';
      resistancesElement.innerHTML = 'Résistances non disponibles';
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