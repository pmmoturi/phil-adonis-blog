const Env = use('Env')

class ListItem extends Stimulus.Controller {
  static get targets() {}
  initialize() {}

  destroyItem(evt) {
    evt.preventDefault()

    return axios
      //.delete(`http://127.0.0.1:3333/${this.path}/${this.itemId}`)
      //.delete(`http://${Env.get('BASE_URL')}/${this.path}/${this.itemId}`)
      .delete(`http://${process.env('BASE_URL')}/${this.path}/${this.itemId}`)
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
