const runJxa = require('run-jxa')

let resultPromise = getRows()
resultPromise.then(rows => {
  console.log(rows)
})

async function getRows () {
  let rows = await runJxa(readRows)
  return rows
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
