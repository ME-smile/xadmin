import React from 'react'

import _ from 'lodash'
import { PropTypes, createElement } from 'react'

import { Block, StoreWrap, app } from '../index'
import { Icon } from '../components'

const Model = (modelName, props={}) => {
  const { key, persist, initialValues } = props
  const ModelComponent = React.createClass({

    contextTypes: {
      store: React.PropTypes.object.isRequired
    },

    childContextTypes: {
      model: PropTypes.object.isRequired
    },

    componentWillMount() {
      const { store } = this.context
      this.model = this.getModel(modelName)
      store.dispatch({ type: 'INITIALIZE', model: this.model, initial: initialValues })
    },

    componentWillUnmount() {
      if(!persist) {
        const { store } = this.context
        //store.dispatch({ type: 'DESTROY', model: this.model })
      } 
    },

    getChildContext() {
      return { model: this.model }
    },

    render() {
      return this.props.children
    },

    getModel(name) {
      const model = app.load_dict('models')[name]
      model.name = model.name || name
      return model ? {
        ...model,
        key: key || model.name
      } : null
    }
  })

  return ModelComponent
}

const ModelWrap = StoreWrap({
  contextTypes: {
    model: React.PropTypes.object.isRequired
  },
  getState: (context) => {
    const { store, model } = context
    return { modelState: store.getState().model[model.key], model }
  },
  computeProps: (tag, { model }) => {
    if(model.components && model.components[tag]) {
      return { componentClass: model.components[tag] }
    }
  }
})

export default {
  ModelWrap,
  Model
}
