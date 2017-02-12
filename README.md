# Enquêtes sur le campus

Projet WEB client et server side - SI5 2016/2017

* Arnaud GARNIER
* Chloé GUGLIELMI
* Lisa JOANNO

## Présentation du sujet

Des équipes se promènent dans une zone géographique avec leurs smartphones et font tourner l’appli des “joueurs”. Elles doivent atteindre des lieux pour déclencher des énigmes, répondre aux questions ou remplir les conditions demandées, puis on leur donne une nouvelle destination qu’ils doivent atteindre, etc.
Les énigmes démarrent donc lorsqu’on entre dans une zone (cercle sur la carte). Les smartphones qui ont lancé l’application du jeu déclenchent alors des notifications et un nouvel écran affiche les étapes de l’énigme (la première étape active, les autres en grisé ou bien n’apparaissent pas encore). Par exemple, on affiche un fragment mystérieux de photo (ex: un bout de plaque d’un immeuble, un pied de statue, un panneau, etc.) et l’équipe doit localiser l’endroit et indiquer dans un champ de texte de quoi il s’agit, ou mieux, doit envoyer la photo de l’objet complet. Autre possibilité, une question avec plusieurs réponses possibles (nombre d’essais limités), il faut observer l’environnement pour répondre (de quelle couleur est le vieux sage qui a créé Sophia-Antipolis ?, la réponse est bleue car le créateur de Sophia Antipolis est le sénateur Lafitte, et vous êtes en ce moment sur la place Sophie Laffitte. Sur la place quelque part, figure un buste du Sénateur que des étudiants en Bizutage ont peint en bleu à ce moment là), etc…
L’application mobile permet aussi de chatter librement avec les “maîtres du jeu”, voir de les appeler au tel (le No est affiché) en cas de détresse (on comprend vraiment rien). On pourra aussi prévoir de l’affichage d’indice mais ça enlèvera des points à la fin, lors du calcul du score final. Cet aspect est optionnel, à vous de voir comment vous pensez qu’un jeu de piste doit se dérouler pour que cela soit fun ! Si vous avez d’autres idées, on en discutera. 

## Comment lancer notre application ?

### Serveur

Notre serveur est déployé sur Heroku (https://web-map-project-si5.herokuapp.com/). Celui-ci est lié à notre git. Sur ce serveur, on a la possibilité de :
<ul>
<li> Voir et valider les réponses des joueurs aux énigmes ; </li>
<li> Voir la liste des équipes participantes ; </li>
<li> Ajouter une énigme et sa localisation sur une carte ; </li>
<li> Chatter avec les joueurs, afin de pouvoir leur donner des indices si ils sont en difficulté. </li>
</ul>

Le serveur a été codé en Node.js. Après avoir cloné le repository GitHub, vous pouvez lancer le serveur via : 

    cd Server/
    npm install
    npm start

Le serveur sera alors déployé sur localhost:8888.

Si vous souhaitez utiliser entièrement le serveur en local, vous devez également aller dans les fichiers <i>Server/public/javascripts/newEnigma.js</i> et <i>Server/public/javascripts/validationPage.js</i>, aux lignes : 

    var url = 'https://web-map-project-si5.herokuapp.com';
    //var url = 'http://localhost:8888';

Commentez la première et décommentez la seconde. Sans cela, côté client WEB, la communication se fera avec le serveur Heroku.

Quelques tests ont été écrits avec Mocha. Pour lancer les tests, il suffit de lancer la commande : 

    npm test


### Client

Notre client est codé avec la technologie ionic et est donc cross-platform. On peut le déployer sur un web-browser (si on ne souhaite pas le déployer sur son téléphone) avec la commande `ionic serve`. Si on souhaite le déployer sur son téléphone, il suffit d'effectuer la commande suivante :
<br />
`ionic run android` pour un téléphone sous Android. Si aucun téléphone n'est connecté à l'appareil, l'application se lance sur un émulateur Android. <br />
Pour un téléphone sous iOS, il faut créer un compte <i>Apple Developer</i>(cela est cependant payant et coûte $99 par an).
<br /> <br/>
Depuis l'application client, il est possible de :
<ul>
<li> déclarer son équipe ; </li>
<li> voir la position des zones d'énigmes sur la carte ; </li>
<li> résoudre une énigme (textuellement ou en envoyant une image) ; </li>
<li> chatter avec les maîtres du jeu. </li>
</ul>

## Points forts et points faibles
### Points forts
<ul>
<li> Ajout d'énigme avec image que le client peut voir, avec la localisation intuitive sur une carte. </li>
<li> Localisation GPS du client en utilisant les capteurs du téléphone. </li>
<li> Chat utilisant les web sockets pour une communication en temps réel. </li>
<li> Possibilité d'upload des images du téléphone vers le serveur. </li>
<li> Un serveur web avec une interface responsive. </li>
<li> Un client cross-platform. </li>
<li> Un serveur déployé sur Heroku pour pouvoir y accéder depuis n'importe quel réseau, et donc en extérieur avec la 4G. </li>
</ul>
### Points faibles
<ul>
<li> Une équipe ne peut avoir qu'un téléphone (pas de possibilité de s'authentifier dans une équipe). </li>
<li> Pas de réelle notion de maître du jeu. Nous avons volontairement mis de côté des notions de sécurité et d'authentification, impliquant que les personnes sur l'interface web deviennent les maîtres du jeu. </li>
</ul>

## Répartition du travail

### Arnaud (argarnie@polytech.unice.fr)
Chat client web/serveur via les sockets, upload & affichage des images côté client et côté serveur.

### Chloé (chloe.guglielmi@etu.unice.fr)
Client ionic : déplacement de l'utilisateur et affichage des énigmes sur la carte du client. Envoi des réponses et attente de la validation du maître du jeu. Chat client ionic.

### Lisa (lisa.joanno@etu.unice.fr)
Serveur NodeJS : gestion des teams et énigmes en REST, validation des clients via les sockets. Déploiement de la base de données sur mLab et du serveur sur Heroku. Tests.
Client WEB.
