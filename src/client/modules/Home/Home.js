import React from 'react'
import './Home.css'
// import styled from 'styled-components'
import withDefaultLayout from '../../layout/default'
import { Viewer } from 'resium'

const Home = () => (
  <div className="App">
    <Viewer full>

    </Viewer>
  </div>
);

export default withDefaultLayout(Home);
