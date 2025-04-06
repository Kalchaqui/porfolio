let estadoDelJuego = {
    jugador: {
      salud: 100,
      posicion: "sala de máquinas",
      armas: [],
      decisiones: [],
      registros: 0,
      puntuacion: 0,
      turnosSinMover: 0
    },
    alien: {
      cerca: false,
      enRastro: true,
      vecesHuidas: 0
    },
    nave: {
      turnosRestantes: 10
    },
    dificultad: "normal"
  };
  
  // Variable para determinar aleatoriamente dónde aparece el hangar
  let hangarUbicacion = null;
  function determinarHangar() {
    const opciones = ["sala de control", "sala de armas", "puesto médico"];
    hangarUbicacion = opciones[Math.floor(Math.random() * opciones.length)];
  }
  
  // Gestión del audio de fondo
  let audio = document.getElementById('background-audio');
  let haInteractuado = false;
  
  function reproducirAudio() {
    if (!haInteractuado) {
      audio.play().then(() => {
        console.log("Música reproduciéndose correctamente");
        haInteractuado = true;
      }).catch(error => {
        console.log("Error al reproducir música:", error);
      });
    }
  }
  
  audio.addEventListener('loadeddata', () => {
    console.log("Audio cargado, listo para reproducir");
  });
  
  // Función para actualizar el estado del juego en la página
  function actualizarEstado() {
    const estadoElemento = document.getElementById('estadoJuego');
    const inventarioElemento = document.getElementById('inventario');
    estadoElemento.textContent = `Salud: ${estadoDelJuego.jugador.salud} | Posición: ${estadoDelJuego.jugador.posicion} | Turnos restantes: ${estadoDelJuego.nave.turnosRestantes} | Puntuación: ${estadoDelJuego.jugador.puntuacion} | Registros: ${estadoDelJuego.jugador.registros}/3`;
    inventarioElemento.textContent = `Inventario: ${estadoDelJuego.jugador.armas.join(', ') || 'Ninguno'}`;
  }
  
  // Función para actualizar la narrativa y opciones en la página
  function actualizarNarrativa(mensaje, mostrarOpciones = true) {
    const narrativaElemento = document.getElementById('narrativa');
    const opcionesElemento = document.getElementById('opciones');
    narrativaElemento.textContent = mensaje;
  
    if (estadoDelJuego.jugador.salud < 30) {
      narrativaElemento.classList.add('bajo-salud');
    } else {
      narrativaElemento.classList.remove('bajo-salud');
    }
    if (estadoDelJuego.alien.cerca) {
      narrativaElemento.classList.add('alien-cerca');
    } else {
      narrativaElemento.classList.remove('alien-cerca');
    }
  
    // Solo pausar la música al finalizar el juego completamente
    if (estadoDelJuego.jugador.salud <= 0 || estadoDelJuego.nave.turnosRestantes <= 0) {
      audio.pause();
      console.log("Música pausada: juego terminado (derrota)");
      opcionesElemento.innerHTML = `<button onclick="reiniciarJuego('${estadoDelJuego.dificultad}')">Jugar de nuevo</button>`;
    } else if (estadoDelJuego.jugador.posicion === "nave de escape") {
      audio.pause();
      console.log("Música pausada: victoria");
      let finalMensaje = estadoDelJuego.jugador.armas.includes("pistola de plasma") ? "¡Escapaste tras derrotar al alien y salvaste la nave! ¡Victoria heroica!" : "¡Sobreviviste!, ¿Pero el único alien?";
      if (estadoDelJuego.jugador.registros >= 3) finalMensaje += " Descubriste la verdad tras los registros.";
      narrativaElemento.textContent = `${finalMensaje} Puntuación: ${estadoDelJuego.jugador.puntuacion}`;
      opcionesElemento.innerHTML = `<button onclick="reiniciarJuego('${estadoDelJuego.dificultad}')">Jugar de nuevo</button>`;
    } else if (mostrarOpciones && estadoDelJuego.jugador.salud > 0) {
      if (estadoDelJuego.jugador.posicion === "sala de máquinas") {
        opcionesElemento.innerHTML = `
          <button onclick="tomarDecision('A')">Ir a pasillo principal</button>
        `;
      } else if (estadoDelJuego.jugador.posicion === "pasillo principal") {
        opcionesElemento.innerHTML = `
          <button onclick="tomarDecision('B')">Ir a sala de control</button>
          <button onclick="tomarDecision('C')">Ir a sala de armas</button>
          <button onclick="tomarDecision('E')">Volver a sala de máquinas</button>
          <button onclick="tomarDecision('F')">Ir a puesto médico</button>
        `;
      } else if (estadoDelJuego.jugador.posicion === "sala de control") {
        let opciones = `<button onclick="tomarDecision('A')">Volver al pasillo principal</button>`;
        if (hangarUbicacion === "sala de control") {
          opciones += `<button onclick="tomarDecision('D')">Ir al hangar</button>`;
        }
        opcionesElemento.innerHTML = opciones;
      } else if (estadoDelJuego.jugador.posicion === "sala de armas") {
        let opciones = `<button onclick="tomarDecision('A')">Volver al pasillo principal</button>`;
        if (hangarUbicacion === "sala de armas") {
          opciones += `<button onclick="tomarDecision('D')">Ir al hangar</button>`;
        }
        opcionesElemento.innerHTML = opciones;
      } else if (estadoDelJuego.jugador.posicion === "puesto médico") {
        let opciones = `<button onclick="tomarDecision('A')">Volver al pasillo principal</button>`;
        if (hangarUbicacion === "puesto médico") {
          opciones += `<button onclick="tomarDecision('D')">Ir al hangar</button>`;
        }
        opcionesElemento.innerHTML = opciones;
      } else if (estadoDelJuego.jugador.posicion === "hangar") {
        opcionesElemento.innerHTML = `
          <button onclick="tomarDecision('G')">Ir a nave de escape</button>
        `;
      }
    } else {
      opcionesElemento.innerHTML = ''; // Para eventos como combate, no pausar la música aquí
    }
  }
  
  // Función para que el jugador tome una decisión
  function tomarDecision(opcion) {
    if (estadoDelJuego.jugador.salud <= 0 || estadoDelJuego.nave.turnosRestantes <= 0) {
      actualizarNarrativa("Tu salud ha llegado a 0 o la nave colapsó. ¡Game Over!", false);
      return;
    }
  
    estadoDelJuego.nave.turnosRestantes--;
    estadoDelJuego.jugador.puntuacion += 10; // Puntos por explorar
    let posicionAnterior = estadoDelJuego.jugador.posicion;
    let mensajeBase = "";
  
    if (opcion === "A" && estadoDelJuego.jugador.posicion === "sala de máquinas") {
      estadoDelJuego.jugador.posicion = "pasillo principal";
      estadoDelJuego.jugador.decisiones.push("Fue al pasillo principal");
      mensajeBase = "Llegaste al pasillo principal. Las luces parpadean y el silencio es inquietante.";
    } else if (opcion === "A" && (estadoDelJuego.jugador.posicion === "sala de control" || estadoDelJuego.jugador.posicion === "sala de armas" || estadoDelJuego.jugador.posicion === "puesto médico")) {
      estadoDelJuego.jugador.posicion = "pasillo principal";
      estadoDelJuego.jugador.decisiones.push("Volvió al pasillo principal");
      mensajeBase = "Regresaste al pasillo principal. ¿Hacia dónde sigues?";
    } else if (opcion === "B" && estadoDelJuego.jugador.posicion === "pasillo principal") {
      estadoDelJuego.jugador.posicion = "sala de control";
      estadoDelJuego.jugador.decisiones.push("Fue a la sala de control");
      mensajeBase = "Llegaste a la sala de control. Todo parece estar en calma, por ahora.";
    } else if (opcion === "C" && estadoDelJuego.jugador.posicion === "pasillo principal") {
      estadoDelJuego.jugador.posicion = "sala de armas";
      estadoDelJuego.jugador.decisiones.push("Fue a la sala de armas");
      mensajeBase = "Llegaste a la sala de armas, pero está vacía. no es una Nave militar";
    } else if (opcion === "D" && (estadoDelJuego.jugador.posicion === "sala de control" || estadoDelJuego.jugador.posicion === "sala de armas" || estadoDelJuego.jugador.posicion === "puesto médico")) {
      estadoDelJuego.jugador.posicion = "hangar";
      estadoDelJuego.jugador.decisiones.push("Fue al hangar");
      mensajeBase = "Llegaste al hangar. La nave de escape Kalchaqui está a pocos pasos.";
    } else if (opcion === "E" && estadoDelJuego.jugador.posicion === "pasillo principal") {
      estadoDelJuego.jugador.posicion = "sala de máquinas";
      estadoDelJuego.jugador.decisiones.push("Volvió a la sala de máquinas");
      mensajeBase = "Regresaste a la sala de máquinas. El lugar sigue en caos.";
    } else if (opcion === "F" && estadoDelJuego.jugador.posicion === "pasillo principal") {
      estadoDelJuego.jugador.posicion = "puesto médico";
      estadoDelJuego.jugador.decisiones.push("Fue al puesto médico");
      mensajeBase = "En el puesto médico hay un olor nauseabundo, los cuerpos están en las camillas y el médico descuartizado.";
    } else if (opcion === "G" && estadoDelJuego.jugador.posicion === "hangar") {
      estadoDelJuego.jugador.posicion = "nave de escape";
      estadoDelJuego.jugador.decisiones.push("Fue a la nave de escape");
      actualizarNarrativa("¡Llegaste a la Misión Kalchaqui y lograste escapar!", true);
      actualizarEstado();
      return;
    }
  
    // Daño ambiental si no te mueves
    if (estadoDelJuego.jugador.posicion === posicionAnterior) {
      estadoDelJuego.jugador.turnosSinMover++;
      if (estadoDelJuego.jugador.turnosSinMover >= 2) {
        estadoDelJuego.jugador.salud -= 5;
        mensajeBase += " El humo tóxico te afecta, pierdes 5 de salud.";
      }
    } else {
      estadoDelJuego.jugador.turnosSinMover = 0;
    }
  
    // Eventos aleatorios
    let probabilidadAlien = estadoDelJuego.dificultad === "fácil" ? 0.3 : estadoDelJuego.dificultad === "difícil" ? 0.7 : 0.5;
    if (estadoDelJuego.jugador.posicion === "puesto médico") probabilidadAlien = 0.2;
    if (estadoDelJuego.jugador.armas.includes("linterna")) probabilidadAlien -= 0.2;
  
    if (Math.random() < probabilidadAlien) {
      estadoDelJuego.alien.cerca = true;
      actualizarNarrativa(`${mensajeBase} ¡Un ruido escalofriante te alerta! El bicho está cerca. ¿Qué haces?`, false);
      mostrarOpcionesCombate();
    } else {
      if (Math.random() < 0.2 && !estadoDelJuego.jugador.armas.includes("kit de primeros auxilios") && estadoDelJuego.jugador.posicion !== "puesto médico") {
        estadoDelJuego.jugador.armas.push("kit de primeros auxilios");
        mensajeBase += " Encontraste un kit de primeros auxilios.";
      }
      if (Math.random() < 0.2 && !estadoDelJuego.jugador.armas.includes("linterna")) {
        estadoDelJuego.jugador.armas.push("linterna");
        mensajeBase += " Encontraste una linterna.";
      }
      if (Math.random() < 0.1) {
        estadoDelJuego.jugador.salud -= 10;
        mensajeBase += " Un panel eléctrico roto te electrocuta, pierdes 10 de salud.";
      }
      if (Math.random() < 0.3 && estadoDelJuego.jugador.registros < 3) {
        estadoDelJuego.jugador.registros++;
        estadoDelJuego.jugador.puntuacion += 50;
        mensajeBase += ` Encuentras un registro: "Registro #${estadoDelJuego.jugador.registros}: ${estadoDelJuego.jugador.registros === 1 ? 'El experimento falló...' : estadoDelJuego.jugador.registros === 2 ? 'No podemos contenerlo...' : 'Nos traicionaron desde dentro...'}"`;
      }
      if (estadoDelJuego.jugador.posicion === "sala de armas" && Math.random() < 0.5 && !estadoDelJuego.jugador.armas.includes("pistola de plasma")) {
        estadoDelJuego.jugador.armas.push("pistola de plasma");
        mensajeBase += " Encontraste solo una pistola de plasma. No es una nave militar";
      }
      if (estadoDelJuego.jugador.posicion === "puesto médico" && Math.random() < 0.5 && estadoDelJuego.jugador.salud < 100) {
        estadoDelJuego.jugador.salud = 100;
        mensajeBase += " Encuentras suministros médicos de entre los cuerpos y te curas completamente.";
      }
      if (Math.random() < 0.1) {
        mensajeBase += " Escuchas un crujido, pero solo es un conducto que se rompió en ese instante.";
      }
      actualizarNarrativa(mensajeBase, true);
    }
  
    if (estadoDelJuego.nave.turnosRestantes <= 0) {
      actualizarNarrativa("La nave colapsó antes de que pudieras escapar. ¡Game Over!", false);
    }
    actualizarEstado();
  }
  
  // Función para mostrar opciones de combate
  function mostrarOpcionesCombate() {
    const opcionesElemento = document.getElementById('opciones');
    opcionesElemento.innerHTML = `
      <button onclick="luchar(true)">Luchar</button>
      <button onclick="luchar(false)">Huir</button>
    `;
  }
  
  // Función para manejar la decisión de luchar o huir
  function luchar(decision) {
    if (estadoDelJuego.alien.cerca) {
      if (decision) {
        if (estadoDelJuego.jugador.armas.includes("pistola de plasma")) {
          if (Math.random() < 0.5) {
            estadoDelJuego.jugador.puntuacion += 100;
            actualizarNarrativa("Disparas al alien con tu pistola de plasma. ¡Lo hieres y huyes!", true);
            estadoDelJuego.alien.cerca = false;
            estadoDelJuego.alien.enRastro = false;
            estadoDelJuego.alien.vecesHuidas = 0;
          } else {
            estadoDelJuego.jugador.salud -= 40;
            actualizarNarrativa("Disparas al alien, pero fallas. ¡Te ataca y pierdes 40 de salud!", true);
            estadoDelJuego.alien.cerca = false;
          }
        } else {
          estadoDelJuego.jugador.salud -= 100;
          actualizarNarrativa("Intentas enfrentarte al alien sin armas, es inútil, el terror y tu sangre brotan de forma imparable. Mueres.", false);
        }
      } else {
        estadoDelJuego.jugador.salud -= 20;
        estadoDelJuego.alien.vecesHuidas++;
        estadoDelJuego.alien.cerca = false;
        if (estadoDelJuego.alien.vecesHuidas >= 3) {
          actualizarNarrativa("El alien te sigue de cerca, ¡no puedes correr más! Te ataca sin piedad.", false);
          estadoDelJuego.jugador.salud = 0;
        } else {
          actualizarNarrativa("Decides no luchar y corres, pero el alien te alcanza y te hiere. Pierdes 20 de salud.", true);
        }
      }
    }
    actualizarEstado();
  }
  
  // Función para iniciar el juego con dificultad
  function iniciarJuego(dificultad) {
    estadoDelJuego = {
      jugador: {
        salud: dificultad === "fácil" ? 150 : dificultad === "difícil" ? 80 : 100,
        posicion: "sala de máquinas",
        armas: [],
        decisiones: [],
        registros: 0,
        puntuacion: 0,
        turnosSinMover: 0
      },
      alien: {
        cerca: false,
        enRastro: true,
        vecesHuidas: 0
      },
      nave: {
        turnosRestantes: dificultad === "fácil" ? 15 : dificultad === "difícil" ? 8 : 10
      },
      dificultad: dificultad
    };
    determinarHangar();
    haInteractuado = false; // Reinicia para que la música comience de nuevo
    audio.currentTime = 0; // Reinicia la música al inicio
    reproducirAudio(); // Intenta reproducir la música al iniciar
    actualizarNarrativa("La alarma de emergencia resuena. Estás atado, pero logras liberarte. Te encuentras en una nave de colonos en el espacio. Una criatura se ha liberado, y la tripulación ya no existe. Eres el único sobreviviente, y tu única esperanza es llegar a la nave de escape Kalchaqui. El sistema está colapsando y algo acecha en las sombras. ¿Qué harás?", true);
    actualizarEstado();
  }
  
  // Función para reiniciar el juego
  function reiniciarJuego(dificultad) {
    iniciarJuego(dificultad);
  }
  
  // Inicialización inicial (pantalla de dificultad)
  actualizarEstado();
  document.addEventListener('click', reproducirAudio);