const runJxa = require('run-jxa')

let resultPromise = getRows()
resultPromise.then(([directives, outline]) => {
  console.log(directives)
})

async function getRows () {
  let rows = await runJxa(readRows)
  let [directives, outline] = rows.reduce(([d, o], row) => {
    if (row.name.startsWith('#')) {
      return [addDirective(d, row), o]
    } else {
      return [d, [...o, row]]
    }
  }, [{}, []])
  return [directives, outline]
}

function readRows () {
  let oo = Application('OmniOutliner')
  let doc = oo.documents[0]
  let rows = doc.children
  let idList = rows.id()
  let nameList = rows.name()
  let hasChildrenList = rows.hasSubtopics()
  return idList.map((id, i) => {
    return {id, name: nameList[i], hasChildren: hasChildrenList[i]}
  })
}

function addDirective (obj, {name}) {
  let re = /^#(\w+)\s"(.+)"/
  let split = re.exec(name)
  let directive = split[1]
  obj[directive] = split[2]
  return obj
}
