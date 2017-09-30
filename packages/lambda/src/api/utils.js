import { Component } from 'model/components'
import ComponentsStore from 'db/components'

export const updateComponentStatus = async (componentObj) => {
  const component = new Component(componentObj)
  // TODO: validate
  const componentsStore = new ComponentsStore()
  // TODO: use update method for simpler store API
  await componentsStore.updateStatus(component.componentID, component.status)
  return component
}
