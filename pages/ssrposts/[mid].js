import Head from 'next/head'

import Layout from '../../components/layoutssr'
import Date from "../../components/date";

import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from "../../styles/utils.module.css";

/* Es muy parecido a lo que habríamos hecho en el caso de static rendering. El método que usamos es getServerSideProps en lugar de getStaticProps. Para construir la página dinámica no tenemos getStaticPaths */
export default function Post({ postData }) {
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

/* En SSR tenemos acceso al contexto. Podemos ver como con el contexto podemos ver los parametros con los que se ha hecho la llamada, de forma que podemos construir los datos con los que se debe hacer el renderizado */
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