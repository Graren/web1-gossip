class Gossip {
  constructor(id_user, description, id_gossip, status = 1, karma = 0, date = new Date()) {
    this.id_user = id_user;
    this.description = description;
    this.date = date;
    this.karma = karma;
    this.status = status;
    if (id_gossip) {
      this.id_gossip = id_gossip;
    }
  }

  onUpdate(oldGossip, newGossip) {
    //Needs to be implemented by the object.
  }

  onUpvote() {
    //Needs to be implemented by the object.
  }

  onDownvote() {
    //Needs to be implemented by the object.
  }

  onDelete() {

  }

  update(properties) {
    const old = Object.assign({}, this);
    Object.assign(this, properties);
    this.onUpdate(old, this);
  }

  post() {
    return new Promise((resolve, reject) => {
      if (this.id_gossip) {
        reject({
          message: `Gossip #${this.id_gossip} is already posted.`
        });
      } else {
        const XHR = new XMLHttpRequest();
        XHR.open('post', '/gossip/create', true);

        XHR.onload = (e) => {
          //TODO: Grab data from response and set it to the object
          // const res = JSON.parse(e.target.response);
          // this.update({
          //   id_gossip: res.data.id_gossip
          // });

          //Since we'll start getting objects with id's on them this is not necessary
          resolve();
        };

        XHR.setRequestHeader('Content-type', 'application/json');
        const payload = {
          id_usuario: this.id_user,
          de_gossip: this.description
        }
        XHR.send(JSON.stringify(payload));
      }
    });
  }

  up() {
    return new Promise((resolve, reject) => {
      const XHR = new XMLHttpRequest();
      XHR.open('post', '/gossip/up', true);

      XHR.onload = (e) => {
        //TODO: Grab data from response and set it to the object
        if (e.target.status == 200) {
          this.update({
            karma: this.karma + 1
          });
          resolve(e.target.response);
        } else {
          reject({
            message: "Something went wrong"
          });
        }
    };

      XHR.setRequestHeader('Content-type', 'application/json');
      const payload = {
        id_usuario: this.id_user,
        id_gossip: this.id_gossip
      }
      XHR.send(JSON.stringify(payload));
    });
  }

  down() {
    return new Promise((resolve, reject) => {
      const XHR = new XMLHttpRequest();
      XHR.open('post', '/gossip/down', true);

      XHR.onload = (e) => {
        //TODO: Grab data from response and set it to the object
        if (e.target.status == 200) {
          this.update({
            karma: this.karma - 1
          });
          resolve(e.target.response);
        } else {
          reject({
            message: "Something went wrong"
          });
        }
      };

      XHR.setRequestHeader('Content-type', 'application/json');
      const payload = {
        id_usuario: this.id_user,
        id_gossip: this.id_gossip
      }
      XHR.send(JSON.stringify(payload));
    });
  }

  remove(){
    return new Promise((resolve, reject) => {
      const XHR = new XMLHttpRequest();
      let url = JSON.parse(window.localStorage.getItem('user')).admin ? `admin/gossip/delete?id_gossip=${this.id_gossip}&id_usuario=${this.id_user}` : `/gossip/delete?id_gossip=${this.id_gossip}&id_usuario=${this.id_user}`;
      console.log(url);
      XHR.open('get', url , true);
      XHR.onload = (e) => {
        //TODO: Grab data from response and set it to the object
        if (e.target.status == 200) {
          this.update({
            status: 0
          });
          resolve(e.target.response);
        } else {
          reject({
            message: "Something went wrong"
          });
        }
      };
      XHR.setRequestHeader('Content-type','application/x-www-form-urlencoded');
      XHR.send();
    });
  }
  render() {
    const gossip = document.createElement('div');
    gossip.className = 'gossip notification';
    gossip.setAttribute('gossip_id', this.id_gossip);
    gossip.innerHTML = '<div class="gossip-wrapper"> <div class="gossip-karma-wrapper"> <div class="vote-wrapper"> <button class="vote-btn positive-vote"> <span class="icon is-small"> <i class="fa fa-arrow-up"></i> </span> </button> </div> <div class="karma-wrapper"> <span class="gossip-karma"></span> </div> <div class="vote-wrapper"> <button class="vote-btn negative-vote"> <span class="icon is-small"> <i class="fa fa-arrow-down"></i> </span> </button> </div> </div> <div class="gossip-content"> <div class="gossip-header"> <p> <strong class="gossip-user"></strong> <span>-</span> <small class="gossip-date"></small> </p> </div> <div class="gossip-body"> <p class="gossip-description"></p> </div> </div> </div>';
    if (localStorage.user) {
      user = JSON.parse(localStorage.user);
      if (user.name == this.id_user || user.admin) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.addEventListener('mouseup', () =>{
          this.remove()
            .then(this.onDelete)
            .catch((e) => {
              console.log(e);
            });
        });
        gossip.insertBefore(deleteButton, gossip.querySelector('.gossip-wrapper'));
      }
    }
    gossip.querySelector('.gossip-user').textContent = this.id_user;
    gossip.querySelector('.gossip-description').textContent = this.description;
    gossip.querySelector('.gossip-date').textContent = this.date.toUTCString();
    gossip.querySelector('.gossip-karma').textContent = this.karma;

    gossip.querySelector('.negative-vote').addEventListener('mouseup', () => {
      //No puedo usar this porq es un nuevo contexto verdad?
      this.down()
        .then(this.onUpvote)
        .catch((e) => {
          console.log(e);
        });
    });

    gossip.querySelector('.positive-vote').addEventListener('mouseup', () => {
      //No puedo usar this porq es un nuevo contexto verdad?
      this.up()
        .then(this.onDownvote)
        .catch((e) => {
          console.log(e);
        });
    });

    return gossip;
  }
}
