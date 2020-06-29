'use strict'

const Category = use('App/Models/Category')
const Post = use('App/Models/Post')
const PostCreator = use('PostCreator')
const User = use('App/Models/User')
const Database = use('Database')

class PostController {
  async index({ view, auth, response }) {
    response.header('Turbolinks-Location', '/posts')

    //const posts = await Post.all().then(data => data.toJSON())
    const posts = await Database.table('posts').select('*').where('user_id','=',auth.user.id)
      //.then(data => data.toJSON())

    return view.render('posts.posts', { username: auth.user.username, posts })
  }

  async homePreview({ view, auth, response }) {
    response.header('Turbolinks-Location', '/')

    //const posts = await Post.all().then(data => data.toJSON())
    const categories = await Category.all().then(data => data.toJSON())
    const posts = await Post.pickInverse(6).then(data => data.toJSON())

    return view.render('index', { posts, auth, categories })
  }




  async create({ view, auth, response }) {
    response.header('Turbolinks-Location', '/posts/add')

    const categories = await Category.all().then(data => data.toJSON())
    const markdown = '---\ntitle: \nseo_title: \npublished: false\nseo_description: \npost_slug: \nsummary: \n---\n\nThe Title is above...\n\nFront matter above, and write your post here...'.trim()

    return view.render('posts.editor', {
      categories,
      markdown
    })
  }

  async preview({ request, response }) {
    const { markdown } = request.post()

    // Placeholder: Transform Markdown to HTML
    const {body} = PostCreator.create(markdown)
    return response.status(200).json({
      data: body
    })
  }

  async store({request, auth, response}) {
    const {markdown, category_id} = request.post()

    // transform markdown to HTML
    // grab our post meta data from the front matter
    console.log('Fetching attributes from the PostCreator.create')
    let {body, attributes:{
      title, seo_title, seo_description, seo_keywords,
      post_slug,
      summary, published
    }} = PostCreator.create(markdown)
    console.log('receiving details\ntitle:' + title)

    post_slug = post_slug || title

    /*console.log('Writing to the DB\ntitle: '
      + title + '\ncategory_id: ' + category_id
      + '\nsummary: ' + summary)*/
    const user_id = auth.user.id

    const post = await Post.create({
      body, markdown, title, seo_title, seo_description,
      seo_keywords, post_slug,
      summary, published, category_id, user_id
    }).then(data => data.toJSON())
    console.log('Finished writing to the DB!!!')

    return response.redirect('/posts/' + post.slug)

  }

  async show({ params: { slug }, view, auth, response }) {
    const categories = await Category.all().then(data => data.toJSON())
    const post = await Post.findBy('slug', slug)

    // auto-increment when the views are being done by people other than the author
    if (auth && auth.user && auth.user.id) {
      if (auth.user.id != post.user_id) {
        post.views_no = post.views_no + 1
        const saved = await post.save()
      }
    } else {
      post.views_no = post.views_no + 1
      const saved = await post.save()
    }

    const user_id = post.user_id
    const user = await User.findBy('id', user_id)

    response.header('Turbolinks-Location', '/posts/' + slug)

    return view.render('posts.post', {
      post,
      categories,
      user
    })
  }

  async showAllPublic({ view, auth, response }) {
    const posts = await Post.all().then(data => data.toJSON())

    //const posts = await Database.table('posts').select('*').where('category_id','=',category.id)

    response.header('Turbolinks-Location', '/posts/all')

    return view.render('posts.all', {
      //posts,
      posts,
      auth
    })
  }


  async showFilteredPublic({ request, view, response }) {
    //const posts = await Post.all().then(data => data.toJSON())
    console.log('We got here: Step 1')
    console.log('search String: ' + request.input('searchString'))


    const posts = await Database.table('posts').select('*')
      .where('markdown','like','%'+request.input('searchString') + '%')


    response.header('Turbolinks-Location', '/posts/filtered')

    return view.render('posts.all', {
      posts
    })
  }

  async edit({view, params: { id }, auth, response}) {
    const categories = await Category.all().then(data => data.toJSON())
    const post = await Post.find(id).then(data => data.toJSON())

    response.header('Turbolinks-Location', '/posts/edit/' + id)
    const markdown = post.markdown

    // If user isn't authorised to edit this page, then redirect them to the view post page
    if (auth && auth.user && auth.user.id) {
      if (auth.user.id != post.user_id) {
        response.redirect('/posts/' + post.slug)
      }
    } else {
      response.redirect('/posts/' + post.slug)
    }

    return view.render('posts.editor', {
      post,
      markdown,
      categories
    })
  }

  async update({request, response, params: { id }}) {
    const post = await Post.find(id)

    const { markdown, category_id } = request.post()

    let {body, attributes:{
      title, seo_title, seo_description, seo_keywords,
      post_slug,
      summary, published
    }} = PostCreator.create(markdown)

    //body, markdown, title, seo_title, seo_description,
    //       seo_keywords, post_slug,
    //       summary, published, category_id

    post.body = body || post.body
    post.markdown = markdown || post.markdown
    post.title = title || post.title
    post.seo_title = seo_title || post.seo_title
    post.seo_description = seo_description || post.seo_description
    post.seo_keywords = seo_keywords || post.seo_keywords
    post.post_slug = post_slug || post.post_slug
    post.summary = summary || post.summary
    post.published = published || post.published
    post.category_id = category_id || post.category_id


    const saved = await post.save()

    if (saved) {
      return response.redirect('/posts')
    }
  }

  async destroy({ params: { id }, auth, response }) {
    const post = await Post.find(id)

    const deleted = post.delete()

    // If user isn't authorised to edit this page, then redirect them to the view post page
    if (auth && auth.user && auth.user.id) {
      if (auth.user.id != post.user_id) {
        response.redirect('/posts/')
      }
    } else {
      response.redirect('/posts/')
    }

    return response.status(200).json({ deleted })
  }
}

module.exports = PostController
