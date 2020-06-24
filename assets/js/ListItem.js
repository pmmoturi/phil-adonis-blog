const Env = use('Env')

class ListItem extends Stimulus.Controller {
  static get targets() {}
  initialize() {}

  destroyItem(evt) {
    evt.preventDefault()

    const baseUrl = process.env('BASE_URL') || 'http://127.0.0.1:3333'

    console.log('The Base URL: ' + baseUrl + '/' + this.path + '/' + this.itemId)

    return axios
      //.delete(`http://127.0.0.1:3333/${this.path}/${this.itemId}`)
      .delete(`http://${baseUrl}/${this.path}/${this.itemId}`)
      .then(resp => {
        location.reload()
      })
  }

  get itemId() {
    return this.data.get('id')
  }

  get path() {
    return this.data.get('path')
  }
}
