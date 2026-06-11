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
// COLOR PALETTE (visitor-selectable: violet / cardinal / blue / green,
// plus "liturgical" which follows the Church year automatically).
// Same idea as the theme: set a label on <html>, remember it.
// ============================================================

// Applies a palette without changing storage. The liturgical option
// keeps data-palette="liturgical" for the active dot, then adds the
// season's real color in data-liturgical-palette.
function applyPalette(name) {
  html.setAttribute("data-palette", name);     // e.g. data-palette="blue"

  if (name === "liturgical") {
    const season = liturgicalSeason(new Date());
    html.setAttribute("data-liturgical-palette", season.palette || "green");
  } else {
    html.removeAttribute("data-liturgical-palette");
  }

  updateSwatches(name);                         // show the ring on the active dot
}

// Runs when the visitor clicks one of the color dots.
function setPalette(name) {
  localStorage.setItem("palette", name);       // remember the choice
  applyPalette(name);
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
applyPalette(savedPalette);

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
// MOBILE MENU + TEXT SIZE
// The hamburger only shows on phones. Text size is remembered
// between visits with the same storage pattern as theme/language.
// ============================================================
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  const menuButton = document.getElementById("menuButton");
  if (!nav || !menuButton) return;

  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

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
  { key: "bishops",     en: "Bishops",               fr: "Évêques" },
  { key: "martyrs",     en: "Martyrs",               fr: "Martyrs" },
  { key: "mystics",     en: "Mystics",               fr: "Mystiques" },
  { key: "lay-saints",  en: "Lay Saints",            fr: "Saints laïcs" },
  { key: "modern",      en: "Modern Saints",         fr: "Saints modernes" },
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
  {
    emoji: "🍞", name_en: "St. Anthony of Padua", name_fr: "Saint Antoine de Padoue",
    month: 6, day: 13, category: "doctors",
    tags_en: ["Lost Items", "The Poor", "Preachers"], tags_fr: ["Objets perdus", "Pauvres", "Prédicateurs"],
    bio_en: "Anthony was a Franciscan friar whose preaching drew crowds because it joined learning with deep love for Christ. He is remembered for his care for the poor, his clear teaching, and the many people who ask his help in finding what is lost.",
    bio_fr: "Antoine fut un frère franciscain dont la prédication attirait les foules, car elle unissait la science à un profond amour du Christ. On se souvient de sa sollicitude pour les pauvres, de son enseignement limpide et de l'aide qu'on lui demande pour retrouver ce qui est perdu.",
  },
  {
    emoji: "🏰", name_en: "St. Teresa of Ávila", name_fr: "Sainte Thérèse d'Avila",
    month: 10, day: 15, category: "doctors",
    tags_en: ["Prayer", "Carmelites", "Spiritual Writers"], tags_fr: ["Prière", "Carmélites", "Auteurs spirituels"],
    bio_en: "Teresa renewed the Carmelite order with courage, humor, and a burning desire for God. Her writings on prayer and the interior life still guide Christians toward friendship with Christ.",
    bio_fr: "Thérèse renouvela l'ordre du Carmel avec courage, humour et un ardent désir de Dieu. Ses écrits sur la prière et la vie intérieure guident encore les chrétiens vers l'amitié avec le Christ.",
  },
  {
    emoji: "🕊️", name_en: "St. John Paul II", name_fr: "Saint Jean-Paul II",
    month: 10, day: 22, category: "modern",
    tags_en: ["Youth", "Families", "Popes"], tags_fr: ["Jeunes", "Familles", "Papes"],
    bio_en: "Karol Wojtyła became Pope John Paul II after years of faithful ministry in Poland under oppression. He preached the dignity of every person, strengthened families and young people, and reminded the world to be not afraid.",
    bio_fr: "Karol Wojtyła devint le pape Jean-Paul II après des années de ministère fidèle en Pologne sous l'oppression. Il proclama la dignité de toute personne, fortifia les familles et les jeunes, et rappela au monde de ne pas avoir peur.",
  },
  {
    emoji: "✋", name_en: "St. Padre Pio", name_fr: "Saint Padre Pio",
    month: 9, day: 23, category: "religious",
    tags_en: ["Confessors", "Suffering", "Prayer"], tags_fr: ["Confesseurs", "Souffrance", "Prière"],
    bio_en: "Known as Padre Pio, this Capuchin priest spent long hours hearing confessions and carrying the wounds of Christ in his body. He taught people to pray, hope, and trust God's mercy even in suffering.",
    bio_fr: "Connu sous le nom de Padre Pio, ce prêtre capucin passait de longues heures au confessionnal et porta dans son corps les plaies du Christ. Il enseigna aux fidèles à prier, à espérer et à faire confiance à la miséricorde de Dieu même dans la souffrance.",
  },
  {
    emoji: "🖋️", name_en: "St. Catherine of Siena", name_fr: "Sainte Catherine de Sienne",
    month: 4, day: 29, category: "doctors",
    tags_en: ["Europe", "Peacemakers", "Nurses"], tags_fr: ["Europe", "Artisans de paix", "Infirmiers"],
    bio_en: "Catherine was a Dominican tertiary whose holiness gave her influence far beyond her young age. She served the sick, worked for peace, and urged the Pope to return to Rome with fearless love for the Church.",
    bio_fr: "Catherine fut une tertiaire dominicaine dont la sainteté lui donna une influence bien au-delà de son jeune âge. Elle servit les malades, travailla pour la paix et exhorta le pape à revenir à Rome avec un amour intrépide pour l'Église.",
  },
  {
    emoji: "🕯️", name_en: "St. Maximilian Kolbe", name_fr: "Saint Maximilien Kolbe",
    month: 8, day: 14, category: "martyrs",
    tags_en: ["Prisoners", "Families", "Media"], tags_fr: ["Prisonniers", "Familles", "Médias"],
    bio_en: "Maximilian was a Franciscan priest devoted to Mary and bold in using print media for evangelization. In Auschwitz he offered his life in place of another prisoner, showing the victory of charity in the darkest place.",
    bio_fr: "Maximilien fut un prêtre franciscain dévoué à Marie et audacieux dans l'usage de la presse pour l'évangélisation. À Auschwitz, il offrit sa vie à la place d'un autre prisonnier, manifestant la victoire de la charité dans le lieu le plus sombre.",
  },
  {
    emoji: "💧", name_en: "St. Faustina Kowalska", name_fr: "Sainte Faustine Kowalska",
    month: 10, day: 5, category: "mystics",
    tags_en: ["Divine Mercy", "Mercy", "Diary Writers"], tags_fr: ["Miséricorde divine", "Miséricorde", "Journaux spirituels"],
    bio_en: "Faustina was a humble Polish sister entrusted with a message of Divine Mercy. Her diary helped spread devotion to Jesus' mercy and the simple prayer, \"Jesus, I trust in you.\"",
    bio_fr: "Faustine fut une humble religieuse polonaise à qui fut confié un message de Miséricorde divine. Son journal contribua à répandre la dévotion à la miséricorde de Jésus et la simple prière : « Jésus, j'ai confiance en vous. »",
  },
  {
    emoji: "⛲", name_en: "St. Bernadette Soubirous", name_fr: "Sainte Bernadette Soubirous",
    month: 4, day: 16, category: "mystics",
    tags_en: ["Lourdes", "The Sick", "Humility"], tags_fr: ["Lourdes", "Malades", "Humilité"],
    bio_en: "Bernadette was a poor young girl from Lourdes who saw the Blessed Virgin Mary at the grotto of Massabielle. She remained humble under attention and later lived quietly as a religious sister.",
    bio_fr: "Bernadette fut une pauvre jeune fille de Lourdes qui vit la Bienheureuse Vierge Marie à la grotte de Massabielle. Elle demeura humble malgré l'attention qu'elle reçut et vécut ensuite discrètement comme religieuse.",
  },
  {
    emoji: "🙏", name_en: "St. Monica", name_fr: "Sainte Monique",
    month: 8, day: 27, category: "lay-saints",
    tags_en: ["Mothers", "Difficult Marriages", "Conversions"], tags_fr: ["Mères", "Mariages difficiles", "Conversions"],
    bio_en: "Monica prayed for years for the conversion of her son Augustine and never stopped hoping in God's mercy. Her patient tears and faithful love helped prepare one of the Church's greatest teachers.",
    bio_fr: "Monique pria pendant des années pour la conversion de son fils Augustin et ne cessa jamais d'espérer en la miséricorde de Dieu. Ses larmes patientes et son amour fidèle préparèrent l'un des plus grands maîtres de l'Église.",
  },
  {
    emoji: "📘", name_en: "St. Benedict", name_fr: "Saint Benoît",
    month: 7, day: 11, category: "religious",
    tags_en: ["Europe", "Monks", "Students"], tags_fr: ["Europe", "Moines", "Étudiants"],
    bio_en: "Benedict founded monasteries and wrote a Rule that balanced prayer, work, silence, and charity. His wisdom shaped Western monastic life and helped preserve faith and learning through troubled centuries.",
    bio_fr: "Benoît fonda des monastères et écrivit une Règle qui équilibre la prière, le travail, le silence et la charité. Sa sagesse façonna la vie monastique occidentale et aida à préserver la foi et le savoir durant des siècles difficiles.",
  },
  {
    emoji: "☘️", name_en: "St. Patrick", name_fr: "Saint Patrick",
    month: 3, day: 17, category: "bishops",
    tags_en: ["Ireland", "Missionaries", "Captives"], tags_fr: ["Irlande", "Missionnaires", "Captifs"],
    bio_en: "Patrick was taken to Ireland as a slave, escaped, and later returned as a bishop to preach the Gospel. His forgiving heart and missionary courage helped bring a whole people to Christ.",
    bio_fr: "Patrick fut emmené en Irlande comme esclave, s'échappa, puis y retourna comme évêque pour annoncer l'Évangile. Son cœur plein de pardon et son courage missionnaire aidèrent tout un peuple à venir au Christ.",
  },
  {
    emoji: "🎁", name_en: "St. Nicholas", name_fr: "Saint Nicolas",
    month: 12, day: 6, category: "bishops",
    tags_en: ["Children", "Sailors", "Generosity"], tags_fr: ["Enfants", "Marins", "Générosité"],
    bio_en: "Nicholas was a bishop of Myra remembered for his defense of the faith and his secret generosity to people in need. Stories of his kindness made him one of the most beloved saints in Christian tradition.",
    bio_fr: "Nicolas fut évêque de Myre, connu pour sa défense de la foi et sa générosité discrète envers les personnes dans le besoin. Les récits de sa bonté ont fait de lui l'un des saints les plus aimés de la tradition chrétienne.",
  },
  {
    emoji: "🎶", name_en: "St. Cecilia", name_fr: "Sainte Cécile",
    month: 11, day: 22, category: "martyrs",
    tags_en: ["Music", "Singers", "Poets"], tags_fr: ["Musique", "Chanteurs", "Poètes"],
    bio_en: "Cecilia is honored as a Roman martyr whose heart belonged wholly to Christ. Tradition remembers her singing to God even amid suffering, making her the patroness of sacred music.",
    bio_fr: "Cécile est honorée comme une martyre romaine dont le cœur appartenait entièrement au Christ. La tradition se souvient qu'elle chantait pour Dieu même au milieu de la souffrance, ce qui fait d'elle la patronne de la musique sacrée.",
  },
  {
    emoji: "👁️", name_en: "St. Lucy", name_fr: "Sainte Lucie",
    month: 12, day: 13, category: "martyrs",
    tags_en: ["Sight", "Purity", "Martyrs"], tags_fr: ["Vue", "Pureté", "Martyrs"],
    bio_en: "Lucy was a young Christian of Sicily who chose fidelity to Christ over comfort and safety. Her name means light, and her witness continues to shine as a sign of purity and courage.",
    bio_fr: "Lucie fut une jeune chrétienne de Sicile qui choisit la fidélité au Christ plutôt que le confort et la sécurité. Son nom signifie lumière, et son témoignage continue de briller comme signe de pureté et de courage.",
  },
  {
    emoji: "🏜️", name_en: "St. Anthony the Great", name_fr: "Saint Antoine le Grand",
    month: 1, day: 17, category: "religious",
    tags_en: ["Monks", "Hermits", "Spiritual Warfare"], tags_fr: ["Moines", "Ermites", "Combat spirituel"],
    bio_en: "Anthony left his wealth behind to seek God in the desert, becoming a father of monastic life. His discipline, wisdom, and perseverance inspired countless Christians to follow Christ more completely.",
    bio_fr: "Antoine quitta ses richesses pour chercher Dieu au désert, devenant un père de la vie monastique. Sa discipline, sa sagesse et sa persévérance inspirèrent d'innombrables chrétiens à suivre le Christ plus pleinement.",
  },
  {
    emoji: "📿", name_en: "St. Dominic", name_fr: "Saint Dominique",
    month: 8, day: 8, category: "religious",
    tags_en: ["Preachers", "Rosary", "Theologians"], tags_fr: ["Prédicateurs", "Rosaire", "Théologiens"],
    bio_en: "Dominic founded the Order of Preachers to teach the faith with clarity, poverty, and zeal. He loved truth deeply and sent his friars to bring the Gospel wherever confusion and doubt had taken root.",
    bio_fr: "Dominique fonda l'Ordre des Prêcheurs pour enseigner la foi avec clarté, pauvreté et zèle. Il aimait profondément la vérité et envoya ses frères porter l'Évangile là où la confusion et le doute s'étaient enracinés.",
  },
  {
    emoji: "🌿", name_en: "St. Clare of Assisi", name_fr: "Sainte Claire d'Assise",
    month: 8, day: 11, category: "religious",
    tags_en: ["Poor Clares", "Poverty", "Television"], tags_fr: ["Clarisses", "Pauvreté", "Télévision"],
    bio_en: "Clare followed the example of Francis of Assisi and founded the Poor Clares, embracing radical poverty for love of Christ. Her quiet strength and Eucharistic faith made her a light for the whole Church.",
    bio_fr: "Claire suivit l'exemple de François d'Assise et fonda les Clarisses, embrassant une pauvreté radicale par amour du Christ. Sa force paisible et sa foi eucharistique firent d'elle une lumière pour toute l'Église.",
  },
  {
    emoji: "🌸", name_en: "St. Rita of Cascia", name_fr: "Sainte Rita de Cascia",
    month: 5, day: 22, category: "religious",
    tags_en: ["Impossible Causes", "Marriage", "Peace"], tags_fr: ["Causes impossibles", "Mariage", "Paix"],
    bio_en: "Rita knew the sorrows of family conflict, widowhood, and religious life, yet she answered each trial with forgiveness. She is loved as a patroness of impossible causes because her life shows how grace can heal deep wounds.",
    bio_fr: "Rita connut les douleurs des conflits familiaux, du veuvage et de la vie religieuse, mais répondit à chaque épreuve par le pardon. Elle est aimée comme patronne des causes impossibles, car sa vie montre comment la grâce peut guérir les blessures profondes.",
  },
  {
    emoji: "👵", name_en: "St. Anne", name_fr: "Sainte Anne",
    month: 7, day: 26, category: "holy-family",
    tags_en: ["Grandparents", "Mothers", "Families"], tags_fr: ["Grands-parents", "Mères", "Familles"],
    bio_en: "Anne is honored by tradition as the mother of the Blessed Virgin Mary and the grandmother of Jesus. She reminds families that holiness is often formed quietly through faithful love across generations.",
    bio_fr: "Anne est honorée par la tradition comme la mère de la Bienheureuse Vierge Marie et la grand-mère de Jésus. Elle rappelle aux familles que la sainteté se forme souvent discrètement par un amour fidèle à travers les générations.",
  },
  {
    emoji: "🧭", name_en: "St. Jude", name_fr: "Saint Jude",
    month: 10, day: 28, category: "apostles",
    tags_en: ["Hope", "Difficult Causes", "Apostles"], tags_fr: ["Espérance", "Causes difficiles", "Apôtres"],
    bio_en: "Jude was one of the Twelve Apostles and is traditionally invoked when situations seem desperate. His short New Testament letter urges believers to remain faithful, pray in the Holy Spirit, and trust God's mercy.",
    bio_fr: "Jude fut l'un des Douze Apôtres et il est traditionnellement invoqué lorsque les situations semblent désespérées. Sa brève lettre du Nouveau Testament exhorte les croyants à demeurer fidèles, à prier dans l'Esprit Saint et à faire confiance à la miséricorde de Dieu.",
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

function firstSentence(text) {
  const parts = text.split(". ");
  return parts[0] + (parts.length > 1 ? "." : "");
}

// Fills the home-page Saint of the Day card from the saints array.
function showSaintOfDay() {
  const avatarEl = document.getElementById("dailySaintAvatar");
  const nameEl = document.getElementById("dailySaintName");
  const feastEl = document.getElementById("dailySaintFeast");
  const bioEl = document.getElementById("dailySaintBio");
  if (!avatarEl || !nameEl || !feastEl || !bioEl) return;

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / 86400000);
  const saint = saints[dayOfYear % saints.length];

  avatarEl.textContent = saint.emoji;
  nameEl.innerHTML = langHtml(saint.name_en, saint.name_fr);
  feastEl.innerHTML =
    "📅 " + langHtml(feastText(saint, "en"), feastText(saint, "fr"));
  bioEl.innerHTML = langHtml(firstSentence(saint.bio_en), firstSentence(saint.bio_fr));
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
showSaintOfDay();

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

function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
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

  const gaudeteSunday = addDays(adventStart, 14); // 3rd Sunday of Advent
  const laetareSunday = addDays(easter, -21);     // 4th Sunday of Lent

  const colors = {
    violet: "#6b4ca3",
    gold: "#c9a227",
    green: "#1f7a4d",
    rose: "#c86f93",
  };

  if (today >= adventStart && today < christmas) {
    const palette = sameDate(today, gaudeteSunday) ? "rose" : "violet";
    return { en: "Advent", fr: "Avent", palette: palette, color: colors[palette] };
  }
  if (today >= christmas || today <= baptism) {
    return { en: "Christmas", fr: "Temps de Noël", palette: "gold", color: colors.gold };
  }
  if (today >= ashWednesday && today < easter) {
    const palette = sameDate(today, laetareSunday) ? "rose" : "violet";
    return { en: "Lent", fr: "Carême", palette: palette, color: colors[palette] };
  }
  if (today >= easter && today <= pentecost) {
    return { en: "Easter", fr: "Temps pascal", palette: "gold", color: colors.gold };
  }
  return { en: "Ordinary Time", fr: "Temps ordinaire", palette: "green", color: colors.green };
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

// ============================================================
// GUIDED PRAYER MODE (rosary + stations pages)
// A shared full-screen stepper. Each page passes in the steps it
// needs, and this code handles the overlay, progress, and buttons.
// ============================================================
function langHtml(en, fr) {
  return '<span class="lang lang-en">' + en + "</span>" +
    '<span class="lang lang-fr">' + fr + "</span>";
}

// A prayer name that links to its full text on the Prayers page.
// The anchor is the card's id in prayers.html (e.g. "our-father").
// Opens in a new tab so you don't lose your place in the guide.
function prayerLinkHtml(anchor, en, fr) {
  return '<a class="guide-prayer-link" href="./prayers.html#' + anchor +
    '" target="_blank" rel="noopener">' + langHtml(en, fr) + "</a>";
}

function openPrayerGuide(steps) {
  if (!steps || steps.length === 0) return;

  const oldGuide = document.querySelector(".prayer-guide");
  if (oldGuide) oldGuide.remove();

  const guideReturnFocus = document.activeElement;
  let index = 0;

  const guide = document.createElement("div");
  guide.className = "prayer-guide";
  guide.setAttribute("role", "dialog");
  guide.setAttribute("aria-modal", "true");
  guide.innerHTML =
    '<div class="prayer-guide-card">' +
      '<div class="guide-header">' +
        '<p class="guide-progress" id="guideProgress"></p>' +
        '<button class="guide-close" id="guideClose" type="button">' +
          langHtml("Close", "Fermer") +
        "</button>" +
      "</div>" +
      '<div class="guide-step">' +
        '<p class="guide-subtitle" id="guideSubtitle"></p>' +
        '<h2 class="guide-title" id="guideTitle"></h2>' +
        '<div class="guide-content" id="guideContent"></div>' +
      "</div>" +
      '<div class="guide-controls">' +
        '<button class="guide-btn" id="guidePrev" type="button">' +
          langHtml("Previous", "Précédent") +
        "</button>" +
        '<button class="guide-btn primary" id="guideNext" type="button"></button>' +
      "</div>" +
    "</div>";

  document.body.appendChild(guide);
  document.body.classList.add("guide-open");

  const progressEl = document.getElementById("guideProgress");
  const subtitleEl = document.getElementById("guideSubtitle");
  const titleEl = document.getElementById("guideTitle");
  const contentEl = document.getElementById("guideContent");
  const closeBtn = document.getElementById("guideClose");
  const prevBtn = document.getElementById("guidePrev");
  const nextBtn = document.getElementById("guideNext");

  function closeGuide() {
    document.removeEventListener("keydown", guideKeydown);
    guide.remove();
    document.body.classList.remove("guide-open");
    if (guideReturnFocus && guideReturnFocus.focus) {
      guideReturnFocus.focus();
    }
  }

  function renderGuideStep() {
    const step = steps[index];
    progressEl.innerHTML = step.progress;
    subtitleEl.innerHTML = step.subtitle || "";
    subtitleEl.hidden = !step.subtitle;
    titleEl.innerHTML = step.title;
    contentEl.innerHTML = step.content;
    prevBtn.disabled = index === 0;
    nextBtn.innerHTML = index === steps.length - 1
      ? langHtml("Finish", "Terminer")
      : langHtml("Next", "Suivant");
  }

  function guideKeydown(event) {
    if (event.key === "Escape") closeGuide();
    if (event.key === "ArrowLeft" && index > 0) {
      index -= 1;
      renderGuideStep();
    }
    if (event.key === "ArrowRight") {
      if (index === steps.length - 1) {
        closeGuide();
      } else {
        index += 1;
        renderGuideStep();
      }
    }
  }

  closeBtn.addEventListener("click", closeGuide);
  prevBtn.addEventListener("click", function () {
    if (index === 0) return;
    index -= 1;
    renderGuideStep();
  });
  nextBtn.addEventListener("click", function () {
    if (index === steps.length - 1) {
      closeGuide();
      return;
    }
    index += 1;
    renderGuideStep();
  });
  document.addEventListener("keydown", guideKeydown);

  renderGuideStep();
  nextBtn.focus();
}

function rosaryOpeningStep(setNameHtml) {
  return {
    progress: langHtml("Opening", "Ouverture"),
    subtitle: setNameHtml,
    title: langHtml("Begin the Rosary", "Commencer le Rosaire"),
    content:
      '<p class="guide-body-text">' +
        langHtml(
          "Make the Sign of the Cross, then pray the opening prayers before the first mystery.",
          "Faites le signe de la Croix, puis priez les prières d'ouverture avant le premier mystère."
        ) +
      "</p>" +
      '<ul class="guide-prayer-list">' +
        "<li>" + prayerLinkHtml("sign-of-the-cross", "Sign of the Cross", "Signe de la Croix") + "</li>" +
        "<li>" + prayerLinkHtml("apostles-creed", "Apostles' Creed", "Symbole des Apôtres") + "</li>" +
        "<li>" + prayerLinkHtml("our-father", "Our Father", "Notre Père") + "</li>" +
        "<li>" + prayerLinkHtml("hail-mary", "Three Hail Marys", "Trois Je vous salue Marie") + "</li>" +
        "<li>" + prayerLinkHtml("glory-be", "Glory Be", "Gloire au Père") + "</li>" +
      "</ul>",
  };
}

function rosaryClosingStep(setNameHtml) {
  return {
    progress: langHtml("Closing", "Conclusion"),
    subtitle: setNameHtml,
    title: langHtml("Hail Holy Queen", "Salve Regina"),
    content:
      '<p class="guide-prayer-text">' +
        langHtml(
          "Hail, holy Queen, Mother of mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary. Amen.",
          "Salut, ô Reine, Mère de miséricorde, notre vie, notre douceur et notre espérance, salut ! Enfants d'Ève, exilés, nous crions vers vous ; vers vous nous soupirons, gémissant et pleurant dans cette vallée de larmes. Ô vous, notre avocate, tournez vers nous vos regards miséricordieux. Et, après cet exil, montrez-nous Jésus, le fruit béni de vos entrailles. Ô clémente, ô miséricordieuse, ô douce Vierge Marie. Amen."
        ) +
      "</p>",
  };
}

// ----- Bead counter (guided Rosary decades) -----
// Ten tappable beads so you can count Hail Marys on screen.
// Tap the next bead as you pray; tap the last filled bead to step
// back one (for mis-taps). The beads reset on every new mystery
// because the guide rebuilds its content at each step.
function beadCounterHtml() {
  let beads = "";
  for (let i = 1; i <= 10; i++) {
    beads +=
      '<button type="button" class="bead" aria-pressed="false" onclick="toggleRosaryBead(this)">' +
        '<span class="sr-only">' +
          langHtml("Hail Mary " + i + " of 10", "Je vous salue Marie " + i + " sur 10") +
        "</span>" +
      "</button>";
  }
  return (
    '<div class="bead-counter">' +
      '<div class="bead-row">' + beads + "</div>" +
      '<p class="bead-complete" hidden>' +
        langHtml("Decade complete ✝", "Dizaine terminée ✝") +
      "</p>" +
    "</div>"
  );
}

// Beads always fill in order, like a real chaplet: tapping a bead
// counts up to it, tapping the last filled bead un-counts it.
function toggleRosaryBead(btn) {
  const counter = btn.closest(".bead-counter");
  const beads = Array.from(counter.querySelectorAll(".bead"));
  const index = beads.indexOf(btn);
  const filled = beads.filter(function (b) {
    return b.classList.contains("filled");
  }).length;

  const count = (index + 1 === filled) ? index : index + 1;
  beads.forEach(function (b, i) {
    b.classList.toggle("filled", i < count);
    b.setAttribute("aria-pressed", i < count ? "true" : "false");
  });

  // A quiet word of encouragement once all ten are prayed.
  counter.querySelector(".bead-complete").hidden = count < beads.length;
}

function openRosaryGuide() {
  const panel = document.querySelector(".mystery-panel.active") ||
    document.querySelector(".mystery-panel");
  if (!panel) return;

  const setName = panel.querySelector(".mystery-set-name");
  const setNameHtml = setName ? setName.innerHTML : "";
  const mysteries = Array.from(panel.querySelectorAll(".mystery"));
  const steps = [rosaryOpeningStep(setNameHtml)];

  mysteries.forEach(function (mystery, i) {
    const name = mystery.querySelector(".name");
    const reading = mystery.querySelector(".reading");
    const meaning = mystery.querySelector(".meaning");
    steps.push({
      progress: langHtml(
        "Mystery " + (i + 1) + " of " + mysteries.length,
        "Mystère " + (i + 1) + " sur " + mysteries.length
      ),
      subtitle: setNameHtml,
      title: name ? name.innerHTML : "",
      content:
        '<p class="guide-reading">' + (reading ? reading.innerHTML : "") + "</p>" +
        '<p class="guide-body-text">' + (meaning ? meaning.innerHTML : "") + "</p>" +
        '<p class="guide-decade-prayers">' +
          langHtml("Pray:", "Priez :") + " " +
          prayerLinkHtml("our-father", "Our Father", "Notre Père") + " · " +
          prayerLinkHtml("hail-mary", "Ten Hail Marys", "Dix Je vous salue Marie") + " · " +
          prayerLinkHtml("glory-be", "Glory Be", "Gloire au Père") + " · " +
          prayerLinkHtml("fatima-prayer", "Fatima Prayer", "Prière de Fatima") +
        "</p>" +
        beadCounterHtml(),
    });
  });

  steps.push(rosaryClosingStep(setNameHtml));
  openPrayerGuide(steps);
}

function stationVersicleHtml() {
  return (
    '<div class="guide-versicle">' +
      "<p>" + langHtml("We adore you, O Christ, and we praise you.", "Nous vous adorons, ô Christ, et nous vous bénissons.") + "</p>" +
      "<p>" + langHtml("Because by your holy Cross you have redeemed the world.", "Parce que vous avez racheté le monde par votre sainte Croix.") + "</p>" +
    "</div>"
  );
}

function openStationsGuide() {
  const stations = Array.from(document.querySelectorAll(".saints-grid .saint-card"));
  if (stations.length === 0) return;

  const steps = stations.map(function (station, i) {
    const name = station.querySelector(".saint-name");
    const reflection = station.querySelector(".saint-bio");
    return {
      progress: langHtml(
        "Station " + (i + 1) + " of " + stations.length,
        "Station " + (i + 1) + " sur " + stations.length
      ),
      title: name ? name.innerHTML : "",
      content:
        stationVersicleHtml() +
        '<p class="guide-body-text">' + (reflection ? reflection.innerHTML : "") + "</p>",
    };
  });

  openPrayerGuide(steps);
}

// ============================================================
// NIGHT PRAYER / EXAMEN (prayers.html)
// Reuses the same guided prayer engine as the Rosary and Stations.
// ============================================================
function openNightPrayerGuide() {
  openPrayerGuide([
    {
      progress: langHtml("Step 1 of 5", "Étape 1 sur 5"),
      title: langHtml("Thanksgiving", "Action de grâce"),
      content: '<p class="guide-body-text">' +
        langHtml(
          "Begin by thanking God for the gifts of this day: the people you met, the work you did, and the quiet mercies you may have missed.",
          "Commencez par remercier Dieu pour les dons de cette journée : les personnes rencontrées, le travail accompli et les discrètes miséricordes que vous avez peut-être manquées."
        ) +
      "</p>",
    },
    {
      progress: langHtml("Step 2 of 5", "Étape 2 sur 5"),
      title: langHtml("Ask for Light", "Demander la lumière"),
      content: '<p class="guide-body-text">' +
        langHtml(
          "Ask the Holy Spirit to help you see the day truthfully, without fear and without excuses.",
          "Demandez à l'Esprit Saint de vous aider à voir la journée avec vérité, sans peur et sans excuses."
        ) +
      "</p>",
    },
    {
      progress: langHtml("Step 3 of 5", "Étape 3 sur 5"),
      title: langHtml("Review the Day", "Relire la journée"),
      content: '<p class="guide-body-text">' +
        langHtml(
          "Walk slowly through the day from morning to evening. Notice where you loved well, where you resisted grace, and where God seemed near.",
          "Repassez lentement la journée du matin au soir. Remarquez où vous avez bien aimé, où vous avez résisté à la grâce et où Dieu semblait proche."
        ) +
      "</p>",
    },
    {
      progress: langHtml("Step 4 of 5", "Étape 4 sur 5"),
      title: langHtml("Sorrow and Mercy", "Contrition et miséricorde"),
      content: '<p class="guide-body-text">' +
        langHtml(
          "Tell the Lord where you failed, and receive his mercy. Pray simply: Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
          "Dites au Seigneur où vous avez manqué, et recevez sa miséricorde. Priez simplement : Seigneur Jésus-Christ, Fils de Dieu, ayez pitié de moi, pécheur."
        ) +
      "</p>",
    },
    {
      progress: langHtml("Step 5 of 5", "Étape 5 sur 5"),
      title: langHtml("Resolution", "Résolution"),
      content: '<p class="guide-body-text">' +
        langHtml(
          "Choose one small act of love for tomorrow. Entrust the night to God and rest in peace.",
          "Choisissez un petit acte d'amour pour demain. Confiez la nuit à Dieu et reposez en paix."
        ) +
      "</p>",
    },
  ]);
}

// ============================================================
// DIVINE MERCY CHAPLET (chaplet.html)
// Prayed on ordinary Rosary beads. Reuses the same guided prayer
// engine as the Rosary, Stations, and Night Prayer.
// ============================================================
function chapletDecadeStep(i, total) {
  return {
    progress: langHtml("Decade " + i + " of " + total, "Dizaine " + i + " sur " + total),
    title: langHtml("Decade " + i, "Dizaine " + i),
    content:
      '<p class="guide-body-text">' +
        langHtml("On the large bead, pray once:", "Sur le gros grain, priez une fois :") +
      "</p>" +
      '<p class="guide-prayer-text">' +
        langHtml(
          "Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.",
          "Père Éternel, je T'offre le Corps et le Sang, l'Âme et la Divinité de Ton Fils bien-aimé, Notre Seigneur Jésus-Christ, en réparation de nos péchés et de ceux du monde entier."
        ) +
      "</p>" +
      '<p class="guide-body-text">' +
        langHtml("On the ten small beads, pray ten times:", "Sur les dix petits grains, priez dix fois :") +
      "</p>" +
      '<p class="guide-prayer-text">' +
        langHtml(
          "For the sake of His sorrowful Passion, have mercy on us and on the whole world.",
          "Par Sa douloureuse Passion, sois miséricordieux pour nous et pour le monde entier."
        ) +
      "</p>",
  };
}

function openChapletGuide() {
  const steps = [];

  // Opening prayers
  steps.push({
    progress: langHtml("Opening", "Ouverture"),
    title: langHtml("Begin the Chaplet", "Commencer le Chapelet"),
    content:
      '<p class="guide-body-text">' +
        langHtml(
          "Make the Sign of the Cross. The Chaplet is prayed on ordinary Rosary beads. To begin, pray:",
          "Faites le signe de la Croix. Le Chapelet se prie sur un chapelet ordinaire. Pour commencer, priez :"
        ) +
      "</p>" +
      '<ul class="guide-prayer-list">' +
        "<li>" + langHtml("Our Father", "Notre Père") + "</li>" +
        "<li>" + langHtml("Hail Mary", "Je vous salue Marie") + "</li>" +
        "<li>" + langHtml("The Apostles' Creed", "Le Symbole des Apôtres") + "</li>" +
      "</ul>",
  });

  // Five decades
  for (let i = 1; i <= 5; i++) {
    steps.push(chapletDecadeStep(i, 5));
  }

  // Concluding doxology (three times)
  steps.push({
    progress: langHtml("Conclusion", "Conclusion"),
    title: langHtml("Holy God", "Dieu Saint"),
    content:
      '<p class="guide-body-text">' +
        langHtml("Pray three times:", "Priez trois fois :") +
      "</p>" +
      '<p class="guide-prayer-text">' +
        langHtml(
          "Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.",
          "Dieu Saint, Dieu Fort, Dieu Éternel, prends pitié de nous et du monde entier."
        ) +
      "</p>",
  });

  // Closing prayer
  steps.push({
    progress: langHtml("Closing Prayer", "Prière finale"),
    title: langHtml("Closing Prayer", "Prière finale"),
    content:
      '<p class="guide-prayer-text">' +
        langHtml(
          "Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible, look kindly upon us and increase Your mercy in us, that in difficult moments we might not despair nor become despondent, but with great confidence submit ourselves to Your holy will, which is Love and Mercy itself. Amen.",
          "Dieu Éternel, dont la miséricorde est insondable et le trésor de compassion inépuisable, regarde-nous avec bonté et augmente en nous Ta miséricorde, afin que, dans les moments difficiles, nous ne désespérions pas et ne nous découragions pas, mais que, avec une grande confiance, nous nous soumettions à Ta sainte volonté, qui est l'Amour et la Miséricorde mêmes. Amen."
        ) +
      "</p>",
  });

  openPrayerGuide(steps);
}

// ============================================================
// FAVORITE PRAYERS (prayers.html)
// Adds a heart to each prayer card and remembers favorites on
// this device with localStorage.
// ============================================================
let showFavoritesOnly = false;

function savedPrayerFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favoritePrayers") || "[]");
  } catch (e) {
    return [];
  }
}

function savePrayerFavorites(ids) {
  localStorage.setItem("favoritePrayers", JSON.stringify(ids));
}

function prayerSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function setupPrayerFavorites() {
  const grid = document.getElementById("prayersGrid");
  if (!grid) return;

  grid.querySelectorAll(".saint-card").forEach(function (card) {
    if (card.querySelector(".favorite-btn")) return;
    const name = card.querySelector(".saint-name .lang-en");
    const id = prayerSlug(name ? name.textContent : "prayer");
    card.dataset.prayerId = id;

    const btn = document.createElement("button");
    btn.className = "favorite-btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle favorite prayer");
    btn.innerHTML = '<span aria-hidden="true">♥</span>';
    btn.addEventListener("click", function () {
      togglePrayerFavorite(id);
    });
    card.insertBefore(btn, card.firstChild);
  });

  updatePrayerFavoriteView();
}

function togglePrayerFavorite(id) {
  const favorites = savedPrayerFavorites();
  const index = favorites.indexOf(id);
  if (index === -1) favorites.push(id);
  else favorites.splice(index, 1);
  savePrayerFavorites(favorites);
  updatePrayerFavoriteView();
}

function toggleFavoriteFilter() {
  showFavoritesOnly = !showFavoritesOnly;
  updatePrayerFavoriteView();
}

function updatePrayerFavoriteView() {
  const grid = document.getElementById("prayersGrid");
  if (!grid) return;
  const favorites = savedPrayerFavorites();

  grid.querySelectorAll(".saint-card").forEach(function (card) {
    const id = card.dataset.prayerId;
    const isFavorite = favorites.indexOf(id) !== -1;
    const btn = card.querySelector(".favorite-btn");
    if (btn) btn.classList.toggle("active", isFavorite);
    card.hidden = showFavoritesOnly && !isFavorite;
  });

  const filterBtn = document.getElementById("favoriteFilterButton");
  if (filterBtn) {
    filterBtn.classList.toggle("active", showFavoritesOnly);
    filterBtn.innerHTML = showFavoritesOnly
      ? langHtml("Showing favorites", "Favoris affichés")
      : langHtml("Show favorites only", "Favoris seulement");
  }
}

setupPrayerFavorites();

// ============================================================
// NOVENA TRACKER (novenas.html)
// The start date is remembered, and the current day advances by
// calendar day until day 9.
// ============================================================
const novenas = [
  {
    id: "divine-mercy",
    emoji: "💧",
    name_en: "Divine Mercy Novena",
    name_fr: "Neuvaine à la Miséricorde divine",
    desc_en: "Nine days asking Jesus for mercy, trust, and compassion for the whole world.",
    desc_fr: "Neuf jours pour demander à Jésus la miséricorde, la confiance et la compassion pour le monde entier.",
    prayers: [
      { en: "Merciful Jesus, I trust in you. Draw my heart close to your mercy today. Amen.", fr: "Jésus miséricordieux, j'ai confiance en vous. Attirez aujourd'hui mon cœur près de votre miséricorde. Amen." },
      { en: "Lord Jesus, have mercy on families, friends, and all who need your peace. Amen.", fr: "Seigneur Jésus, ayez pitié des familles, des amis et de tous ceux qui ont besoin de votre paix. Amen." },
      { en: "Jesus, fountain of mercy, comfort the sick, the lonely, and the forgotten. Amen.", fr: "Jésus, fontaine de miséricorde, consolez les malades, les personnes seules et les oubliés. Amen." },
      { en: "Merciful Lord, forgive my sins and teach me to forgive others freely. Amen.", fr: "Seigneur miséricordieux, pardonnez mes péchés et apprenez-moi à pardonner librement aux autres. Amen." },
      { en: "Jesus, gentle Savior, gather all who are far from you into your love. Amen.", fr: "Jésus, doux Sauveur, rassemblez dans votre amour tous ceux qui sont loin de vous. Amen." },
      { en: "Lord, strengthen priests, religious, and all who serve your Church. Amen.", fr: "Seigneur, fortifiez les prêtres, les religieux et tous ceux qui servent votre Église. Amen." },
      { en: "Jesus, protect children and all who are vulnerable. Let them know your tenderness. Amen.", fr: "Jésus, protégez les enfants et tous les plus vulnérables. Faites-leur connaître votre tendresse. Amen." },
      { en: "Merciful Jesus, receive the souls of the departed into your light and peace. Amen.", fr: "Jésus miséricordieux, recevez les âmes des défunts dans votre lumière et votre paix. Amen." },
      { en: "Lord Jesus, make my heart a witness of mercy in ordinary life. Amen.", fr: "Seigneur Jésus, faites de mon cœur un témoin de miséricorde dans la vie ordinaire. Amen." },
    ],
  },
  {
    id: "st-jude",
    emoji: "🧭",
    name_en: "St. Jude Novena",
    name_fr: "Neuvaine à saint Jude",
    desc_en: "Nine days asking St. Jude to pray with us in difficult and discouraging needs.",
    desc_fr: "Neuf jours pour demander à saint Jude de prier avec nous dans les besoins difficiles et décourageants.",
    prayers: [
      { en: "St. Jude, faithful apostle, pray for me and bring my need before Christ. Amen.", fr: "Saint Jude, apôtre fidèle, priez pour moi et présentez mon besoin au Christ. Amen." },
      { en: "St. Jude, friend of those who hope, help me trust God's timing. Amen.", fr: "Saint Jude, ami de ceux qui espèrent, aidez-moi à faire confiance au temps de Dieu. Amen." },
      { en: "St. Jude, pray that discouragement may give way to courage and peace. Amen.", fr: "Saint Jude, priez pour que le découragement fasse place au courage et à la paix. Amen." },
      { en: "St. Jude, intercede for my family and all who carry hidden burdens. Amen.", fr: "Saint Jude, intercédez pour ma famille et pour tous ceux qui portent des fardeaux cachés. Amen." },
      { en: "St. Jude, teach me to remain faithful when the road is unclear. Amen.", fr: "Saint Jude, apprenez-moi à rester fidèle lorsque le chemin n'est pas clair. Amen." },
      { en: "St. Jude, pray that I may receive help with gratitude and patience. Amen.", fr: "Saint Jude, priez pour que je reçoive l'aide avec gratitude et patience. Amen." },
      { en: "St. Jude, ask Christ to heal what is wounded and guide what is confused. Amen.", fr: "Saint Jude, demandez au Christ de guérir ce qui est blessé et de guider ce qui est confus. Amen." },
      { en: "St. Jude, companion in hard causes, strengthen my hope today. Amen.", fr: "Saint Jude, compagnon des causes difficiles, fortifiez mon espérance aujourd'hui. Amen." },
      { en: "St. Jude, pray that this novena may lead me closer to Jesus. Amen.", fr: "Saint Jude, priez pour que cette neuvaine me rapproche de Jésus. Amen." },
    ],
  },
  {
    id: "sacred-heart",
    emoji: "❤️",
    name_en: "Sacred Heart Novena",
    name_fr: "Neuvaine au Sacré-Cœur",
    desc_en: "Nine days turning toward the Heart of Jesus, full of love and mercy.",
    desc_fr: "Neuf jours pour se tourner vers le Cœur de Jésus, plein d'amour et de miséricorde.",
    prayers: [
      { en: "Most Sacred Heart of Jesus, have mercy on us and make us gentle in love. Amen.", fr: "Très Sacré-Cœur de Jésus, ayez pitié de nous et rendez-nous doux dans l'amour. Amen." },
      { en: "Heart of Jesus, burning with charity, warm every cold place in my heart. Amen.", fr: "Cœur de Jésus, brûlant de charité, réchauffez tout lieu froid dans mon cœur. Amen." },
      { en: "Heart of Jesus, source of consolation, comfort all who suffer today. Amen.", fr: "Cœur de Jésus, source de consolation, consolez aujourd'hui tous ceux qui souffrent. Amen." },
      { en: "Heart of Jesus, patient and merciful, teach me patience with others. Amen.", fr: "Cœur de Jésus, patient et miséricordieux, apprenez-moi la patience envers les autres. Amen." },
      { en: "Heart of Jesus, pierced for love, help me give myself generously. Amen.", fr: "Cœur de Jésus, transpercé par amour, aidez-moi à me donner généreusement. Amen." },
      { en: "Heart of Jesus, our peace, quiet my fears and steady my mind. Amen.", fr: "Cœur de Jésus, notre paix, apaisez mes craintes et affermissez mon esprit. Amen." },
      { en: "Heart of Jesus, refuge of sinners, receive me with mercy and truth. Amen.", fr: "Cœur de Jésus, refuge des pécheurs, recevez-moi avec miséricorde et vérité. Amen." },
      { en: "Heart of Jesus, hope of the dying, be near to those in their final hour. Amen.", fr: "Cœur de Jésus, espérance des mourants, soyez proche de ceux qui vivent leur dernière heure. Amen." },
      { en: "Most Sacred Heart of Jesus, make my life an offering of love. Amen.", fr: "Très Sacré-Cœur de Jésus, faites de ma vie une offrande d'amour. Amen." },
    ],
  },
];

function todayKey() {
  const now = new Date();
  return now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0");
}

function dateFromKey(key) {
  const parts = key.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function savedNovenaState() {
  try {
    return JSON.parse(localStorage.getItem("novenaState") || "null");
  } catch (e) {
    return null;
  }
}

function saveNovenaState(state) {
  localStorage.setItem("novenaState", JSON.stringify(state));
}

function startNovena(id) {
  saveNovenaState({ id: id, startDate: todayKey(), completedDays: [] });
  renderNovenas();
}

function markNovenaDayComplete() {
  const state = savedNovenaState();
  if (!state) return;
  const day = currentNovenaDay(state);
  if (state.completedDays.indexOf(day) === -1) state.completedDays.push(day);
  saveNovenaState(state);
  renderNovenas();
}

function resetNovena() {
  localStorage.removeItem("novenaState");
  renderNovenas();
}

function currentNovenaDay(state) {
  const start = dateFromKey(state.startDate);
  const today = dateFromKey(todayKey());
  const day = Math.floor((today - start) / 86400000) + 1;
  return Math.max(1, Math.min(9, day));
}

function renderNovenaProgress(state, novena) {
  const day = currentNovenaDay(state);
  const completed = state.completedDays.indexOf(day) !== -1;
  const prayer = novena.prayers[day - 1];
  return (
    '<article class="daily-prayer novena-active-card">' +
      '<p class="daily-prayer-label">' +
        langHtml("Current Novena", "Neuvaine en cours") +
      "</p>" +
      '<h2 class="daily-prayer-name">' + langHtml(novena.name_en, novena.name_fr) + "</h2>" +
      '<p class="saint-feast">' +
        langHtml("Day " + day + " of 9", "Jour " + day + " sur 9") +
      "</p>" +
      '<p class="daily-prayer-text">' + langHtml(prayer.en, prayer.fr) + "</p>" +
      '<div class="novena-buttons">' +
        '<button class="filter-btn active" onclick="markNovenaDayComplete()">' +
          (completed ? langHtml("Completed today", "Terminé aujourd'hui") : langHtml("Mark today complete", "Marquer ce jour terminé")) +
        "</button>" +
        '<button class="filter-btn" onclick="resetNovena()">' +
          langHtml("Choose another", "Choisir une autre") +
        "</button>" +
      "</div>" +
    "</article>"
  );
}

function renderNovenas() {
  const list = document.getElementById("novenaList");
  const progress = document.getElementById("novenaProgress");
  if (!list || !progress) return;

  const state = savedNovenaState();
  const active = state ? novenas.find(function (n) { return n.id === state.id; }) : null;
  progress.innerHTML = active ? renderNovenaProgress(state, active) : "";

  list.innerHTML = novenas.map(function (novena) {
    return (
      '<article class="saint-card">' +
        '<div class="saint-avatar">' + novena.emoji + "</div>" +
        '<h2 class="saint-name">' + langHtml(novena.name_en, novena.name_fr) + "</h2>" +
        '<p class="saint-bio">' + langHtml(novena.desc_en, novena.desc_fr) + "</p>" +
        '<button class="filter-btn novena-start-btn" onclick="startNovena(\'' + novena.id + '\')">' +
          langHtml(active && active.id === novena.id ? "Restart" : "Start", active && active.id === novena.id ? "Recommencer" : "Commencer") +
        "</button>" +
      "</article>"
    );
  }).join("");
}

renderNovenas();

// ============================================================
// CLEANUP — remove any leftover service worker and its caches.
// An earlier version briefly registered a service worker, which can
// keep serving an OUTDATED copy of the site (making content look
// missing or broken). This clears it so everyone gets the live site.
// Safe to keep; it does nothing once there's nothing to clean up.
// ============================================================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    registrations.forEach(function (registration) { registration.unregister(); });
  });
  if (window.caches && caches.keys) {
    caches.keys().then(function (keys) {
      keys.forEach(function (key) { caches.delete(key); });
    });
  }
}
