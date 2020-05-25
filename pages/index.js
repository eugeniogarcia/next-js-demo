import Head from 'next/head'
import Link from "next/link";

import Layout, { siteTitle } from '../components/layout'
import Date from "../components/date";

import utilStyles from '../styles/utils.module.css'

import { getSortedPostsData } from "../lib/posts";

import dynamic from 'next/dynamic'
const DynamicComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)

export default function Home({ allPostsData } ) {
  return (
    <Layout home={true}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Static Rendering</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
      <div>
        <DynamicComponent/>
      </div>
    </Layout>
  );
};


export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

//Prefetch llamando a una api
/*
import fetch from 'node-fetch'

export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from an external API endpoint
  const res = await fetch("..");
  return res.json();
}
*/

//Prefetch desde una base de datos
/*
import someDatabaseSDK from 'someDatabaseSDK'

const databaseClient = someDatabaseSDK.createClient(...)

export async function getSortedPostsData() {
  // Instead of the file system,
  // fetch post data from a database
  return databaseClient.query('SELECT posts...')
}
*/