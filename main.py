from jinja2 import Template

# =======================
# Variables à personnaliser
# =======================
first_logo = "https://raw.githubusercontent.com/bandizz/images/refs/heads/main/logo.png"
end_logo = "https://raw.githubusercontent.com/bandizz/images/refs/heads/main/logo_alt2.png"

# Liste des PS SAUF le n°4
# (on n’indique plus d’ID ici)
raw_ps = [
  { "text": "Bonjour les petits chamallows, j'adore le rock", "color": "black"},
  { "text": "Oui ce PS commence en douceur, profitez", "color": "black"},
  { "text": "PS 3", "color": "black"},
  { "text": "On a vu un distributeur qui parlait au mur", "color": "black"},
  { "text": "On pense le recruter aussi", "color": "black"},
  { "text": "Il a plus de personnalité que la moitié de la liste", "color": "black"},
  { "text": "Qui a volé la mascotte Bandizz ?", "color": "black"},
  { "text": "Rendez-la, ou on en crée une en pâte à sel", "color": "black"},
  { "text": "Et personne n’a envie de voir ça", "color": "black"},
  { "text": "En vrai on a déjà essayé", "color": "black"},
  { "text": "Elle fond", "color": "black"},
  { "text": "ET ELLE PUE", "color": "black"},
  { "text": "Bref n’oubliez pas de cliquer", "color": "black"},
  { "text": "Bandizz > les autres listes (objectivité 100%)", "color": "black"},
  { "text": "On ne cherche pas la bagarre", "color": "black"},
  { "text": "Mais si elle vient, on danse", "color": "black"},
  { "text": "On a déjà répété une chorégraphie", "color": "black"},
  { "text": "Fun fact : on n’a pas de fun fact", "color": "black"},
  { "text": "Bandizz vous aime", "color": "black"},
  { "text": "Surtout toi là, oui toi", "color": "black"},
  { "text": "Celui qui lit les PS jusqu’au bout", "color": "black"},
  { "text": "Toi tu vas réussir ta vie", "color": "black"},
  { "text": "(Peut-être)", "color": "black"}
]

if(len(raw_ps) %4 != 3):
  print("Le nombre de PS n'est pas un multiple de 4")
  exit(1)

# =======================
# Génération automatique des IDs + insertion du PS spécial n°4
# =======================
ps_list = []

for i, ps in enumerate(raw_ps, start=1):
    # Si on atteint la position 4, on insère d'abord le PS spécial
    if i == 4:
        ps_list.append({
            "id": 4,
            "text": "Parce que 4 < 4",
            "color": "black"
        })
    # Puis on ajoute le PS normal, avec son ID automatique
    ps_list.append({
        "id": i if i < 4 else i + 1,
        "text": ps["text"],
        "color": ps["color"]
    })

# =======================
# Titre
# =======================
title = "Ravi de vous rencontrer mes chers ZZs"
intro = """
Il est enfin l’heure des listes...
<!-- ON VA ENFIN CHANGER CES VIEUX BIKERZZ -->
<strong>ET</strong> on a hâte de vous présenter <strong>Bandizz</strong>,
la liste préférée de ta liste préférée ! (cc Bra)
"""

signature = "C'était vos ReZZpo Comm de la liste Bandizz 🔫"

header_bg_color = "#FF4DAD"
divider_color = "#fefefe"

# =======================
# Template HTML
# =======================
html_template = """
<table style="margin: auto; max-width: 600px; width: 100%; border-collapse: collapse; font-family: 'Segoe UI','Lucida Sans',sans-serif">
  <tbody>
    <tr>
      <td style="padding: 0px;">
        <table style="border: 1px solid rgb(194, 196, 214); background-color: rgb(252, 252, 253); border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="
                  background-color: {{ header_bg_color }};
                  background-position: center; /* centre le motif */
                  padding: 20px; 
                  text-align: center;">
                <img alt="BDE Logo" style="width: auto; max-height: 200px; display: block; margin: 0px auto;" src="{{ bde_logo }}">
                <div style="width: 60px; height: 4px; background-color: {{ divider_color }}; margin: 15px auto;"></div>
                <span style="
                    display: inline-block;
                    background-color: black;
                    padding: 5px 5px;
                    border-radius: 5px;">
                  <p style="
                      color: white;
                      margin: 0;
                      font-size: 16px;
                      letter-spacing: 3px;
                      text-transform: uppercase;
                      font-weight: bold;">
                    {{ title }}
                  </p>
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 3mm;">
                <p style="font-size: 20px; line-height: 1.6; color: #333;">
                  Heyy les ZZs ! 
                </p>
                <p style="font-size: 20px; line-height: 1.6; color: #333;">
                  {{ intro | safe }}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 3mm; text-align:center;">
                <img alt="BikerZZ Logo" style="width: auto; max-height: 100px; display: block; margin: 0px auto;" src="{{ bikerzz_logo }}">
                <p style="margin-top: 0">{{ signature | safe }}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 3mm;">
                {% for ps in ps_list %}
                  <p style="color: {{ ps.color }}; font-size: 16px; line-height: 1.4;">
                    <strong>PS {{ ps.id }}</strong> : {{ ps.text }}
                  </p>
                {% endfor %}
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
"""

# =======================
# Génération HTML
# =======================
template = Template(html_template)
html_output = template.render(
    bde_logo=first_logo,
    bikerzz_logo=end_logo,
    ps_list=ps_list,
    title=title,
    intro=intro,
    signature=signature, 
    header_bg_color=header_bg_color,
    divider_color=divider_color
)

# =======================
# Sauvegarde dans un fichier
# =======================
with open("email_generated.html", "w", encoding="utf-8") as f:
    f.write(html_output)

print("Email HTML généré avec succès !")
