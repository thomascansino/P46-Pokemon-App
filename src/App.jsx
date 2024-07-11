import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('');
  const [pokemonStats, setPokemonStats] = useState({
    name: ' ',
    id: '',
    weight:'',
    height:'',
    hp:'',
    attack:'',
    defense:'',
    specialAttack:'',
    specialDefense:'',
    speed:'',
    types:'',
    src:'',
    spritesArray:[],
  })
  const { name, id, weight, height, hp, attack, defense, specialAttack, specialDefense, speed, types, src, spritesArray } = pokemonStats;
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    if (id) {
      document.title = `Pokemon: ${capitalizeFirstLetterOfEachWord(name)}`
    }
    else {
      document.title = `Pokemon Search App`
    }
  }, [name, id])

  useEffect(() => {
    fetch('https://pokeapi-proxy.freecodecamp.rocks/api/pokemon')
    .then(res => res.json())
    .then(data => setData(data.results))
    .catch(err => console.error(err));
  }, []);
  
  const handleSearch = () => {
    const inputValue=input.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g,'-');
    const isValidPokemon = data.some(obj => obj.id == inputValue || obj.name === inputValue);
    if (isValidPokemon) {
      fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${input}`)
      .then(res => res.json())
      .then(data => {
      setPokemonStats({
        ...pokemonStats, 
        name: data.name,
        id: `#${data.id}`,
        weight: `Weight: ${data.weight}`,
        height: `Height: ${data.height}`,
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
        types: data.types.map(obj => obj.type.name),
        src: data.sprites.front_default,
        spritesArray: Object.values(data.sprites),
      })

      document.getElementById('left-button').style.display='block';
      document.getElementById('right-button').style.display='block';
      })
      .catch(err => console.error(err));
    }
    else {
      alert('Pokémon not found');
    }
  }

  const handleTypes = () => {
    if (!Array.isArray(types)) {
      return null;
    }
    return types.map((el,index) => {
      return (
        <div key={index }className={`${el}-type element-container`}>{el.toUpperCase()}</div>
      )
    })
  }

  const handleRightBtn = () => {
    setIndex((index + 1) % spritesArray.length);
    setPokemonStats(prevStats => ({
      ...prevStats,
      src: spritesArray[index],
    }));
  }

  const handleLeftBtn = () => {
    setIndex((index - 1 + spritesArray.length) % spritesArray.length);
    setPokemonStats(prevStats => ({
      ...prevStats,
      src: spritesArray[index],
    }));
  };

  const capitalizeFirstLetterOfEachWord = (str) => {
    return str.split('-').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  return (
    <>
      <h1>Pokémon Search App</h1>
      <div className="main-container">
        <div className="description-container">
          Search for Pokémon Name or ID:
        </div>
        <div className="input-container">
          <input id="search-input" type="text" required onChange={handleInput}/>
          <button id="search-button" onClick={handleSearch}>Search</button>
        </div>
        <div id="pokemon-card">
          <div className="name-id">
            <div id="pokemon-name">{capitalizeFirstLetterOfEachWord(name)}</div>
            <div id="pokemon-id">{id}</div>
          </div>
          <div className="weight-height">
            <div id="weight">{weight}</div>
            <div id="height">{height}</div>
          </div>
          <div className="image">
            <button className="next-button" id="left-button" onClick={handleLeftBtn} style={{display:'none'}}>←</button>
            <img id="sprite" src={src} />
            <button className="next-button" id="right-button" onClick={handleRightBtn} style={{display:'none'}}>→</button>
          </div>
          <div id="types">{handleTypes()}</div>
          <table>
            <thead>
              <tr>
                <th>Base</th>
                <th>Stats</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HP:</td>
                <td id="hp">{hp}</td>
              </tr>
              <tr>
                <td>Attack:</td>
                <td id="attack">{attack}</td>
              </tr>
              <tr>
                <td>Defense:</td>
                <td id="defense">{defense}</td>
              </tr>
              <tr>
                <td>Special-attack:</td>
                <td id="special-attack">{specialAttack}</td>
              </tr>
              <tr>
                <td>Special-defense:</td>
                <td id="special-defense">{specialDefense}</td>
              </tr>
              <tr>
                <td>Speed:</td>
                <td id="speed">{speed}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
