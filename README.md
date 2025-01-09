# CroquetaBot

Este repositorio contiene un chatbot personalizado para Twitch, diseñado para el chat de [Rasenkai7](https://www.twitch.tv/rasenkai7) para interactuar con sus espectadores.

## Características

El bot responde a los siguientes comandos escritos en el chat del canal:

- Croquetas:
    - **!croqueta [usuario]**: Dar una croqueta a un usuario.
    - **!miscroquetas**: Mostrar las croquetas del usuaro.
    - **!topcroquetas**: Mostrar las croquetas más populares.

- Castigos:
    - **!castigo [usuario]**: Dar un castigo a un usuario.
    - **!miscastigos**: Mostrar los castigos del usuario.
    - **!topcastigos**: Mostrar los castigos más populares.

- Estudio:
    - **!estudiar**: Empezar el estudio.
    - **!noestudiar**: Terminar el estudio.
    - **!misestudios**: Mostrar el tiempo total del usuario.


## Requisitos

- **Lenguaje**: Node.js 20.6.0 o superior.
- **Dependencias**:
  - `mariadb`
  - `tmi.js`
  - `zod`

- **Cuenta de Twitch**: Una cuenta para el bot y su correspondiente token de acceso OAuth.


## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/jbr1989/CroquetaBot
   cd CroquetaBot
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Crea un archivo `.env` en el directorio principal con los parametros de `.env.example`.

4. Ejecuta el bot:
   ```bash
   pnpm dev
   ```


## Contribución

Si deseas contribuir:

1. Haz un fork del repositorio.
2. Crea una rama nueva para tu función o corrección.
3. Envía un pull request con una descripción clara de los cambios.


## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.


## Contacto

Si tienes alguna pregunta o sugerencia, puedes abrir un issue o contactarme directamente en [tu_email@ejemplo.com](mailto:tu_email@ejemplo.com).

