/**
 * Traverses the model and locates all the nodes starting
 * at the leaves and progressing towards the trunk. This is the order
 * that the entity operation ODATA queries will need to be run
 * @param node - the start node of the model
 * @param sequence - the sequence - no not set
 * @returns {*[]} an array of the nodes in leaf-to-trunk order
 */
export const findRequestSequence = (node, sequence = []) => {
  const nodeName = Object.keys(node)[0]
  if (!node[nodeName].relationships) {
    sequence.push(nodeName)
    return sequence
  }

  for (const r in node[nodeName].relationships) {
    findRequestSequence({ [r]: node[nodeName].relationships[r] }, sequence)
  }

  sequence.push(nodeName)
  return sequence
}
/**
 * Generate a multi-level request path based on a model
 * @param node - The start node of the model
 * @param delim - track the expand delimiter - don't set this
 * @returns {string} - The calculated path
 */
export const buildRequestPath = (node, isFirst = true, delim = '&$expand=') => {
  // Iterate over the model
  let path = ''
  const nodeName = Object.keys(node)[0]
  if (isFirst) {
    path += `${nodeName}?`
  }
  path += `$select=${Object.keys(node[nodeName].targetFields).join(',')}`
  for (const entity in node[nodeName]?.relationships) {
    const relNode = node[nodeName].relationships[entity]
    path += `${delim}${relNode.fk.replace('@odata.bind', '')}(${buildRequestPath({ [entity]: relNode }, false, ';$expand=')})`
    delim = ','
  }
  return path
}
