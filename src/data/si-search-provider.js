import {SiElement, html} from '../core/si-element.js'

import {SiHttpRequest} from '../core/si-net.js'
import {SiAsync} from '../core/si-async.js'

export class SiSearchProvider extends SiElement {
  static get is() { return "si-search-provider" }

  static get properties() {
    return {
      server: {
        type: String,
        value: "http://localhost:9200"
      },
      path: String,
      query: {
        type: String,
        value: "*"
      },
      defaultField: {
        type: String,
        value: "*"
      },
      from: {
        type: Number,
        value: 0,
      },
      size: {
        type: Number,
        value: 20,
      },
      filter: {
        type: Object,
        value() {
          return {
            match_all: { }
          }
        }
      },
      sort: {
        type: Object,
        value() {
          return { "_score": "desc" }
        }
      }
    }
  }

  ready() {
    super.ready()
    this.addEventListener('select', (e) => {
      console.log('[1] facet select', e)
      this.execute()
    })
  }

  async execute() {
    await SiAsync.debounce(this, 100)
    const body = this._generateBody()
    const http = new SiHttpRequest()

    const request = await http.post(this.url, body)

    const response = JSON.parse(request.responseText)
    this._updateAll(response)
  }

  get url() {
    return `${this.server}/${this.path}/_search`
  }

  get facets() {
    return Array.from(this.querySelectorAll('si-search-facet'))
  }

  clearFacetSelection(notify=true) {
    this.facets.forEach((f) => f.clearSelection(notify))
  }

  _updateAll(result) {
    console.log('si-search-provider::_updateAll:', result)
    const ctx = result.aggregations.$global.$query

    this.facets.forEach((facet) => {
      facet.setResult(ctx[`$${facet.name}`][facet.name])
    })

    const hits = result.hits.hits.map(_ => _._source)
    const aggs = result.aggregations
    const total = result.hits.total
    const from = this.from
    const size = hits.length

    this.dispatchEvent(new CustomEvent(
      'search-result', {
        bubbles: true,
        detail: { hits, aggs, total, from, size }
      }
    ))
  }

  _buildFacetAggs() {
    const aggs = { }
    this.facets.forEach((facet) => {
      const ctx = { }
      const filter = this.filter

      ctx.filter = {
        bool: {
          must: [ ],
          filter: Object.keys(filter).length > 0 ? filter: null
        }
      }

      this.facets.filter(_ => facet.multi ? _ != facet : true).forEach((other) => {
        ctx.filter.bool.must.push(other.getFilterClause())
      })

      ctx.aggs = { }
      ctx.aggs[facet.name] = facet.getAggsClause()
      aggs[`$${facet.name}`] = ctx
    })
    return aggs
  }

  _generateBody() {
    let {from, size, query, facets, filter, sort} = this

    if (!facets) return
    if (Object.keys(filter).length == 0) filter = null

    const inner = {
      query_string: {
        default_field: this.defaultField,
        query: query
      }
    }

    const body = {
      from: from,
      size: size,
      sort: sort,
      query: {
        bool: {
          must: [ inner ],
          filter: {
            bool: {
              must: facets.map(f => f.getFilterClause()),
              filter: filter
            }
          }
        }
      },
      aggs: {
        "$global": {
          global: {},
          aggs: {
            "$query": {
              filter: {
                bool: {
                  must: [ inner ],
                  filter: filter
                }
              },
              aggs: this._buildFacetAggs()
            }
          }
        }
      }
    }

    return body
  }

  render() {
    return html`<slot></slot>`
  }
}

SiSearchProvider.define()


class SiSearchFacet extends SiElement {
  static get is() { return "si-search-facet" }
  static get properties() {
    return {
      name: String,
      type: String,
      size: Number,
      field: String,
      order: Object,
      operator: {
        type: String,
        value: 'OR'
      },
      multi: {
        type: Boolean,
        value: false,
      },
      ranges: {
        type: Array,
        value() { return [ ] }
      },
      result: Object,
      reverse: {
        type: Boolean,
        value: false
      },
      format: {
        type: Function,
        value() { return (_ => _.key) }
      }
    }
  }

  setResult(result) {
    this.result = result
    console.log('setResult', result)
  }

  clearSelection(notify=true) {
    this.$['selector'].clearSelection(notify)
  }

  getAggsClause() {
    const aggs = { meta: { name: this.name, type: this.type } }
    switch (this.type) {
      case "terms":
        aggs.terms = {
          field: this.field,
          size: this.size
        }
        if (this.order) aggs.terms.order = this.order
        break
      case "range":
        aggs.range = {
          field: this.field,
          ranges: this.ranges
        }
        break
    }
    return aggs
  }

  getFilterClause() {
    const clauses = [ ]
    this.selection.filter((v) => v !== undefined).forEach((bucket) => {
      clauses.push(this._bucketToFilter(bucket))
    })
    if (clauses.length > 0) {
      if (this.operator == 'AND') {
        return { bool: { must: clauses } }
      } else {
        return { bool: { should: clauses } }
      }
    } else {
      return { match_all: {} }
    }
  }

  get buckets() {
    if (!this.result) return [ ]
    if (this.reverse === true) return this.result.buckets.slice().reverse()
    return this.result.buckets
  }

  get selection() {
    return this.$['selector'].selectedItems
  }

  _bucketToFilter(b) {
    const filter = { }
    switch (this.type) {
      case "terms":
        filter.term = { }
        filter.term[this.field] = b.key
        break
      case "range":
        filter.range = { }
        filter.range[this.field] = { gt: b.from, lte: b.to }
        break
    }
    return filter
  }

  render() {
    //console.log('render', this)
    return html`
      <style>
        :host {
          display: block;
        }

        .badge {
          vertical-align: middle;
          display: inline-block;
          height: 16px;
          border-radius: 20px;
          font-weight: 600;
          background: #667;
          color: white;
          font-size: 11px;
          box-sizing: border-box;
          padding: 2px 4px;
        }
      </style>

      <si-selector id="selector" items=${this.buckets} multi toggle></si-selector>

      <slot name="header"></slot>

      ${this.buckets.map((bucket, i) => html`
        <si-hbox>
          <div flex>
            <si-checkbox
              checked?=${this.$['selector'].isSelected(i)}
              on-change=${(ev) => this.$['selector'].select(i, ev.detail.checked)}>
              ${this.format(bucket)}
            </si-checkbox>
          </div>
          <div class="badge">${bucket.doc_count}</div>
        </si-hbox>
      `)}
    `
  }
}

SiSearchFacet.define()
