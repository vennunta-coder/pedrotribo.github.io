import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQaZNwJrlEkLUyYf-x0rXQ-enIVXuR2VE",
  authDomain: "tribo-chat-online.firebaseapp.com",
  projectId: "tribo-chat-online",
  storageBucket: "tribo-chat-online.firebasestorage.app",
  messagingSenderId: "586800623916",
  appId: "1:586800623916:web:529637867b354b8cee7c89",
  measurementId: "G-YX0HWWJL5C"
};

// 1. Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Seleciona os elementos do HTML
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatFeed = document.getElementById('chat-feed');

// 3. Função para enviar uma mensagem
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = chatInput.value.trim();
  if (content === '') return;

  try {
    await addDoc(collection(db, "messages"), {
      content: content,
      timestamp: new Date(),
      user: "Utilizador Anónimo"
    });
    chatInput.value = '';
  } catch (e) {
    console.error("Erro ao adicionar documento: - chat.js:38", e);
  }
});

// 4. Função para exibir as mensagens em tempo real
const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
onSnapshot(q, (querySnapshot) => {
  chatFeed.innerHTML = ''; // Limpa o feed para evitar duplicação
  querySnapshot.forEach((doc) => {
    const message = doc.data();
    const messageElement = document.createElement('div');
    messageElement.classList.add('p-6', 'rounded-lg', 'border', 'border-neutral-800', 'bg-neutral-900', 'shadow-md', 'mb-4');
    messageElement.innerHTML = `
      <p class="text-neutral-300 text-lg">${message.content}</p>
      <cite class="block not-italic mt-2 text-sm font-semibold text-yellow-400">- ${message.user}</cite>
    `;
    chatFeed.appendChild(messageElement);
  });
});