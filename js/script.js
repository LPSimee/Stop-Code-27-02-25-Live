// Stop&Code Finale con approccio OOP - JS Avanzato (Modulo 4)

"use strict";

class Recipe {
    constructor(
        id,
        name,
        ingredients,
        instructions,
        caloriesPerServing,
        difficulty,
        image,
        prepTimeMinutes,
        cuisine
    ) {
        this.id = id;
        this.name = name;
        this.ingredients = ingredients; // array
        this.instructions = instructions; // array
        this.caloriesPerServing = caloriesPerServing;
        this.difficulty = difficulty;
        this.image = image; // URL
        this.prepTimeMinutes = prepTimeMinutes;
        this.cuisine = cuisine;
    }

    // metodo per mostrare/stampare le ricette
    mostraRicetta(container) {
        const card = document.createElement("div");
        card.classList.add("recipe"); // Rendiamolo il contenitore delle ricette

        card.innerHTML = `
        <div class="content">
            <h2>Cucina - ${this.cuisine}</h2>
            <img src="${this.image}" alt="${this.name}">
            <h3>${this.name}</h3>
            <p>Difficoltà: ${this.difficulty}</p>
            <p>Calorie per porzione: ${this.caloriesPerServing}</p>
            <p>Tempo di preparazione: ${this.prepTimeMinutes} min.</p>
        </div>
        <button id="id-${this.id}" class="view btn button--product">View</button>
    `;
        container.appendChild(card);

        // Evento "click" sul bottone "View"
        const btnView = document.querySelector("button#id-" + this.id);

        btnView.addEventListener("click", () => {
            /* console.log("click sul bottone "View"", btnView.id); */
            const popup = document.querySelector(".modal.modal--hidden");
            popup.classList.remove("modal--hidden");

            const ctnPopup = document.querySelector(".modal-inner");
            // Per inserire il contenuto del popup
            this.mostraDettagliRicetta(ctnPopup);
        });
    }

    // metodo per mostrare i dettagli della ricetta nel popup
    mostraDettagliRicetta(container) {
        container.innerHTML += `
            <div class="modal-content">
                <img class="modal-image" src="${this.image}" alt="${this.name}">
                <div class="modal-text">
                    <h1 class="modal-title">${this.name}</h1>
                    <h2 class="modal-title-description">Ingredients</h2>
                    <p>${this.ingredients.join(" ")}</p>
                    <h2 class="modal-title-description">Description</h2>
                    <p>${this.instructions.join(" ")}</p>
                </div>
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const apiRicetta = "http://localhost:3000/recipes";

    const contenitoreRicette = document.querySelector(".recipes");

    fetch(apiRicetta)
        .then((res) => res.json())
        .then((data) => chiamaRicette(data, contenitoreRicette))
        .catch((error) => console.log(error));

    // Parte chiusura popup
    const contenutoPopup = document.querySelector(".modal-inner");

    // Evento "click" del bottone per chiudere il popup
    contenutoPopup.addEventListener("click", (e) => {
        /* console.log("Click sul bottone 'Close'"); */
        if (e.target.tagName === "BUTTON" || e.target.tagName === "I") {
            document.querySelector(".modal").classList.add("modal--hidden");

            /* document.querySelector(".modal-inner").innerHTML = `
            <button class="btn btn--close-modal chiudiPopup" id="close">
                <i class="chiudi fa-solid fa-circle-xmark chiudiPopup"></i>
            </button>`; */

            const dettagliPopup = document.querySelector(".modal-content");
            contenutoPopup.removeChild(dettagliPopup);
        }
    });

    // Parte ricerca ricetta
    const btnSearch = document.querySelector("#search");

    // Evento "click" per il bottone SEARCH
    btnSearch.addEventListener("click", () => {
        let valueInput = document.querySelector("#searchText");

        // controllo sulla value dell'input
        if (isNaN(valueInput.value)) {
            alert("Occore inserire un numero non una stringa");
            valueInput.value = "";
        } else cercaRicetta(valueInput.value, contenitoreRicette); // chiamata funzione per la ricerca della ricetta
    });

    // Parte reset ricette
    const btnReset = document.querySelector("#reset");

    // Evento "click" per il bottone RESET
    btnReset.addEventListener("click", () => {
        /* console.log("Click sul bottone RESET"); */

        fetch(apiRicetta)
            .then((res) => res.json())
            .then((data) => chiamaRicette(data, contenitoreRicette))
            .catch((error) => console.log(error));
    });

    // Parte aggiunta ricetta
    const btnAdd = document.querySelector("#add");

    // Evento "click" dell'invio invio dei dati dell'input per l'inerimento di una nuova ricetta
    btnAdd.addEventListener("click", () => {
        const input = document.querySelectorAll(".mb-3 input");

        const nomeRicetta = input[0].value;
        const difficolta = input[1].value;
        const calorie = input[2].value;
        const tempoPreparazione = input[3].value;
        const cucina = input[4].value;

        if (
            nomeRicetta === "" ||
            difficolta === "" ||
            calorie === "" ||
            tempoPreparazione === "" ||
            cucina === ""
        ) {
            alert("Tutti i campi sono obbligatori");
            return;
        } else {
            fetch(apiRicetta)
                .then((response) => response.json())
                .then((data) => {
                    const id = `${data.length + 1}`;
                    const nuovaRicetta = new Recipe(
                        id,
                        nomeRicetta,
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta totam voluptas veniam tenetur rerum labore aut neque atque? Eaque ipsum officia dolor, nihil veritatis et doloribus obcaecati harum nam deleniti.",
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nulla, fugiat reprehenderit sequi labore velit mollitia alias vero ea perferendis illum voluptatum consequatur molestiae doloremque odit ratione neque natus magnam? Repellat fugit explicabo temporibus ipsam sequi expedita repellendus placeat incidunt ex voluptatum facere id, perspiciatis magnam ut illum a dolore nemo aliquid dignissimos inventore ipsum aperiam quisquam? Amet, sit. Possimus.",
                        calorie,
                        difficolta,
                        "https://cdn.dummyjson.com/recipe-images/1.webp",
                        tempoPreparazione,
                        cucina
                    );

                    aggiungiRicetta(apiRicetta, nuovaRicetta);
                })
                .catch((error) => console.log(error)); // Fine fetch
        }
    });
}); // DOMContentLoaded

// Funzione per la chiamata delle ricette
function chiamaRicette(data, container) {
    container.innerHTML = "";
    data.forEach((obj) => {
        const r = new Recipe(
            obj.id,
            obj.name,
            obj.ingredients,
            obj.instructions,
            obj.caloriesPerServing,
            obj.difficulty,
            obj.image,
            obj.prepTimeMinutes,
            obj.cuisine
        );
        r.mostraRicetta(container);
    });
}

// Funzione per cercare una ricetta tramite id
function cercaRicetta(id, container) {
    const apiRequests = `http://localhost:3000/recipes/${id}`;
    fetch(apiRequests)
        .then((response) => response.json())
        .then(
            // Per stampare le ricette
            (data) => {
                const r = new Recipe(
                    data.id,
                    data.name,
                    data.ingredients,
                    data.instructions,
                    data.caloriesPerServing,
                    data.difficulty,
                    data.image,
                    data.prepTimeMinutes,
                    data.cuisine
                );
                container.innerHTML = "";
                r.mostraRicetta(container);
            }
        )
        .catch((error) => {
            console.log(error);
            alert("Ricetta non presente");
        });
}

// Funzione per aggiungere una nuova ricetta
function aggiungiRicetta(api, newRecipe) {
    fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
    })
        .then((response) => response.json())
        .then((data) => console.log("Ricetta aggiunta", data))
        .catch((error) => console.log(error));
}
