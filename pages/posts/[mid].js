import Head from 'next/head'
import { useRouter } from "next/router";

import Layout from '../../components/layout'
import Date from "../../components/date";

import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from "../../styles/utils.module.css";

/* Es muy parecido a lo que habríamos hecho en el caso de ssr rendering. El método que usamos es getStaticProps en lugar de getServerSideProps. Adicionalmente tenemos que usar el método getStaticPaths para identificar las páginas que hay que crear en tiempo de compilación.

En Páginas dinámicas getStaticProps tiene como argumento un parametro con el id de la página a construir. Los id´s de las paginas los retorna getStaticPaths.

Podemos usar fallback. Si fallback es true la idea es que en caso de que la página solicitada no este disponible podamos crear una alternativa sobre la marcha. Si fallback es false retornara una página 404. 

De esta forma en getStaticPaths no tenemos que retornar el 100% de las páginas, podemos retornar las más usadas, por ejemplo, y si al mismo tiempo si se solicita una página rarita se hace la compilación sobre la marcha.

*/

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

export async function getStaticPaths() {
    const paths = getAllPostIds()
    return {
      paths,
      //fallback: false
      fallback: true,
    };
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.mid);
    return {
        props: {
            postData
        }
    }
}