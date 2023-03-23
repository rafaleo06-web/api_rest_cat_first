const API_KEY =
  "live_XlEHV5vjgXcTuwYEzo8Byb0c1M9HywF71U5Kr5GFQ6vldMxCXu9YsQBtqPkUdqqD";
//-----------------------------------------------------------------------------
//TODO: AXIOS
const api = axios.create({
  baseURL: "https://api.thecatapi.com/v1/",
});
// Alter defaults after instance has been created
api.defaults.headers.common["x-api-key"] = API_KEY;

//-----------------------------------------------------------------------------

//no necesita api-key
const URL_API_RANDOM = "https://api.thecatapi.com/v1/images/search?limit=2";

//OR const URL_API_FAVORITE ="https://api.thecatapi.com/v1/favourite Y headers {x-api-key}
const URL_API_FAVORITE = "https://api.thecatapi.com/v1/favourites";

const URL_API_FAVORITE_DELETE = (id) =>
  `https://api.thecatapi.com/v1/favourites/${id}`;

const URL_API_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

const img1 = document.querySelector("#img1");
const img2 = document.querySelector("#img2");
const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");

const spanError = document.querySelector("#error");

const btnLoadRandom = document.querySelector("#loadRandom");
btnLoadRandom.addEventListener("click", loadRandomCats);

//function reload async await
async function loadRandomCats() {
  const response = await fetch(URL_API_RANDOM);
  // console.log(data);

  if (response.status !== 200) {
    spanError.innerHTML =
      "Hubo un error al cargar las imagenes" + response.status;
  } else {
    const data = await response.json();
    console.log(data);
    img1.src = data[0].url; // {url:"..." } url, propiedad de imagen
    img2.src = data[1].url;

    // btn1.addEventListener("click",  addFavoriteCat(data[0].id)); //se está pasando la función addFavoriteCat con un argumento(data[0].id), lo cual provoca que la función se ejecute inmediatamente en lugar de esperar a que se haga clic en el botón.
    btn1.addEventListener("click", () => addFavoriteCat(data[0].id));
    btn2.addEventListener("click", () => addFavoriteCat(data[1].id)); //*se debe pasar una función anónima que llame a la función addFavoriteCat
    //TODO: La función anónima actúa como un contenedor para la función que realmente deseas llamar, y te permite pasar argumentos a esa función sin llamarla inmediatamente.
  }
}

//agregar article al html
async function loadFavoriteCats() {
  //HEADER DE AUTORIZACION
  const response = await fetch(URL_API_FAVORITE, {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  });
  const data = await response.json();
  console.log("favorite cats", data);

  if (response.status !== 200) {
    const data = await response.text();
    spanError.innerHTML = "Hubo un error: " + response.status + data.message;
  } else {
    //cuando AGREGAMOS CAT A FAVORITES NO limpiamos html y se duplica Favorites
    const section = document.querySelector("#favoritesCats");
    section.innerHTML = ""; //limpia contenido de section

    data.forEach((cat) => {
      const article = document.createElement("article");
      article.classList.add(
        "mx-1",
        "bg-gray-100",
        "rounded-3xl",
        "shadow-xl",
        "overflow-hidden",
        "w-48",
        "h-60",
        "flex",
        "flex-col",
        "items-center",
        "mt-3"
      );
      const img = document.createElement("img");
      img.classList.add("w-40", "h-44", "object-cover", "rounded-2xl");

      const button = document.createElement("button");
      button.classList.add(
        "my-4",
        "bg-red-700",
        "py-2",
        "px-2",
        "mt-3",
        "rounded-2xl",
        "text-white",
        "w-36"
      );
      const btnText = document.createTextNode("Remove cat");

      button.appendChild(btnText);
      button.addEventListener("click", () => deleteFavoriteCats(cat.id));
      img.src = cat.image.url;
      article.append(img, button);
      section.appendChild(article);
    });
  }
}

async function addFavoriteCat(id) {
  /*   const response = await fetch(URL_API_FAVORITE, {
    // HEADER DE AUTORIZACION
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_id: id }),
  });

  console.log(response);
  if (response.status !== 200) {
    const data = await response.text();
    spanError.innerHTML = "Hubo un error: " + response.status + data.message;
  } else {
    const data = await response.json();
    console.log("Save cats favorites");
    loadFavoriteCats();
    console.log(data);
  }
 */

  //APLICANDO AXIOS
  //const response == const {data, status} =>automaticamente en AXIOS
  const { data, status } = await api.post("/favourites", {
    image_id: id,
  });
  console.log({ data, status });
  if (status !== 200) {
    spanError.innerHTML = "Hubo un error: " + status + data.message;
  } else {
    console.log("Save cats favorites");
    loadFavoriteCats();
    console.log(data);
  }
}

async function deleteFavoriteCats(id) {
  const response = await fetch(URL_API_FAVORITE_DELETE(id), {
    method: "DELETE",
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (response.status !== 200) {
    const data = await response.text();
    spanError.innerHTML = "Hubo un error: " + response.status + data.message;
  } else {
    const data = await response.json();
    console.log("Delete cat favorite");
    loadFavoriteCats();
    console.log(data);
  }
}

async function uploadImageCat() {
  //Si se le brinda un elemento HTML form, el objeto automáticamente capturará sus campos
  const form = document.querySelector("#uploadingForm");
  const formData = new FormData(form);
  console.log(formData.get("file")); //key:file = name:file HTML
  const response = await fetch(URL_API_UPLOAD, {
    method: "POST",
    headers: {
      // "Content-Type": "multipart/form-data",
      "x-api-key": API_KEY,
    },
    body: formData,
  });

  const data = await response.json();
  //upload cat message 201 = éxito, asi validaremos
  if (response.status !== 201) {
    spanError.innerHTML = "Hubo un error: " + response.status + data.message;
  } else {
    console.log("image subida");
    console.log(data);
    console.log(data.url);
    addFavoriteCat(data.id);
  }
}

loadRandomCats(); //la funcion se ejecuta al cargar la pagina
loadFavoriteCats();
