const {ServiceProvider} = require('@adonisjs/fold')
const PostCreator = require('./PostCreator')

class PostProvider extends ServiceProvider {
  register(){
    this.app.singleton('PostCreator',() => {
      return new PostCreator()
    })
  }
}

module.exports = PostProvider
