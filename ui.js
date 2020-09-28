export class ChatUI {
  constructor(l) {
    this.list = l;
  }
  set list(l) {
    this._list = l;
  }
  get list() {
    return this._list;
  }

  formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let currentDate = new Date();

    // dodavanje 0 ispred jednocifrene vrednosti
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    if (year === currentDate.getFullYear() && month === currentDate.getMonth() + 1 && day === currentDate.getDate()) {
      return `${hours}:${minutes}`;
    } else {
      day = String(day).padStart(2, "0");
      month = String(month).padStart(2, "0");
      return `${day}.${month}.${year}. - ${hours}:${minutes}`;
    }
  }

  // data koji prosleđujem je objekat tj. dokument iz baze
  printLI(doc) {
    let data = doc.data();
    let date = this.formatDate(data.created_at.toDate());
    let id = doc.id;

    let htmlLI;
    if (data.username === localStorage.getItem("username")) {
      htmlLI =
        `<li class="current" data-id="${id}">
        <span class="username">${data.username}</span>
        <span class="date">${date}</span>
        <div class="message">${data.message}</div>
        <img class="imgDelete" src="./img/delete.svg" alt="delete">
        </li>`
    } else {
      htmlLI =
        `<li data-id="${id}">
        <span class="username">${data.username}</span>
        <span class="date">${date}</span>
        <div class="message">${data.message}</div>
        <img class="imgDelete" src="./img/delete.svg" alt="delete">
        </li>`
    }
    this.list.innerHTML += htmlLI;
  }

  clearChat() {
    this.list.innerHTML = "";
  }
}