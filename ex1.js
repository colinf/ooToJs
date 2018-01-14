const runJxa = require('run-jxa')

let resultPromise = getArtist()
resultPromise.then(artistObj => {
  console.log(artistObj)
})

async function getArtist () {
  let artistObj = await runJxa(readArtist)
  // transform results as required
  return artistObj
}

function readArtist () {
  let iTunes = Application('iTunes')
  let artist = iTunes.currentTrack.artist()
  // format required data from jxa objects
  return { artist }
}
