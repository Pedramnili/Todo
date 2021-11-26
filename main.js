// Selectors
let baseUrl = "https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos";
let toast = document.querySelector(".toast");
let error = document.querySelector(".error");

// Events
document.querySelector("#close").addEventListener("click", () => {
  toast.style.display = "none";
});

document.addEventListener("DOMContentLoaded", function () {
  numbId = window.location.search.substr(4);
  findId(numbId);
});


form.onsubmit = async (e) => {
  e.preventDefault();
  if (form.title.value.trim() === "") {
    error.style.display = "flex";
    form.title.style.border = "1px solid red";
  } else {
    error.style.display = "none";
    form.title.style.border = "none";
    let response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title.value,
        description: form.description.value,
        dueDate: form.dueDate.value,
        checked: false,
        createdAt: new Date().toISOString().substr(0, 10),
        updatedAt: new Date().toISOString().substr(0, 10),
      }),
    });
    if (response.status === 201) {
      form.reset();
      toast.style.display = "flex";
      setTimeout(() => {
        toast.style.display = "none";
      }, 5000);
    }
  }
};

// Functions
async function findId(id_elem) {
  array = JSON.parse(localStorage.getItem("listTodo"));
  let id = array.map((e) => {return e.id == id_elem;}).includes(true);
  let id_index = array.map((e) => {return e.id == id_elem;}).indexOf(true);
  if (id === true) {
    document.querySelector("#inputToDo").value = array[id_index].title;
    document.querySelector("#inputToDoText").value = array[id_index].description;
    document.querySelector("#inputToDoDate").value = array[id_index].dueDate;
    document.querySelector("#btn-form").value = "Save";
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (form.title.value.trim() === "") {
        error.style.display = "flex";
        form.title.style.border = "1px solid red";
      } else {
        error.style.display = "none";
        form.title.style.border = "none";
        let response = await fetch(`${baseUrl}/${id_elem}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title.value,
            description: form.description.value,
            dueDate: form.dueDate.value,
            updatedAt: new Date().toISOString().substr(0, 10),
          }),
        });
        if (response.status === 200) {
          form.reset();
          toast.style.display = "flex";
          document.querySelector("#btn-form").value = "Add";
          document.querySelector(".toast > h6").textContent = "The todo successfully Edited"
          setTimeout(() => {
            toast.style.display = "none";
          }, 5000);
        }
      }
    };
  } else if (id_elem !== "" && id === false) {
    document.querySelector(".main").innerHTML = "";
    document.querySelector(".main").insertAdjacentHTML("beforeend",`
    <h1 class="notfound">Error Not Found</h1>`
    );
  }
}