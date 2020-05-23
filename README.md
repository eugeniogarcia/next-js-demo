# Introducción

## Instalación

### Crear la app

Creamos una app con:

```ps
npm init next-app
```

Creamos la app basandonos en el template de aplicación definido en un repositorio en git:

```ps
npm init next-app nextjs-blog --example "https://github.com/zeit/next-learn-starter/tree/master/learn-starter"
```

## Compilación estática

Hay que incluir un método:

```js
export async function getStaticProps({ params }) {
    const postData = getPostData(params.mid)
    return {
        props: {
            postData
        }
    }
}
```

que tiene que devolver un objeto con clave `props` y que contenga una serie de campos. Los campos los podremos usar en el renderizado estático:

```js
export default function Post({ postData }) {
    return (
        <Layout>
...
```

El argumento `getStaticProps({ params })` es opcional, y obligatorio en el caso de páginas dinámicas. 

Se llaman páginas dinamicas a aquellas que se compilan con una plantilla. El nombre de la página tendrá un `[]`. Para crear esta páginas ademas de usar `getStaticProps({ params })` necesitamos otra funcion que nos devuelva un array con los nombres de las páginas a crear:

```js
export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
        paths,
        fallback: false
    }
}
```

Si la página se llama `[mid].js`, entonces el array tendrá que ser como sigue:

```json
[
    {
        params: {
            mid: 'ssg-ssr'
        }
    },
    {
        params: {
            mid: 'pre-rendering'
        }
    }
]
```

## Librerias usadas

### Gray Matter

Para convertir archivos con markup en json, se usa una librería llamada [gray matter](https://github.com/jonschlinkert/gray-matter).

```ps
npm install gray-matter --s
```

### Render html

Para convertir en html el contenido definido en un mark-up. Primero creamos un json con el mark-up utilizando gray-matter, y luego creamos el html:

```ps
npm install remark remark-html --s
```

### Gestionar Fechas

```ps
npm install date-fns --s
```
