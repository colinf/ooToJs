const runJxa = require('run-jxa')

let resultPromise = getOutline()
resultPromise.then(resultObj => {
  console.dir(resultObj, {depth: null})
})

async function getOutline () {
  let rows = await getChildren()
  let [directives, outline] = rows.reduce(([d, o], row) => {
    if (row.name.startsWith('#')) {
      return [addDirective(d, row), o]
    } else {
      return [d, [...o, row]]
    }
  }, [{}, []])
  return { directives, outline }
}

async function getChildren (id = 0) {
  let childRows = await runJxa(readChildren, [id])
  let result = await Promise.all(childRows.map(async child => {
    let {hasChildren, ...resultChild} = child
    if (!child.hasChildren) return resultChild
    return {...resultChild, children: await getChildren(child.id)}
  }))
  return result
}

function readChildren (id) {
  let isRootItem = (id === 0)
  let oo = Application('OmniOutliner')
  let doc = oo.documents[0]
  let row = isRootItem ? doc : doc.rows.whose({id: id})[0]
  let childRows = row.children
  let idList = childRows.id()
  let nameList = childRows.name()
  let hasChildrenList = childRows.hasSubtopics()
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
