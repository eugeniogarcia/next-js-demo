import Head from 'next/Head'
import useSWR from 'swr'
import Layout from "../components/layout";

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