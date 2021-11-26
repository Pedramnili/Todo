// Selectors
let baseUrl = "https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos";
let list = document.querySelector("#my-list");


// Events
document.getElementById("page_next").addEventListener("click", nextPage);
document.getElementById("page_last").addEventListener("click", lastPage);
document.addEventListener("DOMContentLoaded", () => {
  getDatatodo(baseUrl);
  pages();
  numbPage = window.location.search.substr(-1,1);
  let listToDo = listTodo();
  if (numbPage === "") {
    pageSelected ("page-1")
    window.location.search = `page-1`
  } else if (numbPage > Math.ceil(listToDo.length / 5)) {
    document.querySelector("#my-list").innerHTML = '';
    document.querySelector("#my-list").insertAdjacentHTML("beforeend",`
    <h1 class="notfound">Error Not Found</h1>`
    );
  } else {
    pageSelected (`page-${numbPage}`)
  }
  if (numbPage > 5 && numbPage <= Math.ceil(listToDo.length / 5)) {
      document.getElementById(`page-${numbPage}`).style.display = "flex";
  }
});

// Functions
let getDatatodo = async (url) => {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
  localStorage.setItem("listTodo",JSON.stringify(data));
};

let listTodo = () => {
  let array = [];
  array = JSON.parse(localStorage.getItem("listTodo"));
  return array;
}

let pages = () => {
  let listToDo = listTodo();
  for (let i = Math.ceil(listToDo.length / 5); 1 <= i; i--) {
    document.getElementById("page_last").insertAdjacentHTML("afterend",`<a id="page-${i}" href="?page=${i}" class="notActive" onclick="pageSelected(this.id)">${i}</a>`);
    (i > 5) ? document.getElementById(`page=${i}`).style.display = "none" : "";
  }
}


function pageSelected (event) {
  let start = ((event.substr(-1, 1)) - 1) * 5;
  let end = (event.substr(-1, 1)) * 5;
  let listToDo = listTodo();
  list.innerHTML = '';
  (+event.substr(-1, 1) >= Math.ceil(listToDo.length / 5)) ? end = (listToDo.length) : '' ;
  for (let index = start; index < end; ++index) {
    list.insertAdjacentHTML( "beforeend",`
    <li class="todo" id="id-${listToDo[index].id}" ${(ckecked = listToDo[index].checked === true ? "style=    'text-decoration:line-through'" : "style='text-decoration:none'")}">
       <div class=icons>
         <div class=icons-1>
           <input type="checkbox" id="check-${listToDo[index].id}" onchange="checkedItem(id.substr(6))" 
           ${(ckecked = listToDo[index].checked === true ? 'checked' : "")}>
         <span class="title-s">${listToDo[index].title}</span>
          <span id="dataDue-${listToDo[index].id}" class="dataDue">${listToDo[index].dataDue}</span>
       </div>
       <div class=icons-2><span>${listToDo[index].description}</span></div></div>
      <div class="icon-edit icon-edit-${listToDo[index].id}"><span class="iconify" 
      id="pen-${listToDo[index].id}" data-icon="fa-solid:pen" onclick="editToDo(id.substr(4))"></span><span class="iconify" 
      id="bin-${listToDo[index].id}" data-icon="ion:trash-bin" onclick="deleteToDo(id.substr(4))">
      </span></div></li>`);
  }
  for (let i = 1; i <= Math.ceil(listToDo.length / 5); i++) {
    if (i == event.substr(-1, 1)) {
      document.getElementById(`page-${event.substr(-1, 1)}`).classList.add("active");
      document.getElementById(`page-${event.substr(-1, 1)}`).classList.remove("notActive");
    } else {
      document.getElementById(`page-${i}`).classList.add("notActive");
      document.getElementById(`page-${i}`).classList.remove("active");
    }
  }
}

function lastPage() {
  numbPage = window.location.search.substr(-1,1);
  --numbPage;
  (numbPage < 1) ? numbPage = 1 : '' ;
  pageSelected (`page-${numbPage}`)
  window.location.search = `page-${numbPage}`
}

function nextPage() {
  let listToDo = listTodo();
  numbPage = window.location.search.substr(-1,1);
  ++numbPage;
  (numbPage > Math.ceil(listToDo.length / 5)) ? numbPage = Math.ceil(listToDo.length / 5) : '' ;
  pageSelected (`page-${numbPage}`)
  window.location.search = `page-${numbPage}`
}

function checkedItem(id) {
  if (document.getElementById(`check-${id}`).checked) {
    document.getElementById(`id-${id}`).style.textDecoration = "line-through";
    putcheckedItem(baseUrl,id,true);
  } else {
    document.getElementById(`id-${id}`).style.textDecoration = "none";
    putcheckedItem(baseUrl,id,false);
  }
}


let putcheckedItem = async (Url,id,result) => {
  let response = await fetch(`${Url}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({checked: result
     ,updatedAt: new Date().toISOString().substr(0, 10)}),
  });
}

function deleteToDo(id) {
  let list_Array = document.querySelectorAll(".icon-edit");
  document.querySelector(`.icon-edit-${id}`).innerHTML = "";
  document.querySelector(`.icon-edit-${id}`).insertAdjacentHTML( "beforeend",`<div class="icon-delete">
  <span id="tick-${id}" class="iconify btn-form-edit" data-icon="subway:tick" 
  onclick="deleteToDoAcc(id.substr(5))"></span><span id="close-${id}" class="iconify" data-icon="ant-design:close-circle-filled" onclick="deleteToDoClo(id.substr(6))"></span></div>`)
  list_Array.forEach(element => {
    if (element.className.substr(20) != id) {
        document.getElementById(`bin-${element.className.substr(20)}`).removeAttribute("onclick");
        document.getElementById(`pen-${element.className.substr(20)}`).removeAttribute("onclick");
        document.getElementById(`bin-${element.className.substr(20)}`).style.color ="gray";
        document.getElementById(`pen-${element.className.substr(20)}`).style.color ="gray";
    }
  });
}

async function deleteToDoAcc(id) {
  let list_Array = document.querySelectorAll(".icon-edit");
  document.querySelector(`#id-${id}`).remove();
  let response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }  
  });
  list_Array.forEach(element => {
    if (element.className.substr(20) != id) {
      document.getElementById(`bin-${element.className.substr(20)}`)
      .setAttribute("onclick", "deleteToDo(id.substr(4))");
      document.getElementById(`pen-${element.className.substr(20)}`)
      .setAttribute("onclick", "editToDo(id.substr(4))");
      document.getElementById(`bin-${element.className.substr(20)}`).style.color ="#e93030cb";
      document.getElementById(`pen-${element.className.substr(20)}`).style.color ="#4040e9cb";
    }
  });
}

function deleteToDoClo(id) {
  let list_Array = document.querySelectorAll(".icon-edit");
  document.querySelector(`.icon-edit-${id}`).innerHTML = "";
  document.querySelector(`.icon-edit-${id}`).insertAdjacentHTML( "beforeend",`<span class="iconify" id="pen-${id}" data-icon="fa-solid:pen" onclick="editToDo(id.substr(4))"></span><span class="iconify" id="bin-${id}" data-icon="ion:trash-bin" onclick="deleteToDo(id.substr(4))"></span>`);
  list_Array.forEach(element => {
    console.log(element);
    document.getElementById(`bin-${element.className.substr(20)}`)
    .setAttribute("onclick", "deleteToDo(id.substr(4))");
    document.getElementById(`pen-${element.className.substr(20)}`)
    .setAttribute("onclick", "editToDo(id.substr(4))");
    document.getElementById(`bin-${element.className.substr(20)}`).style.color = "#e93030cb";
    document.getElementById(`pen-${element.className.substr(20)}`).style.color = "#4040e9cb";
  });
}

function editToDo (id) {
  window.location.href = `../index.html?id=${id}`;
}