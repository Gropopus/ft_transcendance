#TOKEN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
Salut les Benoits,

j'ai fais un set-up de base pour le projet.

-> Pour l'API il y a un dockerfile qui telecharge/installe les modules en NESTJS (dossier API)

-> Pour le frontEnd il y a un dockerfile qui installe Angular (parce qu'il y a full doc sur comment faire un chat)

-> Le yaml a la racine lance le developpement et la prod avec une data base PostgreSQL comme demande dans
le sujet.

En vrai pour le temps de build c'est comme service donc c'est pratique il faut build une seul fois puis
toutes les modifs s'appliquent directement sans avoir a rebuild.
-> docker-compose up pour build et lancer

sur www.kittypong.fr:5050 il y a postgres admin, on s'y connecte avec l'addresse
-> admin@admin.com
mot de passe : password
ca communique avec notre database par le port 80.

Notre database s'appel db, le login pour s'y connecter est "user" et le mot de passe "password"

www.kittypong.fr:3000 --> API(NESTJS)
www.kittypong.fr:4200 --> Angular(html/css/js)
www.kittypong.fr:5050 --> postgresadmin

