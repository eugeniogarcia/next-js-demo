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

## Páginas

- __Página de inicio__. `/Pages/index.js` es el punto de entrada por defecto, y enruta al componente index.js
- __Enrutado__. Las páginas pueden hacer referencia a componentes como cualquier componente react. Recibiran sus `props` como cualquier componente react
- __Best practices__:
    - Usar plantillas. Podemos definir un componente, en nuestro caso le hemos llamado `Layout`, donde incluir todo el formato que queremos tener igual en todas las páginas
    - Usar el componente Head incluido con Next - `import Head from 'next/head'`. Nos permite añadir varios metadatos. En el componente `layout` podemos ver un uso extensivo de `Head`
    - La navegacion entre pagina hacerla usado `import Link from "next/link"`
        1. Navegacion a página dinámica. Indicamos como determinar la página dinámica en función de los path parameters

        ```js
        <Link href="/posts/[id]" as={`/posts/${id}`}> <a>{title}</a></Link>
        ```

        2. Podemos dotar de estilos al link, y componerlo con otros elementos html o react 

        ```js
        <Link href="/"><a className={utilStyles.colorInherit}>{name}</a></Link>
        ```
- __Estilos__. Usamos estilos encapsulados en modulos. Podemos tener un módulo global - que cargaremos en `_app.js`, pero cada componente carga sus propios estilos, de modo que no interferirarn unos con otros. En el folder donde tenemos los componentes, en nuestro caso `components`, hemos creado archvos `xxxx.module.css` con los estilos del componente `xxxx`. También hemos creado una carpeta llamada `styles` donde hemos guardado estilos comunes que queremos referenciar desde varios lugares. Lo importante es que el estilo `global`, el que hemos cargado con `_app.js` estara disponible en toda la aplicación, y el resto de estilos habrá que importarlos si los necesitamos usar en un componente, como haríamos con cualquier otro módulo js
- __Lazy Load__. Los componentes que no sean necesarios para empezar a operar con la aplicación podemos cargarlos de forma diferida. Por lo demás, los componentes se usan como cualquier otro

```js
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```

### Rutas

El folder pages contiene todos los componentes "navegables" de la aplicación. La posición del componente dentro del directorio se utiliza para crear las Routes automáticamente. Podemos usar `<Link>` para navegar entre páginas. Basta con indicar la ruta y next ya sabe que componente mapear con la ruta, porque la ruta coincide con la estructura de directorios definida bajo `pages`.

También podemos usar la api de navegación `import Router from 'next/router'`. 

```js
function About() {
    return (
      <Layout>
        <div className={(utilStyles.lightText, utilStyles.headingMd)}>
          Por defecto se hace static redering
        </div>
        <button onClick={() => Router.push("/")}>Atras</button>
      </Layout>
    );
}
```

## APIs

Lo que guardemos en el directorio `/pages/api` se trata como una api Rest. Podemos gestionar diferentes métodos Rest. En `usuario.js` tenemos un ejemplo básico:

```js
export default (req, res) => {
    if (req.method === 'POST') {
        // Process a POST request
    } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ name: 'John Doe' }))
    }
}
```

## Hook para datos dinámicos

Cuando sea necesario hacer client rendering, y recuperar datos de forma dinámica en el cliente, next ofrece un React hook llamado `swr` - `import useSWR from 'swr'`:

```js
function Profile() {
    const { data, error } = useSWR('/api/user', fetch)

    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    return (
        <Layout>
            <Head>
                <title>Client Side Rendering</title>
            </Head>
            <div>hello {data.name}!</div>
        </Layout>
    );
}
```

En este ejemplo no lo hemos utilizado, pero `fetch` sería un callback que se invocaría con la respuesta del hook.

## Compilación estática

El modo por defecto de entregar una página con next es la compilación estática. Lo que se entrega desde el servidor es una página estática, html puro. El renderizado se hace en el servidor, y lo que se genera es html, nada de javascript. Next identifica que queremos hacer una página estática cuando incluimos con la página el método `getStaticProps`:

```js
export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
```

El metodo retorna un objeto que se le podrá pasar como argumento de entrada a la funcion/componente react. Lo que hará el servidor es que cuando vea una página con `getStaticProps`, ejecutar el método y la respuesta la pasara como argumento al componente react, que se renderizará en el servidor, de modo que lo que se devuelva sea el html resultante. Por ejemplo, el componente:

```js
export default function Home({ allPostsData } ) {
  return (
    <Layout home={true}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
    
...
```

### Páginas dinámicas

Se llaman páginas dinamicas a aquellas que se compilan con una plantilla. El nombre de la página tendrá un `[]`. En pocas palbras podemos crear dinámicamente n instancias de un página que que tenga una plantilla determinada - en la que solo varía el contenido, y el contenido no depende del cliente, es estático. 

Para crear esta páginas usaremos `getStaticProps({ params })`, pero con un argumento de entrada. En el argumento se pasaran los datos de cada una de las instancias de la página a crear. Necesitamos otra funcion que nos devuelva un array con los nombres de las páginas a crear. Si el array devuelve 33 valores, se crearán y compilaran de forma estática 33 páginas:

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

Es decir, debe incluir el id de la página. Este parámetro se pasa como argumento a `getStaticProps`, de modo que podremos generar los objetos con los datos a utilizar en cada página.

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

### fallback

Con fallback indicamos que debe suceder si buscasemos una página que no se hubiera compilado. Una opción es que se retorne un error - página no encontrada -, `fallback=false`, la otra seria que se compilase la página en ese momento, y tras la compilación, devolver el resultado de la compilación. Lo que este nos permite es que `getStaticPaths` no tenga porque ser exahustivo, que retorne solamente los paths más habituales, y que al mismo tiempo si navegasemos a una página no disponible, se haga la compilación sobre la marcha, llamando a `getStaticProps({ params })` - usando como argumento el id de la página que se está solicitando - y renderizando la página con esta respuesta.

```js
export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
      paths,
      fallback: true,
    };
}
```

En el caso de que usemos fallback, podemos mostrar un mensaje cuando hemos solicitado una página que no existe, y mientras la página se compila. Empezamos usando la api de `import { useRouter } from "next/router";`, preguntando si estamos en modo fallback, y si lo estamos, retornando la página transitoria. En caso de no estarlo seguimos con la construcción normal:

```js
export default function Post({ postData }) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
```

## Server Side Rendering

Next también soporta server side rendering. Next identifica que queremos hacer SSR si con la página incluimos el método `getServerSideProps`:

```js
export async function getServerSideProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
```

Funciona similar al método `getStaticProps` de las páginas estáticas.

### Páginas Dinámicas con SSR

También podemos crear dinámicamente paginas SSR. En este caso tenemos acceso al contexto de la petición. Con el contexto podemos ver los parametros con los que se ha hecho la llamada, y de esta forma podremos construir una página con los datos específicos con los que hay que hacer el renderizado:

```js
export async function getServerSideProps(context) {
  console.log("Pagina solicitada: ",context.params.mid);
  console.log("Query string: ", context.query);
  console.log("Pagina solicitada: ", context.query.mid);
  const postData = await getPostData(context.params.mid);
    return {
        props: {
            postData
        }
    }
}
```

## Páginas de error

Cuando se devuelva un error, podemos generar una página especializada para renderizarlo. Por ejemplo, si queremos una página customo para los http error code 404, creamos una página llamada `404.js` con el error.

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

### CORS

```ps
npm i cors --save
```
