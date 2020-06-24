const Env = use('Env')

class AddPost extends Stimulus.Controller {
  static get targets() {
    return [
      'markdown',
      'mdpreview', // hide while editing
      'mdeditor' // hide while previewing
    ]
  }
  initialize() {
    this.markdownUpdated = true
  }

  mdupdate() {
    this.markdownUpdated = true
  }

  edit() {
    this.mdeditorTarget.classList.remove('hidden')
    this.mdpreviewTarget.classList.add('hidden')
  }

  preview() {
    if (!this.markdownUpdated) {
      this.mdeditorTarget.classList.add('hidden')
      this.mdpreviewTarget.classList.remove('hidden')
      return
    }

    console.log('The Base URL: ' + Env.get('BASE_URL', process.env('BASE_URL')) + '/posts/preview')

    return axios
      .post(
        //'http://127.0.0.1:3333/posts/preview',
        Env.get('BASE_URL', process.env('BASE_URL')) + '/posts/preview',
        {
          markdown: this.markdownTarget.value
        },
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document
              .querySelector('input[name="_csrf"]')
              .getAttribute('value')
          }
        }
      )
      .then(data => {
        this.mdpreviewTarget.innerHTML = data.data.data
        this.markdownUpdated = false
        this.mdeditorTarget.classList.add('hidden')
        this.mdpreviewTarget.classList.remove('hidden')
      })
  }
}
