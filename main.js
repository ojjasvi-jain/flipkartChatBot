let wrapperRef = document.getElementById("wrapper");
let msgHeaderRef = document.getElementsByClassName("msg_header");
let messageContainerRef = document.getElementById("message_container");
let containerRef = document.getElementById("container");
let searchBarRef = document.querySelector(".searchBar");
let listItems = document.getElementsByClassName("list");
let userMsgRef = document.querySelector(".sender-msg_cont");
let footerInputRef = document.querySelector(".footer_input");

// api call to fetch the data
async function fetchContent() {
  let res = await fetch(
    "https://my-json-server.typicode.com/codebuds-fk/chat/chats"
  );

  let data = await res.json();

  renderItemList(data);
}

// api call to render the conversation
async function getMsgContent(selectedId) {
  let senderMsg = "";
  let optionHTML = "";
  let res = await fetch(
    "https://my-json-server.typicode.com/codebuds-fk/chat/chats"
  );

  let data = await res.json();
  let filterData = data.filter((item) => String(item.id) === selectedId);
  if (filterData[0].messageList.length > 0) {
    document.getElementsByClassName("emptyChat")[0].classList.add("hide");
    filterData[0].messageList.forEach((chat) => {
      if (chat.sender === "BOT") {
        if (chat.options && chat.options.length > 0) {
          chat.options.forEach((text) => {
            optionHTML += ` <div class="bot_option">${text.optionText}</div>`;
          });

          senderMsg += `<div class="bot-msg_cont">
          <span class="bot_msg"
          >${chat.message}
          <div class="bot_option_cont">
             ${optionHTML}
          </div>
        </span> </div>`;
        } else {
          senderMsg += ` <div class="bot-msg_cont"><span class="bot_msg">${chat.message}</span> </div>`;
        }
      }

      if (chat.sender === "USER")
        senderMsg += ` <span class="sender_msg">${chat.message}</span>`;
    });
  } else {
    document.getElementsByClassName("emptyChat")[0].classList.remove("hide");
  }
  userMsgRef.innerHTML = senderMsg;
}

// to render a list on screen
const renderItemList = (data) => {
  let html = "";
  data.forEach(
    ({ title, imageURL, orderId, id, latestMessageTimestamp, messageList }) => {
      let lastMessage =
        messageList.length > 0 ? messageList.at(-1).message : "";

      html += `<section class="list" id=list_${id}>
      <div class="left_container" id=left_${id}>
        <img
          class="item_img"
          src=${imageURL}
          alt=""
          id=img_${id}
        />
        <div class="description" id=des_${id}>
          <p class="title" id="title_${id}" >${title}</p>
          <div class="order_id" id="order_${id}">${orderId}</div>
          <div class="message" id=msg_${id}>${lastMessage}</div>
        </div>
      </div>
      <div class="right_container" id=rigth_${id}>
        <div class="date" id=date_${id}>${new Date(
        latestMessageTimestamp
      ).toLocaleDateString("en-GB")}</div>
      </div>
    </section>`;
    }
  );

  wrapperRef.innerHTML = html;
};

// to open chat bot
wrapperRef.addEventListener("click", (e) => {
  let selectedItemId = e.target.id.split("_")[1];

  getMsgContent(selectedItemId);

  [...document.getElementsByClassName("list")].forEach((ele) => {
    ele.classList.remove("bg-color");
  });
  e.target.closest("section").classList.add("bg-color");
  let selectItemTitle = document.getElementById(
    `title_${selectedItemId}`
  ).innerText;
  let seletedImg = document.getElementById(`img_${selectedItemId}`).src;

  msgHeaderRef[0].innerHTML = `<img
  class="item_img"
  src=${seletedImg}
  alt=""
/>
<div class="title">${selectItemTitle}</div>`;
  containerRef.classList.add("message_saparator");
  messageContainerRef.classList.remove("hide");
});

// functionality to filter the item
searchBarRef.addEventListener("keyup", (e) => {
  let inputList = document.getElementsByClassName("list");
  let text = e.target.value;
  let pat = new RegExp(text, "i");
  for (let i = 0; i < inputList.length; i++) {
    let itemTitle = document.getElementById(`title_${i + 1}`);
    let orderId = document.getElementById(`order_${i + 1}`);
    if (pat.test(itemTitle.innerText) || pat.test(orderId.innerText)) {
      inputList[i].classList.remove("hide");
    } else {
      inputList[i].classList.add("hide");
    }
  }
});

// to add the user Text
footerInputRef.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (e.target.value !== "") {
      document.getElementsByClassName("emptyChat")[0].classList.add("hide");
      userMsgRef.innerHTML += ` <span class="sender_msg">${e.target.value}</span>`;

      setTimeout(() => {
        userMsgRef.innerHTML += `<div class="bot-msg_cont">
          <span class="bot_msg"
          >Hi, what can I help you with?
          <div class="bot_option_cont">
          <div class="bot_option">Request a call</div>
          <div class="bot_option">Go to My Orders</div>
          </div>
        </span> </div>`;
      }, 500);
    }
    e.target.value = "";
  }
});

userMsgRef.addEventListener("click", (e) => {
  if (e.target.innerText === "Request a call") {
    userMsgRef.innerHTML += ` <span class="sender_msg">I want a callback</span>`;
  }
});

// intial step
document.addEventListener("DOMContentLoaded", () => {
  fetchContent();
});
