import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'

const Preview = props => {

  const { data } = props
  const { nodes: cats } = data.allWordpressCategory
  const { nodes: tags } = data.allWordpressTag

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
  .then(response => {
    let cat_list = []
    let tag_list = []
    response.categories.forEach(id => {
      cat_list.push(cats.find(cat => cat.wordpress_id === id).name)
    })
    response.tags.forEach(id => {
      tag_list.push(tags.find(tag => tag.wordpress_id === id).name)
    })
    console.log(cats)
    console.log(tags)
    console.log(response)
    const dom = document.getElementById('preview-content')
    dom.innerHTML = `
    <section className="section">
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              ${response.title.rendered}
            </h1>
            <div>${response.content.rendered}</div>
            <div style={{ marginTop: "4rem" }}>
              <p>日時: ${response.date}</p>
              <p>カテゴリー: ${cat_list.join('/')}</p>
              <p>タグ: ${tag_list.join('/')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
  })
  .catch(error => {
    const dom = document.getElementById('preview-content')
    dom.textContent = error
  })

  return (
    <Layout>
      <div id="preview-content">取得中...</div>
    </Layout>
  )
}

export default Preview

export const pageQuery = graphql`
  query PreviewPage {
    allWordpressCategory {
      nodes {
        name
        wordpress_id
      }
    }
    allWordpressTag {
      nodes {
        name
        wordpress_id
      }
    }
  }
`