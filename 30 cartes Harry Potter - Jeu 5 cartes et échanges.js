// Ci-dessous un booléan qui dira si le menu de la burger box s'affiche ou pas. Au départ, il ne s'affiche pas
let menuVisible = false;

// Ci-dessous la fonction qui fait basculer le menu de la burger box de visible à pas visible et inversement
function toggleMenu() {
  const menu = document.getElementById('menuContainer');
  menu.style.display = menuVisible ? 'none' : 'block';
  menuVisible = !menuVisible;
}

// Ci-dessous les définitions des 2 tableaux, de celui du jeu initial de 30 cartes, créé avec l'API
// Et le jeu du joueur, qui sera tiré au hasard des 30 cartes
let jeuInitial30Cartes = [];
let jeuJoueur = [];

// obtenirCartes va chercher les données dans l'url de l'API indiquée dans l'énoncé
// Celle-ci est appelée par afficherCartes
async function obtenirCartes() {
  const response = await fetch('https://hp-api.lainocs.fr/characters');
  return await response.json();
}

async function afficherCartes() {
  const charactersContainer = document.getElementById('characters');
  jeuInitial30Cartes = await obtenirCartes();

  jeuInitial30Cartes.forEach(character => {
    const card = creerCarte(character);
    charactersContainer.appendChild(card);
  });
}

function creerCarte(character) {
  const card = document.createElement('div');
  card.classList.add('card');

  const { id, name, image, actor, house, patronus } = character;

  card.innerHTML = `
    <h2>${id} - ${name}</h2>
    <img src="${image}" alt="${name}">
    <div>
      <p><strong>Acteur:</strong> ${actor}</p>
      <p><strong>Maison:</strong> ${house}</p>
      <p><strong>Patronus:</strong> ${patronus || 'Inconnu'}</p>
    </div>
  `;

  return card;
}

// Ci-dessous la fonction qui tire aléatoirement 5 cartes, pour le joueur
async function tirerCartesJoueur() {
    jeuJoueur = [];
    let cartesRestantes = [...jeuInitial30Cartes];
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * cartesRestantes.length);
      const carteTiree = cartesRestantes.splice(index, 1)[0];
      jeuJoueur.push(carteTiree);
      jeuInitial30Cartes = jeuInitial30Cartes.filter(carte => carte.id !== carteTiree.id);
    }
    afficherCartesJoueur(jeuJoueur);
  }

// Ci-dessous la fonction qui affiche les 5 cartes du joueur
function afficherCartesJoueur(jeuJoueur) {
  const charactersContainer = document.getElementById('characters');
  charactersContainer.innerHTML = '';

  jeuJoueur.forEach(character => {
    const card = creerCarte(character);
    charactersContainer.appendChild(card);
  });
}

function afficherToutesLesCartes() {
  const charactersContainer = document.getElementById('characters');
  charactersContainer.innerHTML = '';

  jeuInitial30Cartes.forEach(character => {
    const card = creerCarte(character);
    charactersContainer.appendChild(card);
  });
}

async function echangerCarte() {
    const carteID = parseInt(prompt("Veuillez entrer le numéro de la carte que vous souhaitez échanger :"));
    
    // Vérifier si la carte avec le numéro saisi est présente dans le jeu du joueur
    const index = jeuJoueur.findIndex(carte => carte.id === carteID);
    if (index !== -1) {
      // Retirer la carte choisie du jeu du joueur
      const carteEchangee = jeuJoueur[index];
  
      // Nous décidons que 1 fois sur 3 l'échange sera refusé, pour simuler un cas où la carte ne trouve pas preneur
      // Et 2 fois sur 3, la carte est acceptée pour échange (si refusé, le joueur peut réessayer plus tard)
      // Générer un nombre aléatoire entre 1 et 3 pour déterminer si le système accepte ou refuse l'échange
      const nombreAleatoire = Math.floor(Math.random() * 3) + 1;
  
      if (nombreAleatoire === 1 || nombreAleatoire === 2) { // Accepte l'échange à 2/3 de chance
        // Sélectionner une carte aléatoire parmi les cartes restantes dans le jeu
        const indexCarteAleatoire = Math.floor(Math.random() * jeuInitial30Cartes.length);
        const nouvelleCarte = jeuInitial30Cartes[indexCarteAleatoire];
  
        // Proposer la carte au joueur
        const confirmation = window.confirm(`Cette carte vous est proposée en échange :\n${nouvelleCarte.id} - ${nouvelleCarte.name}\n\nL'acceptez-vous ?`);
  
        if (confirmation) {
          // Retirer la carte échangée du jeu du joueur
          jeuJoueur.splice(index, 1);
          // Ajouter la nouvelle carte au jeu du joueur
          jeuJoueur.push(nouvelleCarte);
          alert(`La carte ${carteEchangee.name} (ID: ${carteID}) a été échangée avec succès. Tapez OK puis vous verrez votre nouveau jeu, avec la nouvelle carte qui apparaitra sur la droite`);
        } else {
          alert("Vous avez refusé, il n'y a pas d'échange");
        }
      } else {
        alert("Votre carte proposée n'a pas trouvé preneur. Vous pouvez ré-essayer plus tard");
      }
      
      // Afficher les cartes mises à jour du joueur
      afficherCartesJoueur(jeuJoueur);
    } else {
      alert("Vous ne possédez pas cette carte.");
    }
  }
  

document.addEventListener('DOMContentLoaded', function () {
  afficherCartes();
});
