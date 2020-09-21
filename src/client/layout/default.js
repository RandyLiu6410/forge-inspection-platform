import React from 'react'
import styled from 'styled-components'
import { 
  Layout, Row, Col,
  Menu, Avatar, Button
} from 'antd'

const { Header, Content } = Layout

const InlineBlockCol = styled(Col)`
  display: inline-block;
`
const ExpandCol = styled(Col)`
  flex-grow: 2;
`

const modules = [
  {
    name: '规划'
  },
  {
    name: '建造'
  },
  {
    name: '运维'
  }
]

export default (Page) => {
  return () => {

    return (
      <Layout 
        className='layout'
        style={{
          minHeight: '100vh'
        }}
      >
        <Header >
          <Row type='flex' align='middle' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <InlineBlockCol>
              <div style={{ 
                fontSize: '24px',
                color: '#eee',
              }}>规建管一体化平台</div>
            </InlineBlockCol>
            <InlineBlockCol>
              <Menu
                theme='dark'
                mode='horizontal'
              >
                {modules.map((module, id) => (<Menu.Item key={id}>{ module.name }</Menu.Item>))}
              </Menu>
            </InlineBlockCol>
            <ExpandCol />
            <Button icon='plus' shape='round' style={{ border: 'none' }} ghost/>
            <Button icon='setting' shape='round' style={{ border: 'none' }} ghost/>
            <InlineBlockCol>
              <Avatar
                size='large'
                src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' 
              />
            </InlineBlockCol>
          </Row>
        </Header>
        <Content style={{ position: 'relative' }}>
          <Page />
        </Content>
      </Layout>
    )
  }
}