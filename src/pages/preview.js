import React from 'react'
import Layout from '../components/Layout'

const Preview = () => {

  const query = location.search.slice(1)
  let queries = {}
  query.split('&').forEach(item => {
    const i = item.split('=')
    queries[i[0]] = i[1]
  })

  const url = `http://localhost:8080/wp-json/wp/v2/posts/${queries.id}?_wpnonce=${queries._wpnonce}&preview=true`;
  fetch(url, {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json())
  .then(response => console.log(response))
  .catch(error => console.error('Error:', error))

  return (
    <Layout>
      <h1>プレビューテスト</h1>
    </Layout>
  )
}

export default Preview
