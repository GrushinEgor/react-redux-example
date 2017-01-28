import * as entityManager from '../actions/entityManager'
import { isDefAndNotNull } from 'helpers/def'
import { MODELS_OBJECTS } from '../constants'

class EntityList {
  constructor(modelType) {
    this.dispatch = () => {}
    this.modelType = modelType
    this.defaultObject = MODELS_OBJECTS[modelType].defaults

    this.pages = {}
    this.singles = {}
    this.errors = {}
    this.array = []
    this.idMap = {}
  }

  setDispatch(dispatch) {
    this.dispatch = dispatch
  }

  calculateArray() {
    this.array = Object.keys(this.pages).reduce((memo, page) => {
      return memo.concat(Object.values(this.pages[page]).filter(item => item))
    }, Object.values(this.singles).filter(item => item))
  }

  calculateIdMap() {
    this.idMap = Object.keys(this.pages).reduce((memo, page) => ({
      ...memo,
      ...this.pages[page],
    }), this.singles)
  }

  calculateEntities() {
    this.calculateArray()
    this.calculateIdMap()
  }

  setSource(pages, singles, errors) {
    this.pages = pages
    this.singles = singles
    this.errors = errors
    this.calculateEntities()
  }

  getArray() {
    return this.array
  }

  getIdMap() {
    return this.idMap
  }

  getById(id) {
    if (!isDefAndNotNull(id)) return undefined
    const idMap = this.getIdMap()
    if (idMap[id]) return idMap[id]
    if (this.errors[id]) {
      return {
        ...this.defaultObject,
        $error: true,
      }
    }
    this.dispatch(entityManager[this.modelType].loadById(id))
    return {
      ...this.defaultObject,
      $loading: true,
    }
  }
}

export default EntityList
