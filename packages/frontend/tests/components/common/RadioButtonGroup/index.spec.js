import React from 'react'
import RadioButtonGroup from 'components/common/RadioButtonGroup'
import { shallow } from 'enzyme'

describe('RadioButtonGroup', () => {
  const generateProps = () => {
    return {
      title: 'title',
      candidates: ['a', 'b', 'c'],
      checkedCandidate: 'b',
      onClicked: () => {},
      className: 'group-class'
    }
  }

  it('should render the radio button group', () => {
    const props = generateProps()
    const radioButtonGroup = shallow(<RadioButtonGroup {...props} />)

    assert(radioButtonGroup.find('label').text() === props.title)
    const item = radioButtonGroup.find(`[id="${props.title}"]`)
    assert(item.exists())
    assert(item.children().length === props.candidates.length)

    const firstCand = item.children().first()
    assert(firstCand.prop('label') === props.candidates[0])
    assert(firstCand.prop('checked') === false)

    const secondCand = item.children().at(1)
    assert(secondCand.prop('checked') === true)
  })
})
