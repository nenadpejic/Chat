export class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = db.collection("chats");
    this.unsub;
  }
  set room(str) {
    this._room = str;
  }
  get room() {
    return this._room;
  }
  set username(str) {
    if (str.length < 2 || str.length > 10) {
      alert("Invalid username! Must be between 2 and 10 characters.")
    } else if (str.trim() === "") {
      alert("Invalid username! Must have valid characters.")
    } else {
      this._username = str;
    }
  }
  get username() {
    return this._username;
  }

  updateUsername(str) {
    this.username = str;
    if (str.length >= 2 && str.length <= 10 && str.trim() !== "") {
      localStorage.setItem("username", str);
      window.location.reload();
    }
  }

  updateRoom(str) {
    this.room = str;
    localStorage.setItem("room", str);
    if (this.unsub) {
      this.unsub();
    }
  }

  async addChat(message) {
    let obj = {
      message: message,
      username: this.username,
      room: this.room,
      created_at: firebase.firestore.Timestamp.fromDate(new Date())
    }

    let response = await this.chats
      .add(obj)
    return response;
  }

  getChats(callback) {
    this.unsub = this.chats
      .where("room", "==", this.room)
      .orderBy("created_at")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            callback(change.doc); // Dokument koji je dodat kolekciji
          }
          // Brisanje sa ekrana
          else if (change.type === "removed") {
            let id = change.doc.id;
            let li = document.querySelector(`li[data-id='${id}']`);
            li.remove();
          }
        });
      });
  }

  getMessagesInsideDates(callback, start, end) {
    this.unsub = this.chats
      .where("room", "==", this.room)
      .where("created_at", ">=", start)
      .where("created_at", "<=", end)
      .orderBy("created_at")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            callback(change.doc);
          }
          // Brisanje sa ekrana
          else if (change.type === "removed") {
            let id = change.doc.id;
            let li = document.querySelector(`li[data-id='${id}']`);
            li.remove();
          }
        });
      });
  }
}
