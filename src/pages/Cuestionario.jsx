

import React from 'react';
import { useState } from 'react';

const preguntas = [
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Dar el primer beso delante de todos en la pista de baile",
    opcion2: "Que os pillen dándoos el lote en el coche de los novios"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el ramo lo coja tu ex",
    opcion2: "Que tu ex sea el DJ de la boda"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Un brindis grupal con chupitos de tequila",
    opcion2: "Un striptease sorpresa del padrino"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el cura se marque un reguetón en plena misa",
    opcion2: "Que la abuela se marque un perreo en la fiesta"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Recibir el regalo de boda en billetes pequeños escondidos en ropa interior",
    opcion2: "Que te lo entreguen en una tarta que tienes que lamer"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Una luna de miel en una isla nudista",
    opcion2: "Una noche en un hotel temático erótico"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el vídeo de la boda incluya escenas de la despedida de soltero/a",
    opcion2: "Que lo proyecten por error durante el banquete"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Una entrada nupcial bailando salsa sensual",
    opcion2: "Una entrada en tanga y velo"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el primer baile sea una bachata muy pegada",
    opcion2: "Que sea una coreografía subida de tono"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que todos los invitados lleven máscaras de tus exparejas",
    opcion2: "Que el fotógrafo sea uno de ellos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ ponga solo canciones sensuales toda la noche",
    opcion2: "Que el DJ ponga solo canciones infantiles toda la noche"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el pastel tenga forma de cuerpo humano",
    opcion2: "Que el pastel esté relleno de chuches eróticas"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la liga salga volando y le caiga a tu jefe",
    opcion2: "Que el jefe te saque a bailar lento"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Un brindis con body shots en la barra",
    opcion2: "Un concurso de besos entre los invitados"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te cante una canción sexy delante de todos",
    opcion2: "Que tú le cantes una canción sexy a tu pareja"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu suegra te regale lencería en público",
    opcion2: "Que tu cuñado te regale esposas de broma"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la tarta de boda sea en realidad una piñata de condones",
    opcion2: "Que la piñata de la fiesta esté llena de lencería"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en un camping nudista",
    opcion2: "Que sea en un hotel donde todo el personal va en ropa interior"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el cura suelte un chiste picante en la ceremonia",
    opcion2: "Que el padrino cuente una anécdota subida de tono"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que te caigas encima de la tarta al cortarla",
    opcion2: "Que tu pareja te embadurne la cara de nata en público"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Bailar sobre la mesa con tu pareja",
    opcion2: "Bailar sobre la barra con tus amigos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela te dé consejos sexuales en la boda",
    opcion2: "Que el abuelo te regale un libro de posturas"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Una despedida de soltero/a conjunta en un club de striptease",
    opcion2: "Una despedida de soltero/a sorpresa en un spa nudista"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu ex se siente en la mesa principal",
    opcion2: "Que tu ex te saque a bailar el vals"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja lleve ropa interior de leopardo",
    opcion2: "Que tú lleves ropa interior comestible"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el fotógrafo solo haga fotos comprometedoras",
    opcion2: "Que el vídeo solo tenga tomas de los besos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que te lancen a la piscina con el traje de boda",
    opcion2: "Que te tiren confeti de preservativos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja lleve liguero con sorpresa",
    opcion2: "Que tú lleves tatuajes temporales picantes"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la banda toque solo canciones de amor empalagosas",
    opcion2: "Que toquen solo canciones de reggaetón atrevidas"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela se suba a la barra a bailar",
    opcion2: "Que el abuelo haga un brindis subido de tono"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en Las Vegas y os caséis otra vez disfrazados",
    opcion2: "Que sea en Ibiza y acabéis en una fiesta de espuma"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la tarta esté rellena de chuches con forma de partes del cuerpo",
    opcion2: "Que el brindis sea con chupitos que arden"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que todos los invitados lleven ropa interior roja",
    opcion2: "Que todos lleven antifaces misteriosos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la última canción sea un reggaetón muy pegajoso",
    opcion2: "Que sea un lento y todos se abracen"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te sorprenda con un baile sensual",
    opcion2: "Que tú sorprendas con un baile sexy"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de fuego",
    opcion2: "Que el brindis sea con body shots"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el primer beso sea retransmitido en directo",
    opcion2: "Que el primer beso sea en secreto en el baño"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la noche acabe con karaoke picante",
    opcion2: "Que acabe con limbo de ropa interior"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la liga tenga que quitártela el padrino con la boca",
    opcion2: "Que el ramo lo recoja el más tímido"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja lleve tatuajes temporales con tu nombre",
    opcion2: "Que tú lleves tatuajes temporales de corazones"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la boda sea temática de playa y todos vayan en bañador",
    opcion2: "Que sea temática de pijamas y todos vayan en bata"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con un chupito en el ombligo",
    opcion2: "Que el brindis sea con una canción atrevida"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela tire el ramo",
    opcion2: "Que el abuelo lance la liga"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en una playa nudista",
    opcion2: "Que sea en un hotel temático de los 50"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te regale un striptease privado",
    opcion2: "Que tú le regales un baile sensual"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la tarta de boda tenga forma de corazón gigante",
    opcion2: "Que tenga forma de labios"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ ponga canciones prohibidas",
    opcion2: "Que ponga solo canciones de amor empalagosas"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el primer baile sea una salsa sensual",
    opcion2: "Que sea una bachata pegadita"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con tequila y sal en el cuello",
    opcion2: "Que sea con chupitos en la espalda"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te sorprenda con un beso robado",
    opcion2: "Que tú le sorprendas con un mordisco"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el fotógrafo solo haga fotos de besos",
    opcion2: "Que solo haga fotos de abrazos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela te enseñe a perrear",
    opcion2: "Que el abuelo te enseñe a bailar salsa"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de chocolate",
    opcion2: "Que sea con chupitos de licor de fresa"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ te dedique una canción sexy",
    opcion2: "Que el DJ te saque a bailar"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en un crucero de solteros",
    opcion2: "Que sea en una playa paradisíaca sin cobertura"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con body shots de tu pareja",
    opcion2: "Que sea con body shots de tus amigos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te regale una noche de juegos picantes",
    opcion2: "Que tú le regales una noche de sorpresas"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la tarta de boda sea de chocolate y fresa",
    opcion2: "Que sea de nata y frutas prohibidas"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el primer baile sea en ropa interior",
    opcion2: "Que sea en pijama"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela tire el ramo a lo loco",
    opcion2: "Que el abuelo lance la liga con los dientes"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ ponga tu canción favorita en versión reggaetón",
    opcion2: "Que la ponga en versión lenta y sensual"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en una isla desierta",
    opcion2: "Que sea en una ciudad llena de fiesta"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de fuego",
    opcion2: "Que sea con cócteles afrodisíacos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te sorprenda con un regalo travieso",
    opcion2: "Que tú le sorprendas con un juego atrevido"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la tarta esté rellena de sorpresas picantes",
    opcion2: "Que el brindis sea con shots de chocolate"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ haga un concurso de bailes sensuales",
    opcion2: "Que haga un concurso de besos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de cereza",
    opcion2: "Que sea con chupitos de crema irlandesa"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te sorprenda con un beso de película",
    opcion2: "Que tú le sorprendas con un abrazo de oso"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela haga de DJ y ponga reggaetón",
    opcion2: "Que el abuelo haga de animador y saque a todos a bailar"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de menta",
    opcion2: "Que sea con chupitos de licor de coco"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en una ciudad del pecado",
    opcion2: "Que sea en una cabaña perdida en el bosque"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ te dedique una canción atrevida",
    opcion2: "Que te saque a bailar delante de todos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de manzana",
    opcion2: "Que sea con chupitos de licor de plátano"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te sorprenda con un beso inesperado",
    opcion2: "Que tú le sorprendas con un guiño travieso"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela haga una coreografía sexy",
    opcion2: "Que el abuelo haga un striptease de broma"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de café",
    opcion2: "Que sea con chupitos de licor de naranja"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en una ciudad romántica",
    opcion2: "Que sea en una ciudad llena de fiesta y locura"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ ponga tu canción favorita en versión sexy",
    opcion2: "Que la ponga en versión divertida"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de fresa",
    opcion2: "Que sea con chupitos de licor de chocolate"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te sorprenda con un baile privado",
    opcion2: "Que tú le sorprendas con un regalo atrevido"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela haga un brindis divertido",
    opcion2: "Que el abuelo haga un brindis picante"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de coco",
    opcion2: "Que sea con chupitos de licor de avellana"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en una ciudad exótica",
    opcion2: "Que sea en un resort solo para adultos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ haga un concurso de bailes locos",
    opcion2: "Que haga un concurso de besos robados"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de piña",
    opcion2: "Que sea con chupitos de licor de sandía"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te sorprenda con un beso robado",
    opcion2: "Que tú le sorprendas con un abrazo inesperado"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela haga una broma picante",
    opcion2: "Que el abuelo haga una broma atrevida"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de uva",
    opcion2: "Que sea con chupitos de licor de melón"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en una ciudad con playa nudista",
    opcion2: "Que sea en una ciudad con fiestas locas"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ haga un concurso de bailes sensuales",
    opcion2: "Que haga un concurso de besos atrevidos"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de mango",
    opcion2: "Que sea con chupitos de licor de maracuyá"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que tu pareja te sorprenda con un guiño sexy",
    opcion2: "Que tú le sorprendas con un beso apasionado"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la abuela cante una canción atrevida",
    opcion2: "Que el abuelo baile un reggaetón"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de limón",
    opcion2: "Que sea con chupitos de licor de cereza"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que la luna de miel sea en una ciudad con playas paradisíacas",
    opcion2: "Que sea en una ciudad llena de vida nocturna"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el DJ ponga tu canción favorita en versión salsa",
    opcion2: "Que la ponga en versión bachata"
  },
  {
    pregunta: "¿Qué prefieres?",
    opcion1: "Que el brindis sea con chupitos de licor de vainilla",
    opcion2: "Que sea con chupitos de licor de canela"
  }
];

export default function Cuestionario() {
  const [respuestas, setRespuestas] = useState([]);

  const handleVoto = (index, opcion) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = opcion;
    setRespuestas(nuevasRespuestas);
  };

  return (
    <div className="cuestionario-container">
      <h2 className="titulo">¿Qué prefieres? 💥</h2>
      <p className="subtitulo">
        Responde preguntas un poco locas... ¡como esta boda! 💒
      </p>
      <p className="aclaracion">
        Las 10 respuestas más votadas se comunicarán durante la boda 🎤 a modo de experimento demoscópico,
        sin revelar quién ha votado qué. ¡Tu voto es anónimo pero cuenta mucho!
      </p>
      <div className="preguntas-lista">
        {preguntas.map((item, index) => (
          <div key={index} className="pregunta">
            <h3>{item.pregunta}</h3>
            <div className="opciones">
              <button
                className={`opcion ${respuestas[index] === item.opcion1 ? 'votada' : ''}`}
                onClick={() => handleVoto(index, item.opcion1)}
              >
                {item.opcion1}
                {respuestas[index] === item.opcion1 && <span> ✅</span>}
              </button>
              <span className="separador">😈</span>
              <button
                className={`opcion ${respuestas[index] === item.opcion2 ? 'votada' : ''}`}
                onClick={() => handleVoto(index, item.opcion2)}
              >
                {item.opcion2}
                {respuestas[index] === item.opcion2 && <span> ✅</span>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}