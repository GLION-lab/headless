import React from 'react'
import Layout from '../components/Layout'
import Search from '../components/Search'

const search = props => {
  const { pageContext } = props
  const { postData } = pageContext
  const { allPosts, options } = postData

  return (
    <Layout>
      <h1 style={{ marginTop: `3em`, textAlign: `center` }}>
        Search data using JS Search using Gatsby Api
      </h1>
      <div>
        <Search posts={allPosts}/>
      </div>
    </Layout>
  )
}

export default search