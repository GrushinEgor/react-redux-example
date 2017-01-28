const capitalize = str => {
  return str.replace(/([A-zА-я])/, (match, group) => group.toUpperCase())
}

export default capitalize
