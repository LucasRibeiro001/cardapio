const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const adressInput = document.getElementById("adress");
const adressWarn = document.getElementById("adress-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updateCartModal();
});

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

//Fechar o Modal ao clicar no botão
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    //Adicionar ao carrinho
    addTocart(name, price);
  }
});

//Função para adicionar ao carrinho

function addTocart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
    return;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

//Atualiza o carrinho

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="text-red-600 remove-cart-btn" data-name="${
              item.name
            }">Remover</button>
        </div>
        `;
    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.innerHTML = cart.length;
}

//Remover item do carrinho

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

adressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    adressWarn.classList.add("hidden");
    adressInput.classList.remove("border-red-500");
  }
});

//Finalizar pedido

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkOpen();
  if (!isOpen) {
    Toastify({
        text: "Restaurante fechado no momento!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
      }).showToast();

      return;
  }

  if (cart.length === 0) return;

  if (adressInput.value === "") {
    adressWarn.classList.remove("hidden");
    adressInput.classList.add("border-red-500");
    return;
  }

  //Enviar pedido para a API do WhatsApp
  const cartItems = cart
    .map((item) => {
      return `
      *${item.name}*
      Qtd: (${item.quantity}) Valor: R$ ${item.price.toFixed(2)} 
      ----------------------------------------------- 
      `;
    })
    .join("");
  const message = encodeURIComponent(cartItems);
  const phone = "14998864300";

  window.open(
    `https://wa.me/${phone}?text= ${message}*Endereço: ${adressInput.value}*`,
    "_blank"
  );

  cart = [];
  updateCartModal();
});

//Validação de abertura do restaurante

function checkOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 12 && hora < 22; //true = restaurante aberto
}

const dateItem = document.getElementById("date-span");
const isOpen = checkOpen();

if (isOpen) {
  dateItem.classList.remove("bg-red-500");
  dateItem.classList.add("bg-green-500");
} else {
  dateItem.classList.add("bg-red-500");
  dateItem.classList.remove("bg-green-500");
}
