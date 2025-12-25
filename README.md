# ⚡ UniFormX: Docs to Google Forms 

> **Automatización para convertir documentos de texto en Cuestionarios de Google autocalificables.**

![Status](https://img.shields.io/badge/Status-Pro-blueviolet)
![Platform](https://img.shields.io/badge/Platform-Google_Apps_Script-blue)
![User](https://img.shields.io/badge/Developed_for-Luis_Avilez-orange)
![AI](https://img.shields.io/badge/AI_Assisted-Gemini-743ad5)


Este proyecto permite a docentes y estudiantes  transformar un documento de Google Docs estructurado en un formulario de evaluación profesional, manejando tipos de datos complejos y configuraciones de validación automáticamente.

---

## ✨ Características

El motor de análisis ha sido refactored para mayor estabilidad y nuevas funciones:

- **🔒 Preguntas Obligatorias:** Soporte para el tag `[OBLIGATORIA]`.
- **📋 Menús Desplegables:** Nuevo soporte para el tipo de pregunta `[LISTA]`.
- **🧩 Lógica Modular:** Código separado por funciones de parsing y creación de items.
- **🛡️ Auto-Corrección:** Detección de errores de lógica (ej. múltiples respuestas en radio buttons) con cambio automático a `[CASILLAS]`.
- **📋 UI Mejorada:** Modal final con botón funcional de "Copiar enlace al portapapeles".

---

## 🛠️ Guía de Sintaxis (Tags Avanzados)

Para que el script procese el documento, cada bloque debe estar separado por una línea en blanco.

### 1. Etiquetas de Tipo de Pregunta
| Etiqueta | Tipo en Google Forms | Descripción |
|:---------|:---------------------|:------------|
| `[MULTIPLE]` | `MultipleChoiceItem` | Selección única (Radio). |
| `[CASILLAS]` | `CheckboxItem` | Selección múltiple (Checkboxes). |
| `[LISTA]` | `ListItem` | Menú desplegable de selección única. |
| `[VF]` | `MultipleChoiceItem` | Formato rápido Verdadero/Falso. |
| `[ABIERTA]` | `ParagraphTextItem` | Respuesta de texto largo. |

### 2. Modificadores Globales
- **Puntaje:** Se define entre paréntesis, ej: `(5 pts)`.
- **Obligatoriedad:** Añade `[OBLIGATORIA]` en cualquier parte del título para forzar la respuesta.
- **Respuestas:** Marca la(s) opción(es) correcta(s) con un asterisco `*`.

---

## 📌 Ejemplo de como escribir

Copia este ejemplo en tu Google Doc para probar las nuevas funciones:

```text
TITULO: Examen de Ingeniería de Software
DESC: Evaluación técnica sobre patrones y arquitectura.

[ABIERTA] [OBLIGATORIA] (5 pts) Explique el principio de Inversión de Dependencias (SOLID).

[LISTA] (2 pts) Seleccione el patrón de diseño que asegura una única instancia:
Factory
*Singleton
Observer
Strategy

[CASILLAS] (3 pts) Seleccione los componentes de una arquitectura MVC:
*Modelo
*Vista
*Controlador
Repositorio
Servicio

[VF] [OBLIGATORIA] (1 pts) JavaScript es un lenguaje de tipado fuerte.
Verdadero
*Falso
```

## ⚙️ Instalación y Uso

1. **Script:** Abre **Extensiones > Apps Script** en tu Doc y pega el código de `codigo.gs`.
2. **Menú:** Refresca el documento y busca el menú **⚡ UniFormX Pro**.
3. **Ejecución:** Selecciona **🚀 Generar Examen**.


## 🔍 Solución de Problemas

| Problema | Solución Automática |
| :--- | :--- |
| **Múltiples correctas en `[MULTIPLE]`** | El sistema cambia el tipo a `[CASILLAS]` automáticamente. |
| **Tags en minúsculas** | El motor es case-insensitive (`[lista]` = `[LISTA]`). |
| **Sin puntos definidos** | Se asignan `0 pts` por defecto. |
