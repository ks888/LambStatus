import React from 'react'
import { Layout, NavDrawer, Panel } from 'react-toolbox';
import classes from './MainLayout.scss'

export const MainLayout = (props) => (
  <Layout>
    <NavDrawer pinned='true' permanentAt='xxxl'>
      <p>
      The list of awesome functions
      </p>
    </NavDrawer>
    <Panel>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
        <h1>Current Status of My Service</h1>
        <p>Main content goes here.</p>
      </div>
    </Panel>
  </Layout>
)

MainLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default MainLayout
