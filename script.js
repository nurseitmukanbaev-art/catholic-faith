// ============================================================
// SHARED JAVASCRIPT for the whole site.
// Right now it just controls the dark/light toggle.
// Every page links to this file, so the toggle works everywhere.
// ============================================================

// Grab the <html> element and the toggle button.
const html = document.documentElement;          // the <html> tag
const button = document.getElementById("themeButton");

// Runs every time the toggle button is clicked.
function toggleTheme() {
  const isDark = html.getAttribute("data-theme") === "dark";

  if (isDark) {
    // dark -> light
    html.removeAttribute("data-theme");
    button.textContent = "🌙";
    localStorage.setItem("theme", "light");
  } else {
    // light -> dark
    html.setAttribute("data-theme", "dark");
    button.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  }
}

// On page load, restore the theme the user picked last time.
if (localStorage.getItem("theme") === "dark") {
  html.setAttribute("data-theme", "dark");
  if (button) button.textContent = "☀️";
}

// ============================================================
// COLOR PALETTE (visitor-selectable: violet / cardinal / blue)
// Same idea as the theme: set a label on <html>, remember it.
// ============================================================

// Runs when the visitor clicks one of the color dots.
function setPalette(name) {
  html.setAttribute("data-palette", name);     // e.g. data-palette="blue"
  localStorage.setItem("palette", name);       // remember the choice
  updateSwatches(name);                         // show the ring on the active dot
}

// Puts the "active" ring on whichever dot matches the current palette.
function updateSwatches(name) {
  document.querySelectorAll(".swatch").forEach(function (dot) {
    // dot.dataset.palette reads the data-palette="..." on each dot.
    dot.classList.toggle("active", dot.dataset.palette === name);
  });
}

// On page load, restore the saved palette (default to violet).
const savedPalette = localStorage.getItem("palette") || "violet";
html.setAttribute("data-palette", savedPalette);
updateSwatches(savedPalette);

// ============================================================
// LANGUAGE (EN / FR site-wide)
// Same idea again: a label on <html>, remembered in storage.
// ============================================================
function setLang(code) {
  html.setAttribute("data-lang", code);     // e.g. data-lang="fr"
  localStorage.setItem("lang", code);
  updateLangButtons(code);
}

function updateLangButtons(code) {
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.lang === code);
  });
}

// Restore the saved language (default to English).
const savedLang = localStorage.getItem("lang") || "en";
html.setAttribute("data-lang", savedLang);
updateLangButtons(savedLang);

// ============================================================
// LATIN TITLES (rosary page only)
// A simple on/off toggle. The button only exists on the rosary
// page, so we guard against it being missing elsewhere.
// ============================================================
function toggleLatin() {
  const on = html.getAttribute("data-latin") === "on";
  if (on) {
    html.removeAttribute("data-latin");
    localStorage.setItem("latin", "off");
  } else {
    html.setAttribute("data-latin", "on");
    localStorage.setItem("latin", "on");
  }
  updateLatinButton();
}

function updateLatinButton() {
  const btn = document.getElementById("latinButton");
  if (!btn) return;                          // not on this page — do nothing
  btn.classList.toggle("active", html.getAttribute("data-latin") === "on");
}

// Restore the saved Latin setting.
if (localStorage.getItem("latin") === "on") {
  html.setAttribute("data-latin", "on");
}
updateLatinButton();

// ============================================================
// PRAYER OF THE DAY (home page only)
// One prayer is chosen from the list below using today's date,
// so it stays the same all day for everyone and changes at
// midnight. To add a prayer to the rotation, copy one { ... }
// block and fill in the English and French name + text.
// ============================================================
// To force one prayer to always show (instead of the date rotation),
// set this to its name_en. Leave it as "" for the normal daily rotation.
const pinnedPrayer = "Prayer Before a Crucifix";

const dailyPrayers = [
  {
    name_en: "The Memorare",
    name_fr: "Le Memorare (Souvenez-vous)",
    text_en: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother; to thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.",
    text_fr: "Souvenez-vous, ô très miséricordieuse Vierge Marie, qu'on n'a jamais entendu dire qu'aucun de ceux qui ont eu recours à votre protection, imploré votre assistance ou réclamé vos suffrages, ait été abandonné. Animé d'une pareille confiance, ô Vierge des vierges, ô ma Mère, vers vous je cours ; à vous je viens ; et, gémissant sous le poids de mes péchés, je me prosterne à vos pieds. Ô Mère du Verbe incarné, ne méprisez pas mes prières, mais, dans votre clémence, écoutez-moi et exaucez-moi. Amen.",
  },
  {
    name_en: "An Act of Contrition",
    name_fr: "Un Acte de Contrition",
    text_en: "O my God, I am heartily sorry for having offended thee, and I detest all my sins, because I dread the loss of heaven; but most of all because they offend thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of thy grace, to confess my sins, to do penance, and to amend my life. Amen.",
    text_fr: "Mon Dieu, j'ai un très grand regret de vous avoir offensé, parce que vous êtes infiniment bon, infiniment aimable, et que le péché vous déplaît. Je prends la ferme résolution, avec le secours de votre sainte grâce, de ne plus vous offenser et de faire pénitence. Amen.",
  },
  {
    name_en: "The Angelus",
    name_fr: "L'Angélus",
    text_en: "The Angel of the Lord declared unto Mary, and she conceived of the Holy Spirit. Hail Mary… Behold the handmaid of the Lord; be it done unto me according to thy word. Hail Mary… And the Word was made flesh, and dwelt among us. Hail Mary… Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.",
    text_fr: "L'Ange du Seigneur apporta l'annonce à Marie, et elle conçut du Saint-Esprit. Je vous salue, Marie… Voici la servante du Seigneur ; qu'il me soit fait selon votre parole. Je vous salue, Marie… Et le Verbe s'est fait chair, et il a habité parmi nous. Je vous salue, Marie… Priez pour nous, sainte Mère de Dieu, afin que nous soyons rendus dignes des promesses du Christ. Amen.",
  },
  {
    name_en: "The Hail Holy Queen",
    name_fr: "Le Salve Regina",
    text_en: "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Amen.",
    text_fr: "Salut, ô Reine, Mère de miséricorde, notre vie, notre douceur et notre espérance, salut ! Enfants d'Ève, exilés, nous crions vers vous ; vers vous nous soupirons, gémissant et pleurant dans cette vallée de larmes. Ô vous, notre avocate, tournez vers nous vos regards miséricordieux. Et, après cet exil, montrez-nous Jésus, le fruit béni de vos entrailles. Ô clémente, ô miséricordieuse, ô douce Vierge Marie. Amen.",
  },
  {
    name_en: "The Apostles' Creed",
    name_fr: "Le Symbole des Apôtres",
    text_en: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
    text_fr: "Je crois en Dieu, le Père tout-puissant, Créateur du ciel et de la terre. Et en Jésus-Christ, son Fils unique, notre Seigneur, qui a été conçu du Saint-Esprit, est né de la Vierge Marie, a souffert sous Ponce Pilate, a été crucifié, est mort et a été enseveli, est descendu aux enfers, le troisième jour est ressuscité des morts, est monté aux cieux, est assis à la droite de Dieu le Père tout-puissant, d'où il viendra juger les vivants et les morts. Je crois en l'Esprit-Saint, à la sainte Église catholique, à la communion des saints, à la rémission des péchés, à la résurrection de la chair, à la vie éternelle. Amen.",
  },
  {
    name_en: "Prayer to St. Michael",
    name_fr: "Prière à Saint Michel",
    text_en: "Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.",
    text_fr: "Saint Michel Archange, défendez-nous dans le combat ; soyez notre secours contre la malice et les embûches du démon. Que Dieu lui commande, nous vous en supplions ; et vous, Prince de la milice céleste, par la puissance divine, repoussez en enfer Satan et les autres esprits mauvais qui rôdent dans le monde pour la perte des âmes. Amen.",
  },
  {
    name_en: "Anima Christi (Soul of Christ)",
    name_fr: "Anima Christi (Âme du Christ)",
    text_en: "Soul of Christ, sanctify me. Body of Christ, save me. Blood of Christ, inebriate me. Water from the side of Christ, wash me. Passion of Christ, strengthen me. O good Jesus, hear me. Within thy wounds hide me. Suffer me not to be separated from thee. From the malicious enemy defend me. In the hour of my death call me, and bid me come unto thee, that with thy saints I may praise thee for ever and ever. Amen.",
    text_fr: "Âme du Christ, sanctifiez-moi. Corps du Christ, sauvez-moi. Sang du Christ, enivrez-moi. Eau du côté du Christ, lavez-moi. Passion du Christ, fortifiez-moi. Ô bon Jésus, exaucez-moi. Dans vos blessures, cachez-moi. Ne permettez pas que je sois séparé de vous. De l'ennemi maléfique, défendez-moi. À l'heure de ma mort, appelez-moi, et ordonnez-moi de venir à vous, afin qu'avec vos saints je vous loue dans les siècles des siècles. Amen.",
  },
  {
    name_en: "The Prayer of Saint Francis",
    name_fr: "La Prière de Saint François",
    text_en: "Lord, make me an instrument of your peace. Where there is hatred, let me sow love; where there is injury, pardon; where there is doubt, faith; where there is despair, hope; where there is darkness, light; and where there is sadness, joy. O Divine Master, grant that I may not so much seek to be consoled as to console; to be understood as to understand; to be loved as to love. For it is in giving that we receive; it is in pardoning that we are pardoned; and it is in dying that we are born to eternal life. Amen.",
    text_fr: "Seigneur, faites de moi un instrument de votre paix. Là où il y a de la haine, que je mette l'amour. Là où il y a l'offense, que je mette le pardon. Là où il y a la discorde, que je mette l'union. Là où il y a le doute, que je mette la foi. Là où il y a le désespoir, que je mette l'espérance. Là où il y a les ténèbres, que je mette votre lumière. Là où il y a la tristesse, que je mette la joie. Ô Maître, que je ne cherche pas tant à être consolé qu'à consoler, à être compris qu'à comprendre, à être aimé qu'à aimer. Car c'est en donnant qu'on reçoit, c'est en s'oubliant qu'on trouve, c'est en pardonnant qu'on est pardonné, c'est en mourant qu'on ressuscite à l'éternelle vie. Amen.",
  },
  {
    name_en: "Prayer Before a Crucifix",
    name_fr: "Prière devant un Crucifix",
    text_en: "Behold, O good and most sweet Jesus, I cast myself upon my knees in thy sight, and with the most fervent desire of my soul I pray and beseech thee that thou wouldst impress upon my heart lively sentiments of faith, hope and charity, with true repentance for my sins, and a firm purpose of amendment; while with deep affection and grief of soul I ponder within myself and mentally contemplate thy five most precious wounds, having before mine eyes that which David spoke in prophecy of thee: They have pierced my hands and my feet; they have numbered all my bones. Amen.",
    text_fr: "Me voici, ô bon et très doux Jésus, prosterné à genoux en votre présence. Je vous prie et vous supplie, avec toute la ferveur de mon âme, de daigner graver dans mon cœur de vifs sentiments de foi, d'espérance et de charité, un véritable repentir de mes péchés et une très ferme volonté de m'en corriger, tandis que je considère en moi-même et que je contemple en esprit, avec un grand amour et une vive douleur, vos cinq plaies très précieuses, ayant devant les yeux ce que le prophète David vous faisait dire : Ils ont percé mes mains et mes pieds, ils ont compté tous mes os. Amen.",
  },
];

// Fills the home-page section with today's prayer. Builds both an
// English and a French span so the EN/FR switch handles which one
// shows — exactly like the rest of the site.
function showDailyPrayer() {
  const nameEl = document.getElementById("dailyPrayerName");
  const textEl = document.getElementById("dailyPrayerText");
  if (!nameEl || !textEl) return;          // not on the home page — do nothing

  // Day-of-year (1–366). Same number all day, so the prayer is stable
  // and only rolls over at midnight.
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / 86400000);

  // If a prayer is pinned, show that one. Otherwise wrap with modulo
  // so we always land on a real entry in the list.
  const prayer =
    dailyPrayers.find(function (p) { return p.name_en === pinnedPrayer; }) ||
    dailyPrayers[dayOfYear % dailyPrayers.length];

  nameEl.innerHTML =
    '<span class="lang lang-en">' + prayer.name_en + "</span>" +
    '<span class="lang lang-fr">' + prayer.name_fr + "</span>";
  textEl.innerHTML =
    '<span class="lang lang-en">' + prayer.text_en + "</span>" +
    '<span class="lang lang-fr">' + prayer.text_fr + "</span>";
}
showDailyPrayer();

// ============================================================
// THE SAINTS (saints.html)
// Every saint lives here as one { ... } object. To ADD a saint,
// copy a block, change the fields, and save — the page builds the
// card and the search / category / sort / A–Z tools all update on
// their own. You never touch saints.html.
//
//   emoji      a single emoji for the round avatar
//   name_en/fr the saint's name in English / French
//   month, day the feast day (month 1–12). Used for "By Feast Month"
//              and to print the date in each language.
//   category   one of the keys in saintCategories below
//   tags_en/fr a few patronage words (the little chips on the card)
//   bio_en/fr  the short life story in each language
// ============================================================
const saintCategories = [
  { key: "holy-family", en: "Holy Family",          fr: "Sainte Famille" },
  { key: "apostles",    en: "Apostles",             fr: "Apôtres" },
  { key: "disciples",   en: "Disciples",            fr: "Disciples" },
  { key: "doctors",     en: "Doctors of the Church", fr: "Docteurs de l'Église" },
  { key: "religious",   en: "Religious & Founders",  fr: "Religieux et fondateurs" },
];

const monthNamesEn = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const monthNamesFr = ["janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const saints = [
  {
    emoji: "⭐", name_en: "The Blessed Virgin Mary", name_fr: "La Bienheureuse Vierge Marie",
    month: 1, day: 1, category: "holy-family",
    tags_en: ["Queen of Heaven", "All Christians"], tags_fr: ["Reine du Ciel", "Tous les chrétiens"],
    bio_en: "The Mother of Jesus and the greatest of all saints, full of grace and conceived without sin. By her humble \"yes\" she became the Mother of God, and she is venerated as Queen of Heaven and our spiritual mother.",
    bio_fr: "La Mère de Jésus et la plus grande de tous les saints, pleine de grâce et conçue sans péché. Par son humble « oui », elle est devenue la Mère de Dieu, et elle est vénérée comme Reine du Ciel et notre mère spirituelle.",
  },
  {
    emoji: "🔨", name_en: "St. Joseph", name_fr: "Saint Joseph",
    month: 3, day: 19, category: "holy-family",
    tags_en: ["Workers", "Fathers", "Happy Death"], tags_fr: ["Travailleurs", "Pères", "Bonne mort"],
    bio_en: "The foster father of Jesus and husband of Mary, a humble carpenter of Nazareth. A just and silent man, he is patron of the universal Church, of workers, and of a happy death.",
    bio_fr: "Le père nourricier de Jésus et l'époux de Marie, un humble charpentier de Nazareth. Homme juste et silencieux, il est le patron de l'Église universelle, des travailleurs et de la bonne mort.",
  },
  {
    emoji: "🔑", name_en: "St. Peter", name_fr: "Saint Pierre",
    month: 6, day: 29, category: "apostles",
    tags_en: ["Popes", "Fishermen"], tags_fr: ["Papes", "Pêcheurs"],
    bio_en: "A fisherman of Galilee whom Jesus made the first leader of the Church, entrusting to him the keys of the Kingdom. Though he denied the Lord, he repented and gave his life as a martyr in Rome — the first Pope.",
    bio_fr: "Un pêcheur de Galilée que Jésus établit comme premier chef de l'Église, lui confiant les clés du Royaume. Bien qu'il ait renié le Seigneur, il se repentit et donna sa vie comme martyr à Rome — le premier Pape.",
  },
  {
    emoji: "✉️", name_en: "St. Paul", name_fr: "Saint Paul",
    month: 6, day: 29, category: "apostles",
    tags_en: ["Missionaries", "Writers"], tags_fr: ["Missionnaires", "Écrivains"],
    bio_en: "Once a fierce persecutor of Christians, Saul was converted by a vision of the risen Christ on the road to Damascus. As the Apostle to the Gentiles, he carried the Gospel across the Roman world and wrote many of the New Testament letters.",
    bio_fr: "Autrefois farouche persécuteur des chrétiens, Saul fut converti par une vision du Christ ressuscité sur le chemin de Damas. Apôtre des nations, il porta l'Évangile à travers le monde romain et écrivit plusieurs lettres du Nouveau Testament.",
  },
  {
    emoji: "🏺", name_en: "St. Mary Magdalene", name_fr: "Sainte Marie-Madeleine",
    month: 7, day: 22, category: "disciples",
    tags_en: ["Penitents", "Converts"], tags_fr: ["Pénitents", "Convertis"],
    bio_en: "A devoted follower of Jesus, freed by him from seven demons, who stood faithfully at the foot of the cross. She was the first to witness the Resurrection, earning the title \"Apostle to the Apostles.\"",
    bio_fr: "Une fidèle disciple de Jésus, délivrée par lui de sept démons, qui se tint avec courage au pied de la croix. Elle fut la première à témoigner de la Résurrection, méritant le titre d'« Apôtre des Apôtres ».",
  },
  {
    emoji: "📖", name_en: "St. Augustine", name_fr: "Saint Augustin",
    month: 8, day: 28, category: "doctors",
    tags_en: ["Theologians", "Printers"], tags_fr: ["Théologiens", "Imprimeurs"],
    bio_en: "A brilliant teacher who lived a worldly youth before his dramatic conversion, moved by the prayers of his mother St. Monica. As Bishop of Hippo he became one of the greatest theologians of the Church, author of the Confessions.",
    bio_fr: "Un maître brillant qui mena une jeunesse mondaine avant sa conversion bouleversante, touché par les prières de sa mère sainte Monique. Évêque d'Hippone, il devint l'un des plus grands théologiens de l'Église, auteur des Confessions.",
  },
  {
    emoji: "📜", name_en: "St. Thomas Aquinas", name_fr: "Saint Thomas d'Aquin",
    month: 1, day: 28, category: "doctors",
    tags_en: ["Students", "Scholars"], tags_fr: ["Étudiants", "Universitaires"],
    bio_en: "A Dominican friar and the greatest theologian of the Middle Ages, called the \"Angelic Doctor.\" His masterwork, the Summa Theologiae, united faith and reason and still guides Catholic thought today.",
    bio_fr: "Frère dominicain et le plus grand théologien du Moyen Âge, appelé le « Docteur angélique ». Son chef-d'œuvre, la Somme théologique, unit la foi et la raison et guide encore aujourd'hui la pensée catholique.",
  },
  {
    emoji: "🐦", name_en: "St. Francis of Assisi", name_fr: "Saint François d'Assise",
    month: 10, day: 4, category: "religious",
    tags_en: ["Animals", "Ecology"], tags_fr: ["Animaux", "Écologie"],
    bio_en: "Born to a wealthy merchant, Francis renounced his riches to embrace \"Lady Poverty\" and follow Christ. Founder of the Franciscans and lover of all creation, he bore the wounds of Christ, the stigmata.",
    bio_fr: "Né d'un riche marchand, François renonça à ses richesses pour épouser « Dame Pauvreté » et suivre le Christ. Fondateur des Franciscains et amoureux de toute la création, il porta les plaies du Christ, les stigmates.",
  },
  {
    emoji: "🛡️", name_en: "St. Ignatius of Loyola", name_fr: "Saint Ignace de Loyola",
    month: 7, day: 31, category: "religious",
    tags_en: ["Soldiers", "Retreats"], tags_fr: ["Soldats", "Retraites"],
    bio_en: "A Spanish soldier whose conversion came while recovering from a battle wound. He founded the Society of Jesus, the Jesuits, and wrote the Spiritual Exercises, shaping countless souls \"for the greater glory of God.\"",
    bio_fr: "Un soldat espagnol dont la conversion survint alors qu'il se remettait d'une blessure de guerre. Il fonda la Compagnie de Jésus, les Jésuites, et écrivit les Exercices spirituels, façonnant d'innombrables âmes « pour la plus grande gloire de Dieu ».",
  },
  {
    emoji: "🌹", name_en: "St. Thérèse of Lisieux", name_fr: "Sainte Thérèse de Lisieux",
    month: 10, day: 1, category: "doctors",
    tags_en: ["Missions", "Florists"], tags_fr: ["Missions", "Fleuristes"],
    bio_en: "A Carmelite nun who died at just twenty-four, known as the \"Little Flower.\" Her \"little way\" of trusting, childlike love made her a Doctor of the Church and one of the most beloved modern saints.",
    bio_fr: "Une carmélite morte à seulement vingt-quatre ans, connue comme la « Petite Fleur ». Sa « petite voie » d'amour confiant et enfantin fit d'elle une Docteur de l'Église et l'une des saintes modernes les plus aimées.",
  },
];

// ----- The saints page: search, filter, sort & A–Z rendering -----
// These remember the visitor's current choices between re-renders.
let activeCategory = "all";   // "all" or a category key
let saintSort = "name";       // "name" (A–Z) or "month" (Jan–Dec)

// A saint's name for sorting/A–Z: drop a leading "St.", "Sts." or
// "The" so "St. Peter" files under P and "The Blessed..." under B.
function saintSortName(s) {
  return s.name_en.replace(/^(St\.?\s+|Sts\.?\s+|The\s+)/i, "");
}

// The feast date written out in each language (e.g. "June 29" / "29 juin").
function feastText(s, lang) {
  if (lang === "fr") {
    return (s.day === 1 ? "1er" : s.day) + " " + monthNamesFr[s.month - 1];
  }
  return monthNamesEn[s.month - 1] + " " + s.day;
}

// Builds one saint card's HTML.
function saintCardHtml(s) {
  let tags = "";
  for (let i = 0; i < s.tags_en.length; i++) {
    tags +=
      '<span class="saint-tag">' +
      '<span class="lang lang-en">' + s.tags_en[i] + "</span>" +
      '<span class="lang lang-fr">' + s.tags_fr[i] + "</span>" +
      "</span>";
  }
  return (
    '<article class="saint-card">' +
    '<div class="saint-avatar">' + s.emoji + "</div>" +
    '<h2 class="saint-name">' +
    '<span class="lang lang-en">' + s.name_en + "</span>" +
    '<span class="lang lang-fr">' + s.name_fr + "</span></h2>" +
    '<p class="saint-feast">📅 ' +
    '<span class="lang lang-en">' + feastText(s, "en") + "</span>" +
    '<span class="lang lang-fr">' + feastText(s, "fr") + "</span></p>" +
    '<div class="saint-tags">' + tags + "</div>" +
    '<p class="saint-bio">' +
    '<span class="lang lang-en">' + s.bio_en + "</span>" +
    '<span class="lang lang-fr">' + s.bio_fr + "</span></p>" +
    "</article>"
  );
}

// A full-width heading that splits the grid into sections (a letter
// in A–Z mode, a month name in feast-month mode).
function dividerHtml(label, id) {
  const idAttr = id ? ' id="' + id + '"' : "";
  return '<h2 class="saints-divider"' + idAttr + ">" + label + "</h2>";
}

// The main draw: read the search box, apply the category + search,
// sort, add section dividers, and paint the grid.
function renderSaints() {
  const grid = document.getElementById("saintsGrid");
  if (!grid) return;            // not on the saints page — do nothing

  const term = (document.getElementById("saintSearch").value || "")
    .trim().toLowerCase();

  // 1) Filter by category and search term (matches name or tags).
  let list = saints.filter(function (s) {
    if (activeCategory !== "all" && s.category !== activeCategory) return false;
    if (!term) return true;
    const haystack = (
      s.name_en + " " + s.name_fr + " " +
      s.tags_en.join(" ") + " " + s.tags_fr.join(" ")
    ).toLowerCase();
    return haystack.indexOf(term) !== -1;
  });

  // 2) Sort.
  list.sort(function (a, b) {
    if (saintSort === "month") {
      if (a.month !== b.month) return a.month - b.month;
      if (a.day !== b.day) return a.day - b.day;
    }
    return saintSortName(a).localeCompare(saintSortName(b));
  });

  // 3) Build the cards, inserting a divider whenever the section changes.
  if (list.length === 0) {
    grid.innerHTML =
      '<p class="saints-empty">' +
      '<span class="lang lang-en">No saints match your search.</span>' +
      '<span class="lang lang-fr">Aucun saint ne correspond à votre recherche.</span></p>';
    return;
  }

  let html = "";
  let lastSection = null;
  list.forEach(function (s) {
    if (saintSort === "month") {
      if (s.month !== lastSection) {
        lastSection = s.month;
        html += dividerHtml(
          '<span class="lang lang-en">' + monthNamesEn[s.month - 1] + "</span>" +
          '<span class="lang lang-fr">' +
            monthNamesFr[s.month - 1].charAt(0).toUpperCase() +
            monthNamesFr[s.month - 1].slice(1) + "</span>"
        );
      }
    } else {
      const letter = saintSortName(s).charAt(0).toUpperCase();
      if (letter !== lastSection) {
        lastSection = letter;
        html += dividerHtml(letter, "letter-" + letter);
      }
    }
    html += saintCardHtml(s);
  });
  grid.innerHTML = html;
}

// Build the category filter buttons (All + each category in use).
function buildCategoryButtons() {
  const bar = document.getElementById("categoryBar");
  if (!bar) return;
  const used = saints.map(function (s) { return s.category; });

  let html =
    '<button class="filter-btn active" data-cat="all" onclick="setSaintCategory(\'all\')">' +
    '<span class="lang lang-en">All</span><span class="lang lang-fr">Tous</span></button>';

  saintCategories.forEach(function (c) {
    if (used.indexOf(c.key) === -1) return;   // skip categories with no saints
    html +=
      '<button class="filter-btn" data-cat="' + c.key + '" onclick="setSaintCategory(\'' + c.key + '\')">' +
      '<span class="lang lang-en">' + c.en + "</span>" +
      '<span class="lang lang-fr">' + c.fr + "</span></button>";
  });
  bar.innerHTML = html;
}

// Build the A–Z jump bar (only the letters that actually have saints).
function buildAzBar() {
  const bar = document.getElementById("azBar");
  if (!bar) return;
  const letters = saints.map(function (s) {
    return saintSortName(s).charAt(0).toUpperCase();
  });
  const unique = letters.filter(function (l, i) {
    return letters.indexOf(l) === i;
  }).sort();

  bar.innerHTML = unique.map(function (l) {
    return '<button class="az-letter" onclick="jumpToLetter(\'' + l + '\')">' + l + "</button>";
  }).join("");
}

// Category button clicked.
function setSaintCategory(key) {
  activeCategory = key;
  document.querySelectorAll("#categoryBar .filter-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.cat === key);
  });
  renderSaints();
}

// Sort toggle clicked.
function setSaintSort(mode) {
  saintSort = mode;
  const nameBtn = document.getElementById("sortName");
  const monthBtn = document.getElementById("sortMonth");
  if (nameBtn) nameBtn.classList.toggle("active", mode === "name");
  if (monthBtn) monthBtn.classList.toggle("active", mode === "month");
  renderSaints();
}

// A–Z letter clicked: switch to alphabetical, then scroll to that letter.
function jumpToLetter(letter) {
  if (saintSort !== "name") setSaintSort("name");
  else renderSaints();
  const target = document.getElementById("letter-" + letter);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

// On the saints page, build the controls and draw the cards once.
buildCategoryButtons();
buildAzBar();
renderSaints();

// ============================================================
// HOME PAGE DAILY ELEMENTS
// Verse of the Day, today's date + liturgical season, and a link
// to today's Rosary. Each function quietly does nothing if its
// element isn't on the page, so this is safe on every page.
// ============================================================

// ----- Verse of the Day -----
// To add a verse, copy a { ... } line. Like the Prayer of the Day,
// one is chosen by today's date and changes at midnight.
const dailyVerses = [
  { text_en: "\"Be still, and know that I am God!\" — Psalm 46:10", text_fr: "« Arrêtez, et sachez que je suis Dieu. » — Psaume 46:10" },
  { text_en: "\"The Lord is my shepherd, I shall not want.\" — Psalm 23:1", text_fr: "« L'Éternel est mon berger : je ne manquerai de rien. » — Psaume 23:1" },
  { text_en: "\"I can do all things through him who strengthens me.\" — Philippians 4:13", text_fr: "« Je puis tout par celui qui me fortifie. » — Philippiens 4:13" },
  { text_en: "\"Come to me, all you that are weary and are carrying heavy burdens, and I will give you rest.\" — Matthew 11:28", text_fr: "« Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos. » — Matthieu 11:28" },
  { text_en: "\"For God so loved the world that he gave his only Son, so that everyone who believes in him may not perish but may have eternal life.\" — John 3:16", text_fr: "« Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle. » — Jean 3:16" },
  { text_en: "\"Trust in the Lord with all your heart, and do not rely on your own insight.\" — Proverbs 3:5", text_fr: "« Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse. » — Proverbes 3:5" },
  { text_en: "\"The Lord is my light and my salvation; whom shall I fear?\" — Psalm 27:1", text_fr: "« L'Éternel est ma lumière et mon salut : de qui aurais-je crainte ? » — Psaume 27:1" },
  { text_en: "\"Cast all your anxiety on him, because he cares for you.\" — 1 Peter 5:7", text_fr: "« Déchargez-vous sur lui de tous vos soucis, car lui-même prend soin de vous. » — 1 Pierre 5:7" },
  { text_en: "\"Rejoice in the Lord always; again I will say, Rejoice.\" — Philippians 4:4", text_fr: "« Réjouissez-vous toujours dans le Seigneur ; je le répète, réjouissez-vous. » — Philippiens 4:4" },
  { text_en: "\"This is my commandment, that you love one another as I have loved you.\" — John 15:12", text_fr: "« C'est ici mon commandement : aimez-vous les uns les autres, comme je vous ai aimés. » — Jean 15:12" },
];

function showDailyVerse() {
  const el = document.getElementById("verseText");
  if (!el) return;
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / 86400000);
  const v = dailyVerses[dayOfYear % dailyVerses.length];
  el.innerHTML =
    '<span class="lang lang-en">' + v.text_en + "</span>" +
    '<span class="lang lang-fr">' + v.text_fr + "</span>";
}

// ----- Today's date + liturgical season -----
const weekdaysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekdaysFr = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

// Easter Sunday for a given year (Meeus/Jones/Butcher algorithm).
function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);   // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// The liturgical season for a date: an EN/FR label and its color.
// (A close approximation of the Church calendar.)
function liturgicalSeason(now) {
  const year = now.getFullYear();
  const today = new Date(year, now.getMonth(), now.getDate());

  const easter = easterSunday(year);
  const ashWednesday = addDays(easter, -46);
  const pentecost = addDays(easter, 49);

  // Advent begins the 4th Sunday before Christmas.
  const christmas = new Date(year, 11, 25);
  const cDow = christmas.getDay();
  const adventStart = addDays(christmas, -(cDow === 0 ? 28 : 21 + cDow));

  // Christmas season runs to the Baptism of the Lord (Sunday after Jan 6).
  const epiphany = new Date(year, 0, 6);
  let baptism = addDays(epiphany, (7 - epiphany.getDay()) % 7);
  if (baptism.getTime() === epiphany.getTime()) baptism = addDays(baptism, 7);

  const violet = "#6b4ca3", gold = "#c9a227", green = "#1f7a4d";

  if (today >= adventStart && today < christmas) return { en: "Advent", fr: "Avent", color: violet };
  if (today >= christmas || today <= baptism)     return { en: "Christmas", fr: "Temps de Noël", color: gold };
  if (today >= ashWednesday && today < easter)    return { en: "Lent", fr: "Carême", color: violet };
  if (today >= easter && today <= pentecost)      return { en: "Easter", fr: "Temps pascal", color: gold };
  return { en: "Ordinary Time", fr: "Temps ordinaire", color: green };
}

function showTodayLine() {
  const el = document.getElementById("todayLine");
  if (!el) return;
  const now = new Date();
  const dow = now.getDay();
  const season = liturgicalSeason(now);
  const enDate = weekdaysEn[dow] + ", " + monthNamesEn[now.getMonth()] + " " + now.getDate();
  const frDate = weekdaysFr[dow] + " " + now.getDate() + " " + monthNamesFr[now.getMonth()];
  el.innerHTML =
    '<span class="season-dot" style="background:' + season.color + '"></span>' +
    '<span class="lang lang-en">' + enDate + " · " + season.en + "</span>" +
    '<span class="lang lang-fr">' + frDate + " · " + season.fr + "</span>";
}

// ----- Today's Rosary shortcut -----
// Weekday → mystery set, matching the schedule on rosaries.html
// (which also opens to today on its own when the link is followed).
function showTodayRosary() {
  const el = document.getElementById("todayRosaryLink");
  if (!el) return;
  const sets = [
    { en: "Glorious Mysteries", fr: "Mystères Glorieux" },   // Sunday
    { en: "Joyful Mysteries", fr: "Mystères Joyeux" },       // Monday
    { en: "Sorrowful Mysteries", fr: "Mystères Douloureux" },// Tuesday
    { en: "Glorious Mysteries", fr: "Mystères Glorieux" },   // Wednesday
    { en: "Luminous Mysteries", fr: "Mystères Lumineux" },   // Thursday
    { en: "Sorrowful Mysteries", fr: "Mystères Douloureux" },// Friday
    { en: "Joyful Mysteries", fr: "Mystères Joyeux" },       // Saturday
  ];
  const set = sets[new Date().getDay()];
  el.innerHTML =
    '<span class="lang lang-en">Today the Church prays the ' + set.en + "  →</span>" +
    '<span class="lang lang-fr">Aujourd\'hui, l\'Église prie les ' + set.fr + "  →</span>";
}

showDailyVerse();
showTodayLine();
showTodayRosary();
