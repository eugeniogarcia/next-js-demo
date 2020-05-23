import Head from 'next/head'

import Layout from '../../components/layoutssr'
import Date from "../../components/date";

import { getAllPostIds, getPostData } from '../../lib/posts'
import utilStyles from "../../styles/utils.module.css";

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