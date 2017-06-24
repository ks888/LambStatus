import React from 'react'
import ReactTooltip from 'react-tooltip'
import Tooltip from 'components/common/Tooltip'
import { mount } from 'enzyme'

describe('Tooltip', () => {
  it('should render the tooltip', () => {
    const tooltip = mount(<Tooltip />)
    assert(tooltip.find(ReactTooltip).exists())
  })
})
