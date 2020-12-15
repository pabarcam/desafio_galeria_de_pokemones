const axios = require('axios')
const http = require('http')
const fs = require('fs')

const server = http.createServer((req,res) =>{
  const url = req.url
  switch(url){
    case('/'):
    case('/pokemones'):
      res.writeHead(200,{'Content-Type': 'text/html'})
      fs.readFile('index.html', 'utf-8', (err, file)=>{
        if(err) throw err
        res.write(file)
        res.end()
      })
    break
    case('/galeria'):
      res.writeHead(200,{'Content-Type': 'application/json'})
      getPokemons().then((pokemons) => {
        const pokeInfo = pokemons.map(pokemon => getPokemon(pokemon.name))
        Promise.all(pokeInfo).then(results =>{
          const pokemonesFiltrados = results.map(poke => ({nombre: poke.name, img: poke.sprites.front_default }))
          res.write(JSON.stringify(pokemonesFiltrados))
          res.end()
        }).catch(error => console.log(error))
      })
    break
    default:
      res.writeHead(404, {'Content-Type': 'text/html'})
      fs.readFile('404.html','utf-8',(err, file)=>{
        if(err) throw err
        res.write(file)
        res.end()
      })
    break
  }
})

server.listen(3000, () => console.log('Servidor habilitado en puerto 3000'))

async function getPokemons(){
  const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150')
  return data.results
}

async function getPokemon(name){
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
  return data
}