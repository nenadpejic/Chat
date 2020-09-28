import { Chatroom } from "./chat.js";
// .room, .username, .chats, .unsub
// .ipdateUsername(), .updateRoom(), .addChat(message), .getChats(callback)
import { ChatUI } from "./ui.js";
// .list

// DOM
let ulChatList = document.querySelector("#ul");
let inputMessage = document.querySelector("#message");
let btnSend = document.querySelector("#send");
let inputUsername = document.querySelector("#username");
let btnUpdate = document.querySelector("#update");
let nav = document.querySelector("nav");
let sectionChat = document.querySelector("#chat");
let inputColor = document.querySelector("#color");
let btnUpdateColor = document.querySelector("#updateColor");
let inputDatetimeLocalStart = document.querySelector("#datetimeLocalStart");
let inputDatetimeLocalEnd = document.querySelector("#datetimeLocalEnd");
let btnSetDates = document.querySelector("#setDates");

// global functions
function getUsername() {
  if (!localStorage.getItem("username")) {
    let username = `guest${Math.floor(Math.random() * (9999 - 1000)) + 1000}`;
    localStorage.setItem("username", username);
  }
  return localStorage.getItem("username");
}

function getRoom() {
  if (!localStorage.getItem("room")) {
    localStorage.setItem("room", "# general");
  }
  return localStorage.getItem("room");
}

// On refresh
// Set target class on refresh
document.querySelector(`input[value='${getRoom()}']`).classList.add("target");
// Kreiranje objekta chatroom
let chatroom = new Chatroom(getRoom(), getUsername());
// Kreiranje objekta chatUI
let chatUI = new ChatUI(ulChatList);
chatroom.getChats(data => {
  chatUI.printLI(data);
});

function printNotification() {
  let notification = document.querySelector("#notification");
  let p = document.createElement("p");
  p.textContent = `Welcome ${getUsername()}`;
  notification.appendChild(p);
  notification.classList.add("transitionIn");
}
printNotification();
setTimeout(() => {
  notification.classList.remove("transitionIn");
}, 4000);

// Events
// SEND
btnSend.addEventListener("click", function () {
  let message = inputMessage.value;
  inputMessage.value = "";
  if (message.trim() !== "") {
    chatroom.addChat(message)
      .then(
        // data => console.log(data)
      )
      .catch(err => console.log(err));
  }
});

// UPDATE
btnUpdate.addEventListener("click", function () {
  chatroom.updateUsername(inputUsername.value);
  inputUsername.placeholder = "Username updated!";
  inputUsername.value = "";
});

// nav
nav.addEventListener("click", function (event) {
  let target = event.target;

  if (target.type === "button") {
    // clear all class
    this.querySelectorAll("input[type='button']").forEach(btn => {
      btn.classList.remove("target");
    });
    // toggle class
    target.classList.toggle("target");

    chatroom.updateRoom(target.value); // updates localStorage room

    chatUI.clearChat();

    chatroom.getChats(data => {
      chatUI.printLI(data);
    });
  }
});


// chat
// Brisanje iz baze
sectionChat.addEventListener("click", function (event) {
  if (event.target.tagName === "IMG") {

    let id = event.target.parentElement.getAttribute("data-id");

    let user = getUsername();
    chatroom.chats
      .doc(id)
      .get()
      .then(doc => {
        if (doc.data().username === user) {
          if (confirm(
            "Da li želite da trajno obrišete poruku?"
          )) {
            chatroom.chats
              .doc(id)
              .delete()
              .then(() => {
                // alert("Message successfully deleted!");
              })
              .catch(err => {
                alert(`Message not deleted! ${err}`)
              })
          } else {
            let li = document.querySelector(`li[data-id='${id}']`);
            li.remove();
          }

        } else {
          let li = document.querySelector(`li[data-id='${id}']`);
          li.remove();
        }
      })
      .then(() => {

      })
      .catch(err => {
        console.log(err);
      });
  }
});

// color picker
if (localStorage.getItem("color")) {
  document.body.style.backgroundColor = localStorage.getItem("color");
}
btnUpdateColor.addEventListener("click", function (event) {
  let color = inputColor.value;

  localStorage.setItem("color", color);
  setTimeout(() => {
    sectionChat.style.backgroundColor = color;
  }, 500);
});

// get messages inside dates
btnSetDates.addEventListener("click", function (event) {
  let start = inputDatetimeLocalStart.value;
  let end = inputDatetimeLocalEnd.value;

  start = new Date(start);
  end = new Date(end);

  start = firebase.firestore.Timestamp.fromDate(start);
  end = firebase.firestore.Timestamp.fromDate(end);

  chatUI.clearChat();

  chatroom.getMessagesInsideDates((data) => {
    chatUI.printLI(data);
  }, start, end);
});
