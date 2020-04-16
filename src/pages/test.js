import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'

const Test = props => {
  // GraphQLで取得した情報はdataに格納される
  const { data } = props
  const { title: siteTitle } = data.site.siteMetadata
  const { nodes: cats } = data.allWordpressCategory
  const { nodes: tags } = data.allWordpressTag

  return (
    <Layout>
      <Helmet title={`${siteTitle}`} />
      <dl>
        <dt>カテゴリー一覧</dt>
        {cats.map((cat) => (
          <div
            className="content"
            style={{ border: '1px solid #eaecee', padding: '2em 4em' }}
            key={cat.slug}
          >
            <dd>{`記事数: ${cat.count}`}</dd>
            <dd>タグ名:<Link to={`/categories/${cat.slug}/`}>{cat.name}</Link></dd>
          </div>
        ))}
        <dt>タグ一覧</dt>
        {tags.map((tag) => (
          <div
            className="content"
            style={{ border: '1px solid #eaecee', padding: '2em 4em' }}
            key={tag.slug}
          >
            <dd>{`記事数: ${tag.count}`}</dd>
            <dd>タグ名:<Link to={`/tags/${tag.slug}/`}>{tag.name}</Link></dd>
          </div>
        ))}
        <dt>ページごとに作成したpageQueryの実行結果（TestPage）</dt>
        <dd>{JSON.stringify(data)}</dd>
      </dl>
    </Layout>
  )
}

export default Test

// ページごとにGatsbyのGraphQLで取得する情報
// queryの中身はlocalhost:8000/___graphqlで試作したものをコピーペースト
// サイトのタイトルとカテゴリー、タグを全て取得する
export const pageQuery = graphql`
  query TestPage {
    site {
      siteMetadata {
        title
      }
    }
    allWordpressCategory {
      nodes {
        count
        slug
        name
      }
    }
    allWordpressTag {
      nodes {
        count
        name
        slug
      }
    }
  }
`