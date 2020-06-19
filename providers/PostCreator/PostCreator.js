'use strict'

const marked = require('marked')
const  fm = require('front-matter')
const highlightJS = require('highlightjs')

class PostCreator {
  constructor() {
    this.marked = marked
    this.marked.setOptions({
      highlight: function(code){
        return highlightJS.highlightAuto(code).value
      }
    })
  }
  create(content){
    const data = fm(content)

    const body = this.marked(data.body)

    return {
      body,
      attributes: data.attributes
    }
  }
}

module.exports = PostCreator


