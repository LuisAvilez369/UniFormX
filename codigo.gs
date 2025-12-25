/**
 * UniFormX Pro - Generador de Exámenes Robusto
 * Desarrollado para Luis Avilez - Ingeniería en Sistemas
 */

// --- CONFIGURACIÓN GLOBAL ---
const TAGS = {
  ABIERTA: /\[ABIERTA\]/i,
  CASILLAS: /\[CASILLAS\]/i,
  VF: /\[VF\]/i,
  MULTIPLE: /\[MULTIPLE\]/i,
  LISTA: /\[LISTA\]/i,
  OBLIGATORIA: /\[OBLIGATORIA\]/i
};

function onOpen() {
  DocumentApp.getUi()
    .createMenu('⚡ UniFormX Pro')
    .addItem('🚀 Generar Examen', 'ejecutarGenerador')
    .addToUi();
}

function ejecutarGenerador() {
  const doc = DocumentApp.getActiveDocument();
  const bloques = doc.getBody().getText().split(/\n\s*\n/);
  const reporteLog = [];
  
  // 1. Procesar Encabezado
  let { titulo, descripcion } = extraerEncabezado(bloques[0]);
  
  const form = FormApp.create(titulo);
  form.setDescription(descripcion).setIsQuiz(true);

  // 2. Procesar Preguntas
  for (let i = 1; i < bloques.length; i++) {
    let bloqueRaw = bloques[i].trim();
    if (!bloqueRaw) continue;

    try {
      procesarBloquePregunta(form, bloqueRaw, i, reporteLog);
    } catch (e) {
      reporteLog.push(`🔥 Error Crítico Bloque ${i}: ${e.message}`);
    }
  }

  mostrarModalFinal(form.getEditUrl(), form.getPublishedUrl(), reporteLog);
}

/**
 * Procesa un bloque de texto y lo convierte en un Item del Formulario
 */
function procesarBloquePregunta(form, bloque, index, logs) {
  const lineas = bloque.split('\n').filter(l => l.trim().length > 0);
  let encabezado = lineas[0].trim();
  const opcionesRaw = lineas.slice(1);

  // Detección de configuración
  const esObligatoria = TAGS.OBLIGATORIA.test(encabezado);
  const puntos = extraerPuntos(encabezado);
  const tipo = detectarTipo(encabezado);
  const tituloLimpio = limpiarTitulo(encabezado);

  // Procesar Opciones
  let { opciones, correctas } = procesarOpciones(opcionesRaw);

  // Validación de seguridad: Auto-corrección a Casillas
  let tipoFinal = (tipo === "MULTIPLE" && correctas > 1) ? "CASILLAS" : tipo;
  if (tipo !== tipoFinal) logs.push(`🔧 P${index}: Auto-cambio a CASILLAS (múltiples respuestas).`);

  // Creación del Item según tipo
  let item;
  switch (tipoFinal) {
    case "ABIERTA":
      item = form.addParagraphTextItem();
      break;
    case "CASILLAS":
      item = form.addCheckboxItem();
      break;
    case "LISTA":
      item = form.addListItem();
      break;
    default: // MULTIPLE y VF
      item = form.addMultipleChoiceItem();
  }

  item.setTitle(tituloLimpio).setPoints(puntos).setRequired(esObligatoria);
  
  if (tipoFinal !== "ABIERTA") {
    if (opciones.length === 0) throw new Error("Pregunta sin opciones de respuesta.");
    const choices = opciones.map(op => item.createChoice(op.texto, op.esCorrecta));
    item.setChoices(choices);
  }
}

// --- FUNCIONES HELPER (UTILIDADES) ---

function extraerEncabezado(bloque) {
  let titulo = "Examen UniFormX";
  let descripcion = "Generado automáticamente";
  bloque.split('\n').forEach(l => {
    if (/^TITULO:/i.test(l)) titulo = l.replace(/^TITULO:/i, "").trim();
    if (/^DESC:/i.test(l)) descripcion = l.replace(/^DESC:/i, "").trim();
  });
  return { titulo, descripcion };
}

function detectarTipo(texto) {
  if (TAGS.ABIERTA.test(texto)) return "ABIERTA";
  if (TAGS.CASILLAS.test(texto)) return "CASILLAS";
  if (TAGS.VF.test(texto)) return "VF";
  if (TAGS.LISTA.test(texto)) return "LISTA";
  return "MULTIPLE";
}

function extraerPuntos(texto) {
  const match = texto.match(/\(\s*(\d+)\s*(pts|puntos|p)?\s*\)/i);
  return match ? parseInt(match[1]) : 0;
}

function limpiarTitulo(texto) {
  return texto
    .replace(/\[.*?\]/g, "") // Quita etiquetas [TIPO]
    .replace(/\(.*\)/g, "")  // Quita (puntos)
    .trim();
}

function procesarOpciones(lineas) {
  let correctas = 0;
  const opciones = lineas.map(l => {
    let esCorrecta = l.trim().startsWith("*");
    if (esCorrecta) correctas++;
    return {
      texto: esCorrecta ? l.trim().substring(1).trim() : l.trim(),
      esCorrecta: esCorrecta
    };
  });
  return { opciones, correctas };
}

// --- INTERFAZ DE USUARIO ---

function mostrarModalFinal(editUrl, pubUrl, logs) {
  const logHtml = logs.length > 0 
    ? `<div style="background:#fff3cd;padding:10px;border-radius:4px;font-size:11px;text-align:left;max-height:80px;overflow-y:auto;margin-bottom:15px;border:1px solid #ffeeba;">${logs.join('<br>')}</div>`
    : `<p style="color:green;font-size:12px;">✅ ¡Todo perfecto!</p>`;

  const uiHtml = `
    <div style="font-family:sans-serif; text-align:center; padding:10px;">
      <h2 style="color:#2E7D32;">🏁 ¡Examen Generado!</h2>
      ${logHtml}
      <a href="${editUrl}" target="_blank" style="text-decoration:none;">
        <button style="background:#1976D2;color:white;padding:12px;border:none;border-radius:4px;width:100%;cursor:pointer;font-weight:bold;">📝 EDITAR FORMULARIO</button>
      </a>
      <p style="font-size:11px; color:#666; margin-top:20px;">Enlace para estudiantes:</p>
      <input type="text" id="linkPub" value="${pubUrl}" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;" readonly>
      <button onclick="copiarLink()" style="margin-top:10px; background:#f5f5f5; border:1px solid #ccc; padding:5px 10px; cursor:pointer; border-radius:4px; font-size:11px;">📋 Copiar Enlace</button>
      
      <script>
        function copiarLink() {
          var copyText = document.getElementById("linkPub");
          copyText.select();
          document.execCommand("copy");
          alert("Enlace copiado al portapapeles");
        }
      </script>
    </div>
  `;
  
  const modal = HtmlService.createHtmlOutput(uiHtml).setWidth(400).setHeight(450);
  DocumentApp.getUi().showModalDialog(modal, 'Resultado del Proceso');
}