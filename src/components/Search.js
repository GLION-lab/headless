import React, { Component } from 'react'
import * as JsSearch from 'js-search'
import { Link } from 'gatsby'

class Search extends Component {
  state = {
    isLoading: true,
    searchResult: [],
    search: null,
    isError: false,
    searchQuery: ''
  }

  /**
   * React lifecycle method that will inject the data into the state
   */
  async componentDidMount() {
    this.rebuildIndex()
  }

  /**
   * rebuilds the overall index based on the options
   */
  rebuildIndex = () => {
    const posts = this.props.posts.map(
      item => Object.assign(
        item.node,
        { authorName: item.node.author.name }
      )
    )

    // 検索対象リストで一意な値を持つプロパティ
    const dataToSearch = new JsSearch.Search('id')

    // 検索ワードを変換（スペースで分割し、複数文字列で検索）
    dataToSearch.tokenizer = {
      tokenize( text ) {
        return text.split(/\s+/i)
      }
    }

    /**
     * 部分一致、完全一致、前方一致の検索条件を設定
     * 詳細はこちらを参照 https://github.com/bvaughn/js-search#configuring-the-index-strategy
     */
    // 部分一致検索
    dataToSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy()

    // 検索ワードを小文字化 + trim
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer()
    // 検索リストを一意に決めるプロパティ
    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("id")


    // 検索に使うプロパティを設定
    dataToSearch.addIndex("title")
    dataToSearch.addIndex("authorName")
    dataToSearch.addIndex("excerpt")

    // 検索対象のリスト
    dataToSearch.addDocuments(posts)
    this.setState({ search: dataToSearch, isLoading: false })
  }

  // 検索ワード変更を検知して検索を行う
  searchData = e => {
    const { search } = this.state
    const queryResult = search.search(e.target.value)
    this.setState({ searchQuery: e.target.value, searchResults: queryResult })
  }
  handleSubmit = e => {
    e.preventDefault()
  }

  render() {
    const { searchResults, searchQuery } = this.state
    const posts = this.props.posts.map(item => item.node)
    const queryResults = searchQuery === "" ? posts : searchResults

    return (
      <div>
        <div style={{ margin: "0 auto" }}>
          <form onSubmit={this.handleSubmit}>
            <div style={{ margin: "0 auto" }}>
              <label htmlFor="Search" style={{ paddingRight: "10px" }}>Enter your search here</label>
              <input
                id="Search"
                value={searchQuery}
                onChange={this.searchData}
                placeholder="Enter your search here"
                style={{ margin: "0 auto", width: "400px" }}
              ></input>
            </div>
          </form>
          <div>Number of items: {queryResults.length}
            {queryResults.map(post => (
              <div
                className="content"
                style={{ border: '1px solid #eaecee', padding: '2em 4em' }}
                key={post.id}
              >
                <p>
                  <Link className="has-text-primary" to={post.slug}>
                    {post.title}
                  </Link>
                  <span> &bull; </span>
                  <small>
                    {post.date} - posted by{' '}
                    <Link to={`/author/${post.author.slug}`}>
                      {post.author.name}
                    </Link>
                  </small>
                </p>
                <div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt.replace(/<p class="link-more.*/, ''),
                    }}
                  />
                  <Link className="button is-small" to={post.slug}>
                    Keep Reading →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default Search