import React, { useState, useEffect } from "react";

import { db } from "../firebaseConfig";
import { registrarAccion } from '../utils/registrarAccion';
import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";

const preguntasIniciales = [
  {
    id: 1,
    texto: "¿Qué preferirías?",
    opcion1: "Un striptease privado durante la boda",
    opcion2: "Un beso apasionado con alguien que no sea tu pareja",
    votos1: [],
    votos2: [],
  },
  {
    id: 2,
    texto: "¿Qué preferirías?",
    opcion1: "Una escapada erótica con alguien del evento",
    opcion2: "Una fantasía cumplida en el baño del banquete",
    votos1: [],
    votos2: [],
  },
  {
    id: 3,
    texto: "¿Qué preferirías?",
    opcion1: "Besar a alguien con los ojos vendados sin saber quién es",
    opcion2: "Dejarte vendar los ojos y que te acaricien varias personas",
    votos1: [],
    votos2: [],
  },
  {
    id: 4,
    texto: "¿Qué preferirías?",
    opcion1: "Un masaje sensual frente al resto de invitados",
    opcion2: "Un juego de roles candente en una habitación secreta",
    votos1: [],
    votos2: [],
  },
  {
    id: 5,
    texto: "¿Qué preferirías?",
    opcion1: "Tener sexo en el coche camino a la boda",
    opcion2: "Tener sexo en una habitación del lugar del banquete",
    votos1: [],
    votos2: [],
  },
  {
    id: 6,
    texto: "¿Qué preferirías?",
    opcion1: "Lamer el cuello de alguien de tu mesa",
    opcion2: "Susurrarle una fantasía al oído al/la camarero/a",
    votos1: [],
    votos2: [],
  },
  {
    id: 7,
    texto: "¿Qué preferirías?",
    opcion1: "Ver a tu pareja besando a su ex en el evento",
    opcion2: "Besar tú a tu ex delante de tu pareja",
    votos1: [],
    votos2: [],
  },
  {
    id: 8,
    texto: "¿Qué preferirías?",
    opcion1: "Jugar a verdad o reto solo con preguntas sexuales",
    opcion2: "Jugar al strip poker con desconocidos del evento",
    votos1: [],
    votos2: [],
  },
  {
    id: 9,
    texto: "¿Qué preferirías?",
    opcion1: "Probar juguetes eróticos en pareja",
    opcion2: "Hacer un trío con alguien de confianza",
    votos1: [],
    votos2: [],
  },
  {
    id: 10,
    texto: "¿Qué preferirías?",
    opcion1: "Tener sexo en un sitio público sin que te pillen",
    opcion2: "Tener sexo en un sitio público deseando que te pillen",
    votos1: [],
    votos2: [],
  },
  {
    id: 11,
    texto: "¿Qué preferirías?",
    opcion1: "Tener una noche loca con alguien desconocido del evento",
    opcion2: "Tener una noche apasionada con alguien comprometido/a",
    votos1: [],
    votos2: [],
  },
  {
    id: 12,
    texto: "¿Qué preferirías?",
    opcion1: "Ver una peli porno con tus padres",
    opcion2: "Hacer una peli porno con tu pareja y que se filtre",
    votos1: [],
    votos2: [],
  },
  {
    id: 13,
    texto: "¿Qué preferirías?",
    opcion1: "Una ducha compartida con una ex pareja",
    opcion2: "Un jacuzzi con desconocidos atractivos",
    votos1: [],
    votos2: [],
  },
  {
    id: 14,
    texto: "¿Qué preferirías?",
    opcion1: "Enviar un nude a un grupo familiar por error",
    opcion2: "Recibir un nude de un familiar por error",
    votos1: [],
    votos2: [],
  },
  {
    id: 15,
    texto: "¿Qué preferirías?",
    opcion1: "Hacer un streaptease tú en la boda",
    opcion2: "Pagar a alguien para que lo haga y digan que eras tú",
    votos1: [],
    votos2: [],
  },
  {
    id: 16,
    texto: "¿Qué preferirías?",
    opcion1: "Escuchar a tus padres teniendo sexo",
    opcion2: "Que tus padres te escuchen a ti",
    votos1: [],
    votos2: [],
  },
  {
    id: 17,
    texto: "¿Qué preferirías?",
    opcion1: "Probar bondage con tu pareja",
    opcion2: "Que tu pareja te ate y no te diga para qué",
    votos1: [],
    votos2: [],
  },
  {
    id: 18,
    texto: "¿Qué preferirías?",
    opcion1: "Hacer el amor bajo la lluvia",
    opcion2: "Hacerlo mientras otros miran desde lejos",
    votos1: [],
    votos2: [],
  },
  {
    id: 19,
    texto: "¿Qué preferirías?",
    opcion1: "Llevar ropa interior comestible todo el día",
    opcion2: "No llevar ropa interior en toda la boda",
    votos1: [],
    votos2: [],
  },
  {
    id: 20,
    texto: "¿Qué preferirías?",
    opcion1: "Tener sexo con alguien disfrazado de policía",
    opcion2: "Con alguien disfrazado de cura o monja",
    votos1: [],
    votos2: [],
  },
  {
    id: 21,
    texto: "¿Qué preferirías?",
    opcion1: "Leer en voz alta tus mensajes más calientes",
    opcion2: "Leer en voz alta tus búsquedas más íntimas",
    votos1: [],
    votos2: [],
  },
  {
    id: 22,
    texto: "¿Qué preferirías?",
    opcion1: "Una cita sin ropa",
    opcion2: "Una cita en un club liberal",
    votos1: [],
    votos2: [],
  },
  {
    id: 23,
    texto: "¿Qué preferirías?",
    opcion1: "Recibir caricias bajo la mesa durante la cena",
    opcion2: "Hacer tú las caricias a escondidas",
    votos1: [],
    votos2: [],
  },
  {
    id: 24,
    texto: "¿Qué preferirías?",
    opcion1: "Ser testigo de un encuentro íntimo sin que te vean",
    opcion2: "Ser visto mientras tienes uno",
    votos1: [],
    votos2: [],
  },
  {
    id: 25,
    texto: "¿Qué preferirías?",
    opcion1: "Llevar un plug anal toda la boda sin que nadie lo sepa",
    opcion2: "Llevar un vibrador controlado por alguien",
    votos1: [],
    votos2: [],
  },
  {
    id: 26,
    texto: "¿Qué preferirías?",
    opcion1: "Gritar el nombre de un ex en pleno acto",
    opcion2: "Llamar a tu pareja por otro nombre en la boda",
    votos1: [],
    votos2: [],
  },
  {
    id: 27,
    texto: "¿Qué preferirías?",
    opcion1: "Probar un columpio sexual",
    opcion2: "Usar esposas y antifaz",
    votos1: [],
    votos2: [],
  },
  {
    id: 28,
    texto: "¿Qué preferirías?",
    opcion1: "Que te graben sin saberlo en una noche loca",
    opcion2: "Descubrir que has sido proyectado en la boda",
    votos1: [],
    votos2: [],
  },
  {
    id: 29,
    texto: "¿Qué preferirías?",
    opcion1: "Recibir caricias en los pies toda la noche",
    opcion2: "Recibir mordiscos en el cuello toda la noche",
    votos1: [],
    votos2: [],
  },
  {
    id: 30,
    texto: "¿Qué preferirías?",
    opcion1: "Probar un beso negro por primera vez",
    opcion2: "Hacer un 69 en un sitio público",
    votos1: [],
    votos2: [],
  },
  {
    id: 31,
    texto: "¿Qué preferirías?",
    opcion1: "Hacer un onlyfans en pareja por una noche",
    opcion2: "Ir a una orgía como espectadores",
    votos1: [],
    votos2: [],
  },
  {
    id: 32,
    texto: "¿Qué preferirías?",
    opcion1: "Despertarte en una habitación con dos desconocidos",
    opcion2: "No recordar nada pero tener fotos en tu móvil",
    votos1: [],
    votos2: [],
  },
  {
    id: 33,
    texto: "¿Qué preferirías?",
    opcion1: "Un masaje con final feliz de tu mejor amigo/a",
    opcion2: "Dárselo tú a tu mejor amigo/a",
    votos1: [],
    votos2: [],
  },
  {
    id: 34,
    texto: "¿Qué preferirías?",
    opcion1: "Pasar la noche atado/a a la cama",
    opcion2: "Pasar la noche atando a alguien",
    votos1: [],
    votos2: [],
  },
  {
    id: 35,
    texto: "¿Qué preferirías?",
    opcion1: "Hacerlo con alguien disfrazado de tu personaje favorito",
    opcion2: "Hacerlo disfrazado como tu personaje favorito",
    votos1: [],
    votos2: [],
  },
  {
    id: 36,
    texto: "¿Qué preferirías?",
    opcion1: "Besar al/la testigo de la boda",
    opcion2: "Besar al DJ durante una canción lenta",
    votos1: [],
    votos2: [],
  },
  {
    id: 37,
    texto: "¿Qué preferirías?",
    opcion1: "Ir sin ropa interior toda la boda",
    opcion2: "Perderla durante la fiesta sin darte cuenta",
    votos1: [],
    votos2: [],
  },
  {
    id: 38,
    texto: "¿Qué preferirías?",
    opcion1: "Que tu pareja se ponga celosa por algo real",
    opcion2: "Ponerte celoso/a tú sin motivo y armar el drama",
    votos1: [],
    votos2: [],
  },
  {
    id: 39,
    texto: "¿Qué preferirías?",
    opcion1: "Tener sexo encima de una tarta de boda",
    opcion2: "Tener sexo en el coche de los novios",
    votos1: [],
    votos2: [],
  },
  {
    id: 40,
    texto: "¿Qué preferirías?",
    opcion1: "Quedarte dormido abrazando a alguien inesperado",
    opcion2: "Despertar abrazado a dos personas desconocidas",
    votos1: [],
    votos2: [],
  },
  {
    id: 41,
    texto: "¿Qué preferirías?",
    opcion1: "Ser grabado teniendo sexo por error",
    opcion2: "Grabar sin querer a otros y no saber qué hacer",
    votos1: [],
    votos2: [],
  },
  {
    id: 42,
    texto: "¿Qué preferirías?",
    opcion1: "Que alguien te confiese que se ha excitado contigo",
    opcion2: "Excitar tú a alguien sin querer",
    votos1: [],
    votos2: [],
  },
  {
    id: 43,
    texto: "¿Qué preferirías?",
    opcion1: "Hacer un trío con alguien del evento",
    opcion2: "Ver cómo lo hacen delante de ti",
    votos1: [],
    votos2: [],
  },
  {
    id: 44,
    texto: "¿Qué preferirías?",
    opcion1: "Probar sexo telefónico en mitad de la fiesta",
    opcion2: "Sexting con alguien en otra mesa",
    votos1: [],
    votos2: [],
  },
  {
    id: 45,
    texto: "¿Qué preferirías?",
    opcion1: "Poner los cuernos una vez con consentimiento",
    opcion2: "Nunca hacerlo pero vivir deseándolo",
    votos1: [],
    votos2: [],
  },
  {
    id: 46,
    texto: "¿Qué preferirías?",
    opcion1: "Estar con alguien mucho más joven",
    opcion2: "Estar con alguien mucho mayor",
    votos1: [],
    votos2: [],
  },
  {
    id: 47,
    texto: "¿Qué preferirías?",
    opcion1: "Probar un juego erótico sin saber las reglas",
    opcion2: "Inventarte uno improvisado en el momento",
    votos1: [],
    votos2: [],
  },
  {
    id: 48,
    texto: "¿Qué preferirías?",
    opcion1: "Jugar a la botella con desconocidos",
    opcion2: "Adivinar quién te besa con los ojos cerrados",
    votos1: [],
    votos2: [],
  },
  {
    id: 49,
    texto: "¿Qué preferirías?",
    opcion1: "Ser tú el tema caliente de conversación en la boda",
    opcion2: "Descubrir que todos te han visto hacer algo picante",
    votos1: [],
    votos2: [],
  },
  {
    id: 50,
    texto: "¿Qué preferirías?",
    opcion1: "Ser sorprendido en la cama por alguien que no esperabas",
    opcion2: "Sorprender tú a alguien en plena acción",
    votos1: [],
    votos2: [],
  }
];

const preguntasDiaADia = [
  { id: 1, texto: "¿Qué preferirías?", opcion1: "Tomar café sin azúcar toda tu vida", opcion2: "No volver a comer pan nunca más", votos1: [], votos2: [] },
  { id: 2, texto: "¿Qué preferirías?", opcion1: "Tener que madrugar todos los días", opcion2: "Dormir con ruido toda la noche", votos1: [], votos2: [] },
  { id: 3, texto: "¿Qué preferirías?", opcion1: "No poder usar el móvil durante una semana", opcion2: "No poder ver la televisión durante un mes", votos1: [], votos2: [] },
  { id: 4, texto: "¿Qué preferirías?", opcion1: "Comer solo pizza durante un mes", opcion2: "Comer solo ensalada durante una semana", votos1: [], votos2: [] },
  { id: 5, texto: "¿Qué preferirías?", opcion1: "Vivir sin música", opcion2: "Vivir sin películas", votos1: [], votos2: [] },
  { id: 6, texto: "¿Qué preferirías?", opcion1: "Perder las llaves de casa", opcion2: "Perder el móvil", votos1: [], votos2: [] },
  { id: 7, texto: "¿Qué preferirías?", opcion1: "No poder ducharte en una semana", opcion2: "No poder cepillarte los dientes en tres días", votos1: [], votos2: [] },
  { id: 8, texto: "¿Qué preferirías?", opcion1: "Trabajar desde casa siempre", opcion2: "Trabajar en la oficina siempre", votos1: [], votos2: [] },
  { id: 9, texto: "¿Qué preferirías?", opcion1: "No tener internet nunca más", opcion2: "No poder viajar nunca más", votos1: [], votos2: [] },
  { id: 10, texto: "¿Qué preferirías?", opcion1: "Tener que cocinar todas tus comidas", opcion2: "No poder cocinar nunca más", votos1: [], votos2: [] },
  { id: 11, texto: "¿Qué preferirías?", opcion1: "Tener que usar transporte público siempre", opcion2: "Tener que ir andando a todos lados", votos1: [], votos2: [] },
  { id: 12, texto: "¿Qué preferirías?", opcion1: "No poder usar redes sociales", opcion2: "No poder ver series nunca más", votos1: [], votos2: [] },
  { id: 13, texto: "¿Qué preferirías?", opcion1: "No poder comer chocolate nunca más", opcion2: "No poder comer patatas fritas nunca más", votos1: [], votos2: [] },
  { id: 14, texto: "¿Qué preferirías?", opcion1: "Despertarte siempre a las 5am", opcion2: "Acostarte siempre a las 9pm", votos1: [], votos2: [] },
  { id: 15, texto: "¿Qué preferirías?", opcion1: "No poder usar el ascensor nunca", opcion2: "No poder usar las escaleras nunca", votos1: [], votos2: [] },
  { id: 16, texto: "¿Qué preferirías?", opcion1: "No poder ver a tus amigos nunca más", opcion2: "No poder ver a tu familia nunca más", votos1: [], votos2: [] },
  { id: 17, texto: "¿Qué preferirías?", opcion1: "No poder leer libros nunca más", opcion2: "No poder escuchar música nunca más", votos1: [], votos2: [] },
  { id: 18, texto: "¿Qué preferirías?", opcion1: "Comer solo comida fría", opcion2: "Comer solo comida caliente", votos1: [], votos2: [] },
  { id: 19, texto: "¿Qué preferirías?", opcion1: "No poder salir de casa en un mes", opcion2: "No poder quedarte en casa en un mes", votos1: [], votos2: [] },
  { id: 20, texto: "¿Qué preferirías?", opcion1: "No poder usar zapatos nunca más", opcion2: "No poder usar abrigo nunca más", votos1: [], votos2: [] },
  { id: 21, texto: "¿Qué preferirías?", opcion1: "Tener que comer picante en cada comida", opcion2: "No poder comer sal nunca más", votos1: [], votos2: [] },
  { id: 22, texto: "¿Qué preferirías?", opcion1: "No poder usar el microondas nunca más", opcion2: "No poder usar la nevera nunca más", votos1: [], votos2: [] },
  { id: 23, texto: "¿Qué preferirías?", opcion1: "No poder usar coche nunca más", opcion2: "No poder usar bicicleta nunca más", votos1: [], votos2: [] },
  { id: 24, texto: "¿Qué preferirías?", opcion1: "No poder usar paraguas cuando llueva", opcion2: "No poder usar gafas de sol cuando haga sol", votos1: [], votos2: [] },
  { id: 25, texto: "¿Qué preferirías?", opcion1: "No poder usar jabón nunca más", opcion2: "No poder usar champú nunca más", votos1: [], votos2: [] },
  { id: 26, texto: "¿Qué preferirías?", opcion1: "No poder comer fruta nunca más", opcion2: "No poder comer verdura nunca más", votos1: [], votos2: [] },
  { id: 27, texto: "¿Qué preferirías?", opcion1: "No poder usar reloj nunca más", opcion2: "No poder usar calendario nunca más", votos1: [], votos2: [] },
  { id: 28, texto: "¿Qué preferirías?", opcion1: "No poder usar ordenador nunca más", opcion2: "No poder usar tablet nunca más", votos1: [], votos2: [] },
  { id: 29, texto: "¿Qué preferirías?", opcion1: "No poder comer carne nunca más", opcion2: "No poder comer pescado nunca más", votos1: [], votos2: [] },
  { id: 30, texto: "¿Qué preferirías?", opcion1: "No poder usar WhatsApp nunca más", opcion2: "No poder usar Instagram nunca más", votos1: [], votos2: [] },
  { id: 31, texto: "¿Qué preferirías?", opcion1: "No poder usar papel higiénico nunca más", opcion2: "No poder usar toalla nunca más", votos1: [], votos2: [] },
  { id: 32, texto: "¿Qué preferirías?", opcion1: "No poder usar cuchillo nunca más", opcion2: "No poder usar tenedor nunca más", votos1: [], votos2: [] },
  { id: 33, texto: "¿Qué preferirías?", opcion1: "No poder usar aire acondicionado nunca más", opcion2: "No poder usar calefacción nunca más", votos1: [], votos2: [] },
  { id: 34, texto: "¿Qué preferirías?", opcion1: "No poder usar champú nunca más", opcion2: "No poder usar desodorante nunca más", votos1: [], votos2: [] },
  { id: 35, texto: "¿Qué preferirías?", opcion1: "No poder usar YouTube nunca más", opcion2: "No poder usar Netflix nunca más", votos1: [], votos2: [] },
  { id: 36, texto: "¿Qué preferirías?", opcion1: "No poder usar correo electrónico nunca más", opcion2: "No poder usar teléfono nunca más", votos1: [], votos2: [] },
  { id: 37, texto: "¿Qué preferirías?", opcion1: "No poder usar gafas nunca más", opcion2: "No poder usar lentillas nunca más", votos1: [], votos2: [] },
  { id: 38, texto: "¿Qué preferirías?", opcion1: "No poder tomar refrescos nunca más", opcion2: "No poder tomar zumo nunca más", votos1: [], votos2: [] },
  { id: 39, texto: "¿Qué preferirías?", opcion1: "No poder usar abrigo nunca más", opcion2: "No poder usar bufanda nunca más", votos1: [], votos2: [] },
  { id: 40, texto: "¿Qué preferirías?", opcion1: "No poder usar cuchara nunca más", opcion2: "No poder usar vaso nunca más", votos1: [], votos2: [] },
  { id: 41, texto: "¿Qué preferirías?", opcion1: "No poder usar zapatillas nunca más", opcion2: "No poder usar calcetines nunca más", votos1: [], votos2: [] },
  { id: 42, texto: "¿Qué preferirías?", opcion1: "No poder usar mochila nunca más", opcion2: "No poder usar bolso nunca más", votos1: [], votos2: [] },
  { id: 43, texto: "¿Qué preferirías?", opcion1: "No poder usar microondas nunca más", opcion2: "No poder usar horno nunca más", votos1: [], votos2: [] },
  { id: 44, texto: "¿Qué preferirías?", opcion1: "No poder comer pasta nunca más", opcion2: "No poder comer arroz nunca más", votos1: [], votos2: [] },
  { id: 45, texto: "¿Qué preferirías?", opcion1: "No poder usar champú nunca más", opcion2: "No poder usar peine nunca más", votos1: [], votos2: [] },
  { id: 46, texto: "¿Qué preferirías?", opcion1: "No poder usar espejo nunca más", opcion2: "No poder usar cepillo de dientes nunca más", votos1: [], votos2: [] },
  { id: 47, texto: "¿Qué preferirías?", opcion1: "No poder usar luz eléctrica nunca más", opcion2: "No poder usar agua caliente nunca más", votos1: [], votos2: [] },
  { id: 48, texto: "¿Qué preferirías?", opcion1: "No poder usar silla nunca más", opcion2: "No poder usar cama nunca más", votos1: [], votos2: [] },
  { id: 49, texto: "¿Qué preferirías?", opcion1: "No poder usar cuchillo nunca más", opcion2: "No poder usar tijeras nunca más", votos1: [], votos2: [] },
  { id: 50, texto: "¿Qué preferirías?", opcion1: "No poder usar paraguas nunca más", opcion2: "No poder usar botas nunca más", votos1: [], votos2: [] }
];

const Cuestionario = ({ usuario = "Usuario de prueba" }) => {
  const [preguntas, setPreguntas] = useState(preguntasIniciales);
  const [modo, setModo] = useState("boda");

  const cargarVotos = async () => {
    const ref = doc(db, "bodas", "bodaPrincipal");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data().cuestionario || {};
      const actualizadas = preguntasIniciales.map(p => ({
        ...p,
        ...(data[p.id.toString()] || {})
      }));
      setPreguntas(actualizadas);
      console.log("Datos cargados desde Firestore:", data);
    }
  };

  const votar = async (id, opcion) => {
    if (!usuario) return;
    const ref = doc(db, "bodas", "bodaPrincipal");
    const snap = await getDoc(ref);
    const data = snap.exists() && snap.data() && snap.data().cuestionario ? snap.data().cuestionario : {};

    // Usar id.toString() para acceder a la clave correctamente
    const actual = data[id.toString()] || { votos1: [], votos2: [], texto: "", opcion1: "", opcion2: "" };
    const yaVoto = [...actual.votos1, ...actual.votos2].includes(usuario);
    if (yaVoto) return;

    if (opcion === 1) {
      actual.votos1.push(usuario);
    } else {
      actual.votos2.push(usuario);
    }

    // Añadimos info de texto y opciones por si no estaba guardada
    const preguntaOriginal = preguntasIniciales.find(p => p.id === id);
    if (preguntaOriginal) {
      actual.texto = preguntaOriginal.texto;
      actual.opcion1 = preguntaOriginal.opcion1;
      actual.opcion2 = preguntaOriginal.opcion2;
    }

    console.log("Guardando en Firestore:", actual);

    await setDoc(ref, { cuestionario: { ...data, [id.toString()]: { ...actual } } }, { merge: true });

    await registrarAccion(usuario, "Voto en cuestionario", {
      pregunta: preguntaOriginal?.texto,
      opcionVotada: opcion === 1 ? preguntaOriginal?.opcion1 : preguntaOriginal?.opcion2
    });

    await cargarVotos();
  };

  useEffect(() => {
    cargarVotos();
  }, []);

  const rankingBoda = [...preguntas]
    .map(p => ({ ...p, totalVotos: p.votos1.length + p.votos2.length }))
    .sort((a, b) => b.totalVotos - a.totalVotos)
    .slice(0, 10);

  const rankingDia = [...preguntasDiaADia]
    .map(p => ({ ...p, totalVotos: p.votos1.length + p.votos2.length }))
    .sort((a, b) => b.totalVotos - a.totalVotos)
    .slice(0, 10);

  // Función para borrar todos los votos del cuestionario (solo para admin)
  const borrarCuestionario = async () => {
    if (!window.confirm("¿Seguro que quieres borrar todos los votos del cuestionario? Esta acción no se puede deshacer.")) return;
    const ref = doc(db, "bodas", "bodaPrincipal");
    await updateDoc(ref, {
      cuestionario: deleteField()
    });
    alert("✅ Cuestionario restablecido");
    await cargarVotos();
  };

  return (
    <div className="app-container">
      <div style={{ marginBottom: "2rem" }}>
        <button onClick={() => setModo("boda")} disabled={modo === "boda"}>Modo Boda</button>
        <button onClick={() => setModo("dia")} disabled={modo === "dia"}>Modo Día a Día</button>
      </div>
      <p style={{ fontStyle: "italic", marginBottom: "2rem", background: "#fff8e1", padding: "1rem", borderRadius: "0.5rem" }}>
        🕵️‍♀️ Todos los votos y respuestas de este cuestionario son completamente anónimos. 
        Nadie sabrá quién ha votado qué opción. Solo se mostrarán los recuentos numéricos para comentarlo en la boda. LAS DIEZ RESPUESTAS MAS VOTADAS, APARECERÁN AL FINAL DEL CUESTIONARIO.
      </p>
      {usuario === "luislunaraluy98@gmail.com" && (
        <div style={{ marginBottom: "2rem" }}>
          <button onClick={borrarCuestionario} style={{
            backgroundColor: "#d32f2f",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            cursor: "pointer"
          }}>
            🧹 Borrar todos los votos
          </button>
        </div>
      )}
      <h2>📝 Cuestionario completo:</h2>
      {(modo === "boda" ? preguntas : preguntasDiaADia).map(p => (
        <div key={p.id} style={{ marginBottom: "2rem" }}>
          <h3>{p.texto}</h3>
          {modo === "boda" ? (
            <>
              <button onClick={() => votar(p.id, 1)}>
                ✅ {p.opcion1} — {p.votos1.length} voto{p.votos1.length !== 1 ? 's' : ''}
              </button>
              <button onClick={() => votar(p.id, 2)}>
                🔘 {p.opcion2} — {p.votos2.length} voto{p.votos2.length !== 1 ? 's' : ''}
              </button>
            </>
          ) : (
            <>
              <button disabled>
                ✅ {p.opcion1}
              </button>
              <button disabled>
                🔘 {p.opcion2}
              </button>
            </>
          )}
        </div>
      ))}
      <h2>Top 10 preguntas más votadas</h2>
      <ol>
        {(modo === "boda" ? rankingBoda : rankingDia).map((p, i) => {
          const ganadora = p.votos1.length > p.votos2.length ? p.opcion1 : p.opcion2;
          const votosGanadora = Math.max(p.votos1.length, p.votos2.length);
          return (
            <li key={p.id}>
              <p><strong>Pregunta {i + 1}:</strong> {p.texto}</p>
              <p>🎉 Lo que prefiere la mayoría: <strong>{ganadora}</strong> ({votosGanadora} votos)</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Cuestionario;
