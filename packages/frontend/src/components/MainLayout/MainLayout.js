import React from 'react'
import { Layout, Panel } from 'react-toolbox'
import classes from './MainLayout.scss'
import MainNavigation from '../MainNavigation'
import Components from '../../routes/Components/containers/ComponentsContainer'

export const MainLayout = (props) => (
  <Layout className={classes.layout}>
    <MainNavigation className={classes.mainNavi} />
    <Panel>
      <div className={classes.mainContent}>
        <Components />
      </div>
    </Panel>
  </Layout>
)

export default MainLayout
